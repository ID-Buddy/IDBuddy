import { ActivityIndicator, Image, StyleSheet, Pressable, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';

//Themed
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

//DB
import * as SQLite from 'expo-sqlite';

//WebView
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const db = SQLite.openDatabaseAsync('profiles.db');

export default function HomeScreen() {
  const [isloading, setLoading] = useState(true);
  const [isPressed, setPressed] = useState(false); // pressed 상태 관리
  const [isVideoLoaded, setVideoLoaded] = useState(false); // 영상 로드 상태 관리

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
          age INTEGER,
          memo TEXT NOT NULL
        );
      `);
      setLoading(false); // 초기화가 완료되면 로딩 상태를 false로 변경
    };

    initializeDatabase();
  }, []);

  const injectedJavaScript = `
  document.querySelector('video').style.width = '100%';
  document.querySelector('video').style.height = 'auto';
  true;
`;

  // 영상 로드 완료 후 스타일 적용
  const handleWebViewLoadEnd = () => {
    setVideoLoaded(true);
  };

  return (
    <ThemedView style={styles.Container}>
      {isPressed ? (
        !isloading ? (
          <WebView
            style={[StyleSheet.absoluteFill, styles.webview, isVideoLoaded && styles.videoLoaded]} // 영상 로드 후 스타일 적용
            source={{ uri: 'http://192.168.137.147:5001/api/video_feed' }}
            scalesPageToFit={true}
            injectedJavaScript={injectedJavaScript}
            onLoadEnd={handleWebViewLoadEnd} // 영상 로드 완료 후 호출되는 핸들러
          >
            <View style={styles.logo}>
              <Image
                style={{ width: 40, height: 45 }}
                source={require('@/assets/images/ID-B_logo.png')} // 로고 이미지 경로 설정
                resizeMode="contain"
              />
            </View>
            <View style={styles.chat_bubble}>
              <Text style={styles.chat}>안녕하세요, Eunjin님! </Text>
            </View>
          </WebView>
        ) : (
          <ThemedView style={styles.top}>
            <ActivityIndicator size="large" color="#4169e1" />
            <ThemedText>로딩 중...</ThemedText>
          </ThemedView>
        )
      ) : (
        <ThemedView style={[styles.top]} lightColor="#f2f2f2" darkColor="#212529">
          <MaterialCommunityIcons name="video-off" size={100} color="#4169e1" />
          <ThemedText>카메라가 꺼져있습니다.</ThemedText>
        </ThemedView>
      )}
      <ThemedView style={styles.bottom}>
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? '#4169e1' : 'white',
              borderColor: pressed ? 'white' : '#4169e1',
              borderWidth: pressed ? 0 : 3,
              paddingLeft: !isPressed ? 5 : 0,
            },
            styles.play_btn,
          ]}
        >
          {({ pressed }) => (
            <Ionicons
              name={pressed && isPressed ? 'stop' : !isPressed ? 'play' : 'stop'}
              size={50}
              color={pressed ? 'white' : '#4169e1'}
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
    flex: 7,
  },
  webview: {
    marginTop: Constants.statusBarHeight,
  },
  videoLoaded: {
    // 영상 로드 후 스타일을 추가할 부분
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 예시: 로드된 후 배경색 변경
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 20,
  },
  play_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  logo: {
    position: 'absolute',
    top: 15,
    right: 15,
    shadowColor: '#4169e1',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 10,
  },
  chat_bubble: {
    position: 'absolute',
    top: 15,
    right: 65,
    backgroundColor: 'lightgray',
    padding: 8,
    paddingLeft: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: 'lightgray',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 10,
  },
  chat: {
    fontSize: 15,
  },
});
