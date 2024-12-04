import React, {useEffect, useState} from 'react';
import { ActivityIndicator,Image, Platform, View, Button, TextInput, StyleSheet,Pressable,KeyboardAvoidingView,ScrollView, Text,Keyboard,TouchableWithoutFeedback } from 'react-native';
import { useDb } from '@/context/DbContext';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, Stack,  useLocalSearchParams } from 'expo-router';
import axios from 'axios';

//file-system
import * as FileSystem from 'expo-file-system';

//type
import { Profile } from '@/types/index';
import { DbContextType } from '@/types/index';
//icon
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';

export default function editprofileScreen() {
  const {updateProfile} = useDb() as DbContextType;
  const [newimage, setImage] = useState<string |null>(null);
  const [newProfile, setNewProfile] = useState<Profile>({
      id: -100,
      image: '',
      name: '',
      relationship: '',
      memo: '',
      gender: '',
      age: '',
    });
  const router = useRouter();
  const params = useLocalSearchParams();
  const {id,image,name,relationship, memo, gender, age} = params  as {
      id?: number;
      image?: string;
      name?: string;
      relationship?: string;
      memo?: string;
      gender?: string;
      age?: string;
  };
  useEffect(() => {

      if(id && name && relationship && memo && gender && age){
          setNewProfile({ ...newProfile, name: name, id: id, relationship: relationship, memo: memo, gender: gender, age:age, image: image, })
          if(image){
            setImage(image);
          }
      }
      
  },[]);
  //const registerUrl = process.env.EXPO_PUBLIC_API_REGISTER as string;
  
  
  // 기존 사진 파일 시스템에서 삭제
  const deleteImage = async (fileUri: string) => {
      try {
        await FileSystem.deleteAsync(fileUri);
        console.log('File deleted successfully!');
      } catch (error) {
        console.error('Error deleting file:', error);
      }
  };
  
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
    
    // 프로필 image 값 수정
    newProfile.image = newUri;

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
  };


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
      if (image){
        deleteImage(image);
      }
    }
  };
  
  const handleDone= () => {
    Keyboard.dismiss(); // 키보드 숨기기
  };

  const gotoProfileScreen = () => {
      router.back();
  };
  
  const handleSubmintInfo = () => {
    updateProfile(newProfile);
    router.replace('/people');
  };

if(!newProfile){
  return(
      <View style={{flex:1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator size="large" color="#4169e1" /></View>
  )
}

  return (
      <>
      <Stack.Screen 
      options={{ 
          title : '',
          headerLeft: () => (
            <Button title="취소" onPress={gotoProfileScreen} color="#4169E1" />
          ),
          headerRight: () => (
            <Button title="완료" onPress={handleSubmintInfo} color="#4169E1" />
          ),
          headerStyle:{
            backgroundColor: '#f2f2f2',
          },
          headerShadowVisible: false,
      }}/>
      <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // iOS에서는 padding, Android는 height로 설정
          >
          <ScrollView style ={styles.container}>
              <View style={styles.image_container}>
                  {newimage ? <Image source={{ uri: newimage }} style={styles.image} /> :(
                  <View style={styles.defaultImage}>
                      <Text style={styles.defaultText}numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
                  </View>
                  )}
                  <Pressable style={styles.add_image_btn} onPress={pickImage} >
                      <Text style={styles.add_image_content}>사진 변경</Text>
                  </Pressable>
              </View>
              <View style={styles.inputContainer}> 
                  <TextInput
                      style={styles.input}
                      placeholder={newProfile.name}
                      value={newProfile.name}
                      placeholderTextColor = '#ccc'
                      onChangeText={(text) => setNewProfile({ ...newProfile, name: text })}
                  />
                  <TextInput
                      style={styles.input}
                      value={newProfile.age.toString()}
                      placeholderTextColor = '#ccc'
                      onChangeText={(text) => {setNewProfile({ ...newProfile, age: text })}}
                  />
                  <TextInput
                      style={styles.input}                     
                      value={newProfile.gender}
                      placeholderTextColor = '#ccc'
                      onChangeText={(text) => setNewProfile({ ...newProfile, gender: text })}
                  />
                  <TextInput
                      style={styles.input}           
                      value={newProfile.relationship}
                      placeholderTextColor = '#ccc'
                      onChangeText={(text) => setNewProfile({ ...newProfile, relationship: text })}
                  />
                  <TextInput
                      style={styles.input_memo}
                      multiline
                      value={newProfile.memo}
                      placeholderTextColor = '#ccc'
                      onChangeText={(text) => setNewProfile({ ...newProfile, memo: text })}
                  />
              </View>
          </ScrollView>
          </KeyboardAvoidingView>
          </>
  );
}


const styles = StyleSheet.create({
    btn_text: {
      fontSize: 16,
    },
    defaultText: {
        fontSize: 60,
        fontWeight: 'bold',
      },
    defaultImage:{
        backgroundColor: '#c4c4c4',
        width: 200,
        height: 200,
        borderRadius: 100,  
        alignItems: 'center',
        justifyContent: 'center',
    },
    text_content:{
      marginLeft: 10,
      fontSize: 15,
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