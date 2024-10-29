import { ActivityIndicator, Image, StyleSheet, Pressable, View, Text} from 'react-native';
import React, { useEffect, createContext, useContext, useState } from 'react';
//Themed
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

//DB
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

//Icon
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const db = SQLite.openDatabaseAsync('profiles.db');

export default function HomeScreen() {
  const [isloading, setLoading] = useState(true);
  const [isPressed, setPressed] = useState(false); // pressed 상태 관리
  const [imageUri, setImageUri] = useState<string | null>(null); // 실시간 스트림 이미지 URI 상태

  const handlePress = () => {
    setPressed(!isPressed); // pressed 상태를 토글
  };

  
  // 데이터베이스 초기화
  useEffect(() => {
    const initializeDatabase = async () => {
      const db = await SQLite.openDatabaseAsync('profiles.db');
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          image TEXT,
          name TEXT NOT NULL,
          relationship TEXT NOT NULL,
          gender TEXT,
          memo TEXT NOT NULL
        );
      `);
      setLoading(false); // 초기화가 완료되면 로딩 상태를 false로 변경
    };

    initializeDatabase();
  }, []);

  // 실시간 스트림 가져오는 함수
  useEffect(() => {
    if (isPressed) {
      const fetchFrame = async () => {
        try {
          const response = await fetch("http://<라즈베리파이_IP>:5000/video_feed");
          const blob = await response.blob();
          setImageUri(URL.createObjectURL(blob));
        } catch (error) {
          console.error("Error fetching frame:", error);
        }
      };
      const intervalId = setInterval(fetchFrame, 100);  // 100ms 간격으로 이미지 갱신
      return () => clearInterval(intervalId);
    } else {
      setImageUri(null);  // 버튼을 누르지 않으면 이미지 초기화
    }
  }, [isPressed]);
  return (
    <ThemedView style={styles.Container}>
      {isPressed ? (
        !isloading ? (
          <ThemedView style={styles.top}>
              <View style={styles.logo}>
                <Image
                  style={{ 
                    width: 40, 
                    height: 45, 
                  }}
                  source={require('@/assets/images/ID-B_logo.png')} // 로고 이미지 경로 설정
                  resizeMode="contain"
                />
              </View>
              <View style={styles.chat_bubble}>
                <Text style={styles.chat}>안녕하세요, Eunjin님! </Text>
              </View>
              {/* 실시간 영상 표시 부분 */}
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.stream} />
              ) : (
                <ThemedText>스트리밍을 불러오는 중...</ThemedText>
              )}
          </ThemedView>
        ):(
            <ThemedView style={styles.top}>
              <ActivityIndicator size="large" color="#4169e1" />
              <ThemedText>로딩 중...</ThemedText>
            </ThemedView>
          
        )
      ) : (
        <ThemedView style={[styles.top]} lightColor="#dee2e6" darkColor="#212529">
          <MaterialCommunityIcons name="video-off" size={100} color="#4169e1"/>
          <ThemedText>카메라가 꺼져있습니다.</ThemedText>
        </ThemedView>
      )}
      <ThemedView style={styles.bottom}>
        <Pressable 
          onPress={handlePress}
          style={({pressed}) => [
            {
              backgroundColor: pressed? '#4169e1': 'white',
              borderColor: pressed? 'white':'#4169e1',
              borderWidth: pressed? 0: 3,
              paddingLeft: !isPressed ? 5 : 0,
            },
            styles.play_btn,
          ]}
        >
          {({pressed})=>(
            <Ionicons
              name={pressed && isPressed ? "stop" : !isPressed ? "play" : "stop"}
              size={50}
              color={pressed ? "white" : "#4169e1"}
          />
          )}
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: 'column', 
  },
  top: {
    justifyContent: 'center', 
    alignItems: 'center', 
    flex:7,
  },
  bottom: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 20,
  },

  play_btn:{
    alignItems:'center',
    justifyContent:'center',
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  logo : {
      position: 'absolute',
      top: 50,
      right: 15,
      shadowColor: '#4169e1', 
      shadowOpacity: 0.5,  // 그림자의 투명도
      shadowRadius: 8,    // 블러 강도
      shadowOffset: {
        width: 0,
        height: 4,         // 그림자의 위치
      },
      elevation: 10,
    },
  chat_bubble: {
    position: 'absolute',
    top: 55,
    right: 65,
    backgroundColor: 'lightgray',
    padding: 8,
    paddingLeft: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: 'lightgray',
    shadowOpacity: 0.5,  // 그림자의 투명도
    shadowRadius: 5,    // 블러 강도
    shadowOffset: {
      width: 0,
      height: 4,         // 그림자의 위치
    },
    elevation: 10,
  },
  chat: {
    fontSize: 15,
  },
  stream: {
    width: '90%',  // 실시간 영상 크기 조절
    height: '70%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
});