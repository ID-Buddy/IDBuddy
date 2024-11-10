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

export default function RegisterScreen() {
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
    await addProfile(newProfile); // 프로필 
    setNewProfile({ id: Date.now(), image: '', name: '', relationship: '', memo: '', gender: '', age: ''}); // 입력 필드 초기화
    router.back();
  };

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
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

  //프로필 등록 취소
  const cancelRegister = () => {
    setNewProfile({ id: Date.now(), image: '', name: '', relationship: '', memo: '', gender: '', age: ''}); // 입력 필드 초기화
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
          <Button title="프로필 추가" onPress={handleAddProfile} />
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
    container :{
      flex: 1, 
      backgroundColor: '#f2f2f2',
      paddingLeft: 5,
      paddingRight: 5,
    },
    inputContainer: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: 'white',
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