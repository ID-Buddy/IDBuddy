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
          image TEXT NOT NULL,
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
  
  return (
    <ThemedView style={styles.Container}>
      {isPressed ? (
        !isloading ? (
          <ThemedView style={styles.top}>
              <ThemedText>실시간 영상</ThemedText>
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
  }

});