import React, {useState} from 'react';
import { Image, Platform, View, Button, TextInput, StyleSheet,Pressable,KeyboardAvoidingView,ScrollView, Text,Keyboard,TouchableWithoutFeedback } from 'react-native';
import { useDb } from '@/context/DbContext';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, Stack } from 'expo-router';
import axios from 'axios';

import * as FileSystem from 'expo-file-system';
//uriToBlob
import getBlobFromUri from '@/components/getBlobFromUri';
//type
import { Profile } from '@/types/index';
import { DbContextType } from '@/types/index';

//icon
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

//constant
export default function RegisterScreen() {
  const registerUrl = process.env.EXPO_PUBLIC_API_REGISTER as string;
  // 이미지 저장 함수
  async function saveImageToDisk(uri: string): Promise<string | null> {
    // documentDirectory가 null일 경우 예외 처리
    if (!FileSystem.documentDirectory) {
      console.error('documentDirectory is null');
      return null; // 오류를 반환하거나 예외를 던질 수 있습니다.
    }
  
    const fileName = uri.split('/').pop();
    if (!fileName) {
      console.error('File name is undefined');
      return null; // 파일 이름이 없을 경우 오류 처리
    }
  
    const newUri = FileSystem.documentDirectory + fileName;
  
    try {
      await FileSystem.copyAsync({
        from: uri,
        to: newUri,
      });
  
      return newUri; // 저장된 이미지의 경로 반환
    } catch (error) {
      console.error('Failed to save image:', error);
      return null; // 예외 발생 시 null 반환
    }
  }
  const router = useRouter();
  const isModal = router.canGoBack();
  const { db, addProfile, deleteAllProfiles } = useDb() as DbContextType;
  const [newProfile, setNewProfile] = useState<Profile>({
    id: Date.now(), // id는 새로운 프로필 생성 시 고유하게 설정할 수 있음
    image: '',
    name: '',
    relationship: '',
    memo: '',
    gender: '',
    age: '',
  });

  //추가된 프로필인가
  const [isAdded, setAdded] = useState<boolean>(false);
  //등록할 이미지 골랐나
  const [isSelected, setSelected] = useState<boolean>(false);
  //서버에 보낼 이미지들
  const [sendImage, setSendImage] = useState<string>('');
  //const [uploading, setUploading] = useState(false);
  //const [uploadMessage, setUploadMessage] = useState('');


  // 프로필 추가
  const handleAddProfile = async () => {
    if (!newProfile.name || !newProfile.relationship || !newProfile.memo || !newProfile.gender || !newProfile.age) {
      alert('모든 필수 항목을 입력해주세요.'); // 필수 항목이 비어있을 경우 경고 메시지
      return; // 추가를 진행하지 않음
    }
    if(Number(newProfile.age) <= 0 || isNaN(Number(newProfile.age))){
      alert('올바른 나이를 입력해주세요'); // 필수 항목이 비어있을 경우 경고 메시지
      return; // 추가를 진행하지 않음
    }
    if(newProfile.gender != "여자" && newProfile.gender != "남자"){
      alert('성별을 정확하게 기입해주세요.("여자" 또는 남자"');
      return;
    }
    setAdded(true)
    await addProfile(newProfile); // 프로필 추가
        setNewProfile({
          id: Date.now(),
          image: '',
          name: '',
          relationship: '',
          memo: '',
          gender: '',
          age: ''
        }); // 입력 필드 초기화
  };

  const [image, setImage] = useState<string | null>(null);

  // 단일 이미지 선택
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const savedUri = await saveImageToDisk(result.assets[0].uri); // 이미지를 디스크에 저장
      setImage(savedUri); // 화면에 이미지를 표시하기 위해 상태 업데이트
      setNewProfile({ ...newProfile, image: savedUri }); // 이미지 경로를 프로필에 설정
    }
  };

  const pickSendImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSendImage(result.assets[0].uri);
      setSelected(true);
    }
  };

  const uploadImage = async () => {
    if (!isSelected) {
      alert("이미지를 추가하세요!");
      return;
    }
  
    // 업로드 중 상태 설정
    //setUploading(true);
    //setUploadMessage('Uploading...');
  
    // FormData 생성
    const formData = new FormData();
    let filetype = sendImage.substring(sendImage.lastIndexOf(".") + 1);
    const filename = `${String(newProfile.id)}.${filetype}`; // 파일 이름 설정
    console.log('파일 이름:', filename);
  
    try {
      // blob 객체 생성
      // URI에서 Blob 객체 생성
      const blob = await getBlobFromUri(sendImage) as Blob;
      console.log('MIME 타입:', blob.type); // MIME 타입 출력
  
      // FormData에 이미지 파일, 이름 추가
      formData.append('name', String(newProfile.id));
      formData.append('file', blob, filename);
  
      // FormData의 실제 내용을 확인
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
  
      // axios를 사용한 파일 업로드 요청 (Content-Type 자동 설정)
      const res = await axios.post(registerUrl, formData);
  
      // 서버 응답 확인
      if (res.status === 200) {
        alert(res.data.message || '등록이 성공적으로 이루어졌습니다!');
        await addProfile(newProfile); // 프로필 추가
        setNewProfile({
          id: Date.now(),
          image: '',
          name: '',
          relationship: '',
          memo: '',
          gender: '',
          age: ''
        }); // 입력 필드 초기화
        router.back();
      } else {
        alert(res.data.message || '이미지 업로드 실패');
      }
  
    } catch (error) {
      console.error('업로드 오류:', error);
      alert('서버 요청 중 오류가 발생했습니다.');
    }
  };
  
  //프로필 등록 취소
  const cancelRegister = () => {
    setNewProfile({ id: Date.now(), image: '', name: '', relationship: '', memo: '', gender: '', age: ''}); // 입력 필드 초기화
    setAdded(false);
    setSelected(false);
    setSendImage('');
    router.back();
  };

  const handleDone= () => {
    Keyboard.dismiss(); // 키보드 숨기기
  };

  return (
    <>
    <Stack.Screen 
      options={{ 
        title: '새로운 프로필' ,
        headerLeft: () => (
          <Pressable onPress={cancelRegister}>
            <Text style={styles.cancel}>취소</Text>
          </Pressable>
        ),
        headerStyle:{
          backgroundColor: '#f2f2f2',
        },
        headerShadowVisible: false,
      }}/>
    <TouchableWithoutFeedback onPress={handleDone}>
    <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // iOS에서는 padding, Android는 height로 설정
      >
      <ScrollView style ={styles.container}>
          {!isAdded ? 
          <View>
              <View style={styles.image_container}>
                {image ? <Image source={{ uri: image }} style={styles.image} /> :(
                <View style={styles.default_img}>
                  <Image
                    style={{ 
                      width: 200, 
                      height: 200,
                      opacity: 1,        
                    }}
                    source={require('@/assets/images/ID-B_logo.png')} // 로고 이미지 경로 설정
                    resizeMode="cover"
                  />
                </View>
              )}
            <Pressable style={styles.add_image_btn} onPress={pickImage} >
              <Text style={styles.add_image_content}>사진 추가</Text>
            </Pressable>
          </View>
          <View style={styles.inputContainer}> 
            <TextInput
              style={styles.input}
              placeholder="이름"
              value={newProfile.name}
              placeholderTextColor = '#ccc'
              onChangeText={(text) => setNewProfile({ ...newProfile, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="나이"
              value={newProfile.age.toString()}
              placeholderTextColor = '#ccc'
              onChangeText={(text) => {setNewProfile({ ...newProfile, age: text })}}
            />
            <TextInput
              style={styles.input}
              placeholder="성별 ('여자' 또는 '남자')"
              value={newProfile.gender}
              placeholderTextColor = '#ccc'
              onChangeText={(text) => setNewProfile({ ...newProfile, gender: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="관계"
              value={newProfile.relationship}
              placeholderTextColor = '#ccc'
              onChangeText={(text) => setNewProfile({ ...newProfile, relationship: text })}
            />
            <TextInput
              style={styles.input_memo}
              placeholder="메모"
              multiline
              value={newProfile.memo}
              placeholderTextColor = '#ccc'
              onChangeText={(text) => setNewProfile({ ...newProfile, memo: text })}
            />
          </View>
          <Button title="완료" onPress={handleAddProfile} />
        
        </View> : (
          <View style={styles.register_container}>
            <Text>얼굴 등록</Text>
            <Text>정면인 사진</Text>
            
            <Pressable onPress={pickSendImage}>
              {sendImage ? <Image source={{ uri: sendImage }} style={styles.sendImage} /> :(
                <View>  
                  <MaterialCommunityIcons name="tooltip-image" size={100} color="black" />
                </View>
              )}
            </Pressable>
            <Pressable
              onPress={uploadImage}
              style={[
                styles.button,
                { backgroundColor: isSelected ? '#4CAF50': '#D3D3D3'}, // 비활성화되면 회색, 활성화되면 초록색
                { opacity: isSelected ? 1 : 0.5 },  // 비활성화되면 버튼이 흐릿해짐
              ]}
              disabled={!isSelected}
            >
              <Text>동록 완료</Text>
            </Pressable>
          </View>
        )}
          
      </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
    button:{
      width: '80%',
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendImage:{
      margin: 2,
      width: 300,
      height: 300,
    },
    register_container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container :{
      flex: 1, 
      backgroundColor: '#f2f2f2',
      paddingHorizontal: 5,
    },
    inputContainer: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: 'white',
      paddingBottom : 160,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        
    },
    input_memo: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        height: 100,
    },
    image_container:{
      paddingTop: 15,
      marginBottom: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      borderRadius: 100,
      width: 200,
      height: 200,
    },
    default_img: {
      paddingTop: 80,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      width: 200,
      height: 200,
      backgroundColor: '#B9D5FF',
      overflow: 'hidden',
    },
    cancel:{
      fontSize: 17,
      color: '#4169E1',
    },
    add_image_content:{
      fontSize: 17,
      color: '#4169E1',
      textAlign:'center',
    },
    add_image_btn:{
      marginBottom: 3,
      marginTop: 9,
    },
  
});