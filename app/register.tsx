import React, {useState} from 'react';
import { Image, Platform, View, Button, TextInput, StyleSheet,Pressable,KeyboardAvoidingView,ScrollView, Text,Keyboard,TouchableWithoutFeedback } from 'react-native';
import { useDb } from '@/context/DbContext';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, Stack } from 'expo-router';
import axios from 'axios';

//file-system
import * as FileSystem from 'expo-file-system';

//type
import { Profile } from '@/types/index';
import { DbContextType } from '@/types/index';
//icon
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';

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
    if(newProfile.gender != "여자" && newProfile.gender != "남자" && newProfile.gender != "여" && newProfile.gender !="남"){
      alert('성별을 정확하게 기입해주세요.("여자/남자" 또는 여/남');
      return;
    }
    setAdded(true)
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

    // FormData 생성
    const formData = new FormData();
    let filetype = sendImage.substring(sendImage.lastIndexOf(".") + 1).toLowerCase();
    const filename = `${String(newProfile.id)}.${filetype}`; // 파일 이름 설정

    // MIME 타입 추론
    let mimeType = 'image/jpeg'; // 기본값
    if (filetype === 'png') {
      mimeType = 'image/png';
    } else if (filetype === 'jpg' || filetype === 'jpeg') {
      mimeType = 'image/jpeg';
    }

    // FormData에 필드 추가
    formData.append('name', String(newProfile.name));
    // JSON 형태로 추가, append할 때 string이나 blob 객체만 된다고 하는데 왜 이 형식만 정상적으로 수행되는지 모르겠음.
    formData.append('file', {
      uri: sendImage,
      type: mimeType,
      name: filename,
    });


    try {
      // axios를 사용한 파일 업로드 요청 (Content-Type 자동 설정)
      const res = await axios.post(registerUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // 서버 응답 확인
      if (res.status === 200) {
        alert(res.data || '등록이 성공적으로 이루어졌습니다!');
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
        alert(res.data || '이미지 업로드 실패');
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
            />image
          </View>
          <Button title="완료" onPress={handleAddProfile} />
        
        </View> : (
          <View style={styles.register_container}>
            <Text style={styles.e_g_title}>얼굴 등록</Text>
            <View style={styles.e_g_content}>
              <Entypo name="info-with-circle" size={24} color="#4169e1" />
              <Text style={styles.text_content}>이목구비가 잘 보이는 사진을 골라주세요!</Text>
            </View>
            <View style={styles.e_g_img_container}>
              <View>
                <Text>올바른 예시</Text>
                <Image
                        style={styles.e_g_img}
                        source={require('@/assets/images/e.g_img1.png')} // 로고 이미지 경로 설정
                        resizeMode="contain"
                />
              </View>
              <View>
                <Text>잘못된 예시</Text>
                <Image
                        style={styles.e_g_img}
                        source={require('@/assets/images/e.g_img2.png')} // 로고 이미지 경로 설정
                        resizeMode="contain"
                />
              </View>
            </View>
              
            <Pressable  onPress={pickSendImage}>
              {sendImage ? <Image source={{ uri: sendImage }} style={styles.sendImage} /> :(
                <View style={{padding: 100}}>  
                  <MaterialCommunityIcons name="message-image-outline" size={100} color="#c8c8c8" />
                </View>
              )}
            </Pressable>
            <Pressable
              onPress={uploadImage}
              style={[
                styles.button,
                { backgroundColor: isSelected ? '#7690DE': '#c8c8c8'}, // 비활성화되면 회색, 활성화되면 초록색
                { opacity: isSelected ? 1 : 0.5 },  // 비활성화되면 버튼이 흐릿해짐
              ]}
              disabled={!isSelected}
            >
              <Text style={styles.btn_text}>사진 등록하기</Text>
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
  btn_text: {
    fontSize: 16,
  },
  e_g_img_container:{
    marginTop: 20,
    flexDirection: 'row',
    flex:1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 13,
  },
  e_g_img:{
    width: 200,
    height: 200,
  },
  e_g_content:{
    flexDirection: 'row',
    alignItems : 'center',
    alignSelf :'flex-start',
  },
  e_g_title:{
    color: '#4169e1',
    fontSize: 30,
    alignSelf: 'flex-start',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  text_content:{
    marginLeft: 10,
    fontSize: 15,
  },
  button:{
    marginTop: 30,
    width: '80%',
    borderRadius: 13,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',

  },
  sendImage:{
    paddingVertical: 20,
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
    color: '#4169e1',
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