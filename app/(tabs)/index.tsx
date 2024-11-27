import { ActivityIndicator, Image, StyleSheet, Pressable, View, Text } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import * as Speech from 'expo-speech';
//websocket
import {io} from 'socket.io-client';

//DB
import * as SQLite from 'expo-sqlite';

//WebView
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const db = SQLite.openDatabaseAsync('profiles.db');

export default function HomeScreen() {
  const videoUrl = process.env.EXPO_PUBLIC_API_VIDEO as string;
  const serverUrl = process.env.EXPO_PUBLIC_API_SERVER  as string;
  const [isLoading, setLoading] = useState(true);
  const [isPressed, setPressed] = useState(false); // pressed 상태 관리
  const [isVideoLoaded, setVideoLoaded] = useState(false); // 영상 로드 상태 관리

  //웹 소켓과 관련된 변수
  const [message, setMessage] = useState<string>('');
  const lastMessageRef = useRef<string>('');

  const [recognitionResult, setRecognitionResult] = useState<string | null>(null);
  const [lastReconitionResult, setReconitionResult] = useState<string>('');

  const [socket, setSocket] = useState<any>(null); // socket 상태 관리
  const handlePress = () => {
    const newPressedState = !isPressed // 새로운 pressed 상태 
    setPressed(newPressedState); // pressed 상태 업데이트
    if (newPressedState) {
      const text = '서버와 연결 대기 중...'
      setMessage(text);
      connectToServer();
    }
    else{
      disconnectFromServer();
    }
  };
  // 웹 소켓 연결 함수
  const connectToServer = () => {
    const newSocket = io(`${serverUrl}/notifications`,{
      transports: ['websocket'], // WebSocket 전송 방식만 사용
      forceNew: true, // 새로운 소켓 인스턴스 생성
    });

    // 소켓이 연결되었을 때
    newSocket.on('connect', () => {
      const text = '서버에 연결되었습니다.'
      console.log(text);
      setMessage(text);
    });

    // 서버에서 'response' 이벤트 수신
    newSocket.on('response', (data: { message: string }) => {
      console.log('서버에서 response 메시지 수신:', data);
      setMessage(data.message);
    });

    // 서버에서 'recognition_result' 이벤트 수신
    newSocket.on('recognition_result', (data: { status: string; message: string }) => {
      console.log('서버에서 얼굴 인식 결과 수신:', data);
      if (data.status === 'success') {
        console.log(data.message);
        setRecognitionResult(data.message);
      } 
      else {
        console.log('데이터 수신 실패 : ', data);
      }
    });

    // 소켓 연결 오류 핸들링
    newSocket.on('connect_error', (error: any) => {
      console.log('소켓 연결 오류:', error);
      const text = '소켓 연결 오류 발생. 카메라 연결을 종료해주세요';
      setMessage(text);

    });

    // 소켓 재연결 시도
    newSocket.on('reconnect_attempt', () => {
      console.log('소켓 재연결 시도 중...');
      const text = '소켓 재연결 시도 중...';
      setMessage(text);
    });


    // socket 상태 설정
    setSocket(newSocket);
  };

  // 웹 소켓 연결 끊기 함수
  const disconnectFromServer = () => {
    if (socket) {
      socket.disconnect(); // 서버와의 연결 해제
      console.log('서버와의 연결이 끊어졌습니다.');
      setMessage('서버와의 연결이 끊어졌습니다.');
      setSocket(null);
      setRecognitionResult(null);
    }
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
  
    };
    initializeDatabase();
    setLoading(false); 
  }, []);
/*
  const handleWebViewLoadEnd = () => {
    webViewRef.current?.injectJavaScript(`
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.style.width = '100%';
        videoElement.style.height = 'auto';
        videoElement.style.objectFit = 'cover'; // 비디오 크기를 화면에 맞게 조정
      }
      true;
    `);
  }
*/
  // message 값이 변경될 때 TTS 실행
  useEffect(() => {
    if (message && lastMessageRef.current!= message) {
      Speech.speak(message, {
        language: 'ko-KR',
        pitch: 1.0,
        rate: 1.0,
      });
    }
    lastMessageRef.current = message;
  }, [message]); 

  /*
    // recognitionResult 결과 값이 변경될 때 TTS 실행
    useEffect(() => {
      if (recognitionResult) {
        Speech.speak(recognitionResult, {
          language: 'ko-KR',
          pitch: 1.0,
          rate: 1.0,
        });
      }
    }, [recognitionResult]);
*/

  return (
    <>
    <View style={styles.Container}>
      {isPressed ? (
        !isLoading ? (
            <>
            <WebView
              style={styles.webview}
              source={{ uri: videoUrl }}
            />
            {/* 오버레이 콘텐츠 */}
            <View style={styles.logo}>
              <Image
                style={{ width: 40, height: 45 }}
                source={require('@/assets/images/ID-B_logo.png')} // 로고 이미지 경로 설정
                resizeMode="contain"
              />
            </View>
            <View style={styles.chat_bubble}>
              { message ? (
                <View style={styles.message_container}>
                  <Text style={styles.chat}>{message}</Text>
                  {recognitionResult && <Text style={styles.chat}>{recognitionResult}</Text>}
                </View>
              ):(
                <Text style={styles.chat}>안녕하세요, Eunjin님!</Text>
              )}
            </View>
            </>
        ) : (
          <View style={styles.topContent}>
            <ActivityIndicator size="large" color="#4169e1" />
            <Text>로딩 중...</Text>
          </View>
        )
      ) : (
        <View style={styles.topContent} >
          <MaterialCommunityIcons name="video-off" size={100} color="#4169e1" />
          <Text>카메라가 꺼져있습니다.</Text>
        </View>
      )}
    </View>
    <View style={styles.bottom}>
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
    </View>
  
  </>
);
}

const styles = StyleSheet.create({
Container: {
  flex: 5,
  flexDirection: 'column',
},
topContent: {
  flex: 1,
  marginTop: Constants.statusBarHeight,
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
},
webview: {
  marginTop: Constants.statusBarHeight,
  flex: 1,
  width: '100%',
  height: '100%',
},
bottom: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  backgroundColor: 'white',
},
play_btn: {
  alignItems: 'center',
  justifyContent: 'center',
  width: 80,
  height: 80,
  borderRadius: 40, // borderRadius를 반으로 설정하여 원형으로 만듦
},
logo: {
  marginTop: Constants.statusBarHeight,
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
message_container:{
  
},
chat_bubble: {
  marginTop: Constants.statusBarHeight,
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
