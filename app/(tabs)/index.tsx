import { ActivityIndicator, Image, StyleSheet, Pressable, View, Text } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import * as Speech from 'expo-speech';
import {Link} from 'expo-router';
import {Switch} from 'react-native-switch';
//Icon
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
//websocket
import {io} from 'socket.io-client';
//DB
import * as SQLite from 'expo-sqlite';
//WebView
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
//Type
import {RecognitionResult} from '@/types/index';
//db
import { Profile } from '@/types/index';
import { useDb } from '@/context/DbContext';
import { DbContextType } from '@/types/index';

export default function HomeScreen() {
  const [voiceOn, setVoiceOn] = useState<boolean>(true);
  const {deleteRecordsBeforeMidnight, addRecord} = useDb() as DbContextType;
  const videoUrl = process.env.EXPO_PUBLIC_API_VIDEO as string;
  const serverUrl = process.env.EXPO_PUBLIC_API_SERVER  as string; 
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isPressed, setPressed] = useState<boolean>(false); // pressed 상태 관리

  //웹 소켓과 관련된 변수
  const [message, setMessage] = useState<string>('');
  const lastMessageRef = useRef<string>('');
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult|null>(null);
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
      setMessage(text);
    });

    // 서버에서 'response' 이벤트 수신
    newSocket.on('response', (data: { message: string }) => {
      console.log('서버에서 response 메시지 수신:', data);
      setMessage(data.message);
    });

    // 서버에서 'recognition_result' 이벤트 수신
    newSocket.on('recognition_result', (data: { status: string; result: { id: string; name: string } }) => {
      console.log('서버에서 얼굴 인식 결과 수신:', data);
      if (data.status === 'success' && data.result) {
        const result = data.result;
        console.log(`인식된 ID: ${result.id}, 이름: ${result.name}`);
        setRecognitionResult(result);
      } else {
        console.log('데이터 수신 실패 : ', data);
      }
    });

    // 소켓 연결 오류 핸들링
    newSocket.on('connect_error', (error: any) => {
      const text = '소켓 연결 오류 발생. 카메라 연결을 종료해주세요';
      setMessage(text);
    });

    // 소켓 재연결 시도
    newSocket.on('reconnect_attempt', () => {
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
      const recordDb = await SQLite.openDatabaseAsync('records.db');
      await recordDb.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS records (
          id INTEGER NOT NULL,
          timestamp INTEGER NOT NULL,
          detail TEXT
        );
      `);
    };
    initializeDatabase();
    deleteRecordsBeforeMidnight();//전날 기록 데이터 삭제
    setLoading(false); 
  }, []);

  // message 값이 변경될 때 TTS 실행
  // 식별 결과 메세지
  const [ttsQueue, setTtsQueue] = useState<string[]>([]);
  const isSpeaking = useRef(false);
  useEffect(() => {

    if (ttsQueue.length > 0 && !isSpeaking.current) {
      isSpeaking.current = true;
      const currentMessage = ttsQueue[0];
      Speech.speak(currentMessage, {
        language: 'ko-KR',
        pitch: 1.0,
        rate: 1.0,
        onDone: () => {
          isSpeaking.current = false;
          setTtsQueue(prevQueue => prevQueue.slice(1)); // 첫 번째 메시지 제거
        },
        onStopped: () => {
          isSpeaking.current = false;
          setTtsQueue(prevQueue => prevQueue.slice(1)); // 첫 번째 메시지 제거
        },
      });
    }
  }, [ttsQueue]);
  //tts 큐 업데이트 
  const addToTTSQueue = (text: string) => {
    // 기존 큐에 포함되지 않은 경우에만 추가
    setTtsQueue((prevQueue) => {
      if (!prevQueue.includes(text)) {
        return [...prevQueue, text];
      }
      return prevQueue; // 이미 포함된 경우 기존 큐를 그대로 반환
    });
  };
  // DisplayResults 업데이트
  const addToDisplayResults = (newResult: { text: string; timestamp: number }) => {
    setDisplayResults((prevResults) => {
      if (!prevResults.some((result) => result.text === newResult.text)) {
        return [...prevResults, newResult];
      }
      return prevResults;
    });
  };
  const [displayResults, setDisplayResults] = useState<{ text: string; timestamp: number }[]>([]);
  useEffect(() => {
    if (recognitionResult) {
      const idString= recognitionResult.id
      const name = recognitionResult.name
      const newRecord = {
        id: parseInt(idString, 10), // idString을 숫자(십진수)로 변환하여 저장
        timestamp: Date.now(),
        detail: null,
      };
      const newResult = {
        text: `${name}님이 인식되었습니다`,
        timestamp: Date.now(), // 현재 시간 저장
      };
      // TTS 큐 추가
      if (voiceOn){
        addToTTSQueue(newResult.text);
      }
      // DisplayResults 추가
      addToDisplayResults(newResult);
      // 레코드 추가 (dbContext의 addRecord 함수 호출)
      addRecord(newRecord);
    }
  }, [recognitionResult]);

  // 1초마다 displayResults에서 오래된 항목 제거
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      setDisplayResults((prevResults) =>
        prevResults.filter((result) => currentTime - result.timestamp < 2 * 60 * 1000) // 2분 이내의 결과만 유지
      );
    }, 1000); // 매 초 실행
  
    // 언마운트 시 타이머 정리
    return () => clearInterval(intervalId);
  }, []);

  //서버 연결 메세지 
  useEffect(() => {
    if (message && lastMessageRef.current!= message&&voiceOn) {
      Speech.speak(message, {
        language: 'ko-KR',
        pitch: 1.0,
        rate: 1.0,
      });
    }
    lastMessageRef.current = message;
  }, [message]); 


///////////////////////////////////////
/*테스트 용 함수 */
/**
useEffect(()=> {
  if(isPressed){
    const timer1 = setTimeout(() => {
      setRecognitionResult({ id: '1733566820675', name: 'Jh' });
    }, 1000);
  
    const timer2 = setTimeout(() => {
      setRecognitionResult({ id: '1733566981653', name: 'Kms' });
    }, 2000);
  
    // 정리 함수 반환
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      console.log('테스트 입력 값 완료');
    };
  }
},[isPressed])
 */
////////////////////////////////////


  return (
    <View style={styles.box}>
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
                <View>
                  <Text style={styles.chat}>{message}</Text>
                  {displayResults.map((result, index) => (
                    <Text key={index}>{result.text}</Text>
                  ))}
                </View>
              ):(
                <Text style={styles.chat}>안녕하세요, 카메라를 연결 중입니다.</Text>
              )}
            </View>
            <View style={styles.list_icon_container_wrapper}>
              <View style={styles.list_icon_container}>
                <Link href="/recentrecord">
                  <FontAwesome6 name="list-ul" size={35} color="#4169e1" />
                </Link>
              </View>
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
          <Text style={{fontSize: 18,}}>카메라가 꺼져있습니다.</Text>
        </View>
      )}
    </View>
    <View style={styles.bottom}>
      <View style ={styles.mode_btn}>
        {voiceOn? (
          <FontAwesome5 name="volume-up" size={24} color="#4169e1" />
        ):(
          <FontAwesome5 name="volume-mute" size={24} color="#c4c4c4" />
        )}
        <Switch
          backgroundActive={'#4169e1'}
          backgroundInactive={'#c4c4c4'}
          circleSize={30}
          onValueChange={(val) => setVoiceOn(val)}
          value={voiceOn}
        />
      </View>
      <View>
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
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  box:{
    flex:1
  },
  list_icon_container_wrapper:{
    position: 'absolute',
    bottom: 10,
    left: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'White', 
    width: 63, 
    height: 63,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8,
  },
  list_icon_container:{
    width: 63,
    height: 63,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color : '#4169E1',
    fontWeight: 'bold',
  },
  mode_btn:{
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    paddingTop: 6,
    paddingLeft: 20,
    justifyContent: 'flex-start',
  },
  Container: {
    flex: 4,
    backgroundColor: '#f2f2f2',
    flexDirection: 'column',
  },
  topContent: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#f1f1f1'
  },
  webview: {
    marginTop: Constants.statusBarHeight,
    backgroundColor: '#f2f2f2',
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  bottom: {
    flex: 1,
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
  chat_bubble: {
    marginTop: Constants.statusBarHeight,
    position: 'absolute',
    top: 15,
    right: 65,
    backgroundColor: 'white',
    padding: 8,
    paddingLeft: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: 'black',
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