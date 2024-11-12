import React, {useState} from 'react';
import { Image, Platform, View, Button, TextInput, StyleSheet,Pressable,KeyboardAvoidingView,ScrollView, Text,Keyboard,TouchableWithoutFeedback } from 'react-native';
import { useDb } from '@/context/DbContext';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, Stack } from 'expo-router';

//type
import { Profile } from '@/types/index';
import { DbContextType } from '@/types/index';

//icon
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

//URI
import Constants from 'expo-constants';
const serverUri = __DEV__
? process.env.SERVER_URI
: Constants.expoConfig?.extra?.serverUri;

export default function RegisterScreen() {
  //사진 확장자 
  const getFileExtension = (uri: string) => {
    const uriParts = uri.split('.');
    const fileExtension = uriParts[uriParts.length - 1].toLowerCase(); // 확장자를 소문자로 변환하여 일관성 유지
    return fileExtension;
  };
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
  };

  const [image, setImage] = useState<string | null>(null);

  // 단일 이미지 선택
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setNewProfile({ ...newProfile, image: result.assets[0].uri });
    }
  };

  const pickSendImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSendImage(result.assets[0].uri);
      setSelected(true);
    }
  };
  
  //이미지 업로드 API 호출
  const uploadImage = async () => {
    if(!sendImage){
      alert("이미지를 추가하세요!");
      return;
    }
    if (isAdded && newProfile.id && sendImage){
      
      // 이미지 URI로부터 Blob 객체 생성
      const response = await fetch(sendImage); 
      const blob = await response.blob(); // Blob으로 변환
      const extension = getFileExtension(sendImage);
      
      // FormData에 프로필 ID와 이미지 파일 추가
      const formData = new FormData();
      formData.append('name', String(newProfile.id));  // 프로필 ID 추가
      formData.append('file', blob, `${String(newProfile.id)}.${extension}`, // 예: profile.jpeg
      );

      try {
        const response = await fetch(`${serverUri}/api/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message || '등록이 성공적으로 이루어졌습니다!');
          await addProfile(newProfile); // 프로필 
          setNewProfile({ id: Date.now(), image: '', name: '', relationship: '', memo: '', gender: '', age: ''}); // 입력 필드 초기화
          router.back();
        } else {
          alert(result.message || '이미지 업로드 실패');
        }
      } catch (error) {
        console.error(error);
        alert('서버 요청 중 오류가 발생했습니다.');
      }

    } 
  }
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
            <Pressable style={styles.add_image_btn}onPress={pickImage} >
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