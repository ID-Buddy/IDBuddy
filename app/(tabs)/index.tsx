import { ActivityIndicator, Image, StyleSheet, Pressable, View, Text } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
//Icon
import AntDesign from '@expo/vector-icons/AntDesign';
//websocket
import {io} from 'socket.io-client';
//DB
import * as SQLite from 'expo-sqlite';
//WebView
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
//dropdown
import DropDownPicker from 'react-native-dropdown-picker';
//db
import { Profile } from '@/types/index';
const db = SQLite.openDatabaseAsync('profiles.db');
import { useDb } from '@/context/DbContext';
import { DbContextType } from '@/types/index';

export default function HomeScreen() {

  const [oneProfile, setOneProfile] = useState<Profile|null>(null);
  const {fetchProfileById} = useDb() as DbContextType;
  const [videoUrl, setVideoUri] = useState<string>(process.env.EXPO_PUBLIC_API_VIDEO as string);
  const serverUrl = process.env.EXPO_PUBLIC_API_SERVER  as string;
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isPressed, setPressed] = useState<boolean>(false); // pressed 상태 관리

  //드롭다운 관련된 변수 
  const [open, setOpen] = useState<boolean>(false); // 드롭다운 열림 상태
  const [value, setValue] = useState<string>('single');  // 현재 선택된 값
  const [items, setItems] = useState([
    { label: '싱글 모드', value: 'single'},
    { label: '멀티 모드', value: 'multi'},
  ]);

  useEffect(()=>{
    if (value == 'single'){
      setVideoUri(process.env.EXPO_PUBLIC_API_VIDEO as string);
    }
    else if (value == 'multi'){
      setVideoUri(process.env.EXPO_PUBLIC_API_VIDEO as string);
    }
  }, [value])

  // 드롭다운의 label 값을 동적으로 변경하는 로직
  useEffect(() => {
    if (open) {
      // 드롭다운이 열렸을 때 레이블 변경
      setItems(prevItems =>
        prevItems.map(item =>
          item.value === 'single'
            ? { ...item, label: '싱글 모드 ( 1대1 상황일 때 적합합니다. )' }
            : item.value === 'multi'
            ? { ...item, label: '멀티 모드 ( 여러 사람을 만날 때 적합합니다. )' }
            : item
        )
      );
    } else {
      // 드롭다운이 닫혔을 때 원래 레이블로 되돌림
      setItems([
        { label: '싱글 모드', value: 'single' },
        { label: '멀티 모드', value: 'multi' },
      ]);
    }
  }, [open]);

  //웹 소켓과 관련된 변수
  const [message, setMessage] = useState<string>('');
  const lastMessageRef = useRef<string>('');

  const [recognitionResult, setRecognitionResult] = useState<string>('');
  const lastReconitionResult = useRef<string>('');

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
      setRecognitionResult('');
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
    if (recognitionResult && lastReconitionResult.current!=recognitionResult ) {
      Speech.speak(recognitionResult, {
        language: 'ko-KR',
        pitch: 1.0,
        rate: 1.0,
      });
    }
    lastReconitionResult.current = recognitionResult;
    lastMessageRef.current = message;
  }, [message, recognitionResult]); 

  // 프로필 가져오기
  useEffect(() => {
    const fetchData = async (id: number) => {
      const profile = await fetchProfileById(id); // 특정 ID로 검색
      if (profile) {
        console.log('Fetched Profile:', profile);
        setOneProfile(profile); // 검색된 프로필을 상태로 저장
      } else {
        console.warn(`Profile with ID ${id} not found`);
      }
    };
    if (recognitionResult && lastReconitionResult.current !== recognitionResult) {
      const [idString, name] = recognitionResult.split(' '); // ID와 이름 분리
      //const id = parseInt(idString, 10); // 문자열 ID를 숫자로 변환
      const id = 1732793076660 
      if (!isNaN(id)) {
        fetchData(id); // 데이터 검색 함수 호출
      } else {
        console.warn('Invalid ID format in recognitionResult');
      }
    }
  }, [recognitionResult]); 

  return (
    <>
    <View style={styles.Container}>
      {isPressed ? (
        !isLoading ? (
            <>
            <WebView
              style={styles.webview}
              source={{ uri: videoUrl }}
              startInLoadingState={true} // 로딩 상태가 시작되면 로딩 화면 표시
              renderLoading={() => (
                <View style={styles.topContent}>
                  <ActivityIndicator size="large" color="#4169e1" />
                </View>
              )}
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
            <View style={{justifyContent: 'center',alignItems: 'center',backgroundColor: 'black', height: 50, width: 50, borderRadius: 100,}}>
                <Text style ={{color: 'white'}}>{oneProfile?.name}</Text>
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
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          style={styles.dropdown}
          textStyle={styles.text}
          dropDownContainerStyle={{
            alignSelf: 'flex-end',
            width: '95%',
            backgroundColor: "white",
            borderColor: '#D0E3FF',
          }}
          selectedItemContainerStyle={{
            backgroundColor: "#D0E3FF"
          }}
        />
      </View>
      <View style = {styles.video_btn}>
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
  
  </>
);
}

const styles = StyleSheet.create({
  mode_text:{

  },
  mode_container:{
    backgroundColor: 'white',
  },
  dropdown: {
    width: '30%',
    alignSelf: 'flex-end',
    borderColor: '#D0E3FF',
    height: 50,
  },
  text: {
    fontSize: 16,
    color : '#4169E1',
  },
  video_btn:{
   
  },
  mode_btn:{
    width: '100%',
    paddingTop : 5,
    paddingRight: 5,
  },
  Container: {
    flex: 4,
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
