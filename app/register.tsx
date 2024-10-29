import React, {useState} from 'react';
import { Image, View, Button, TextInput, StyleSheet} from 'react-native';
import { useDb } from '@/context/DbContext';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

//type
import { Profile } from '@/types/index';
import { DbContextType } from '@/types/index';

export default function RegisterScreen() {
  const router = useRouter();
  const { db, addProfile, deleteAllProfiles } = useDb() as DbContextType;
  const [newProfile, setNewProfile] = useState<Profile>({
    id: Date.now(), // id는 새로운 프로필 생성 시 고유하게 설정할 수 있음
    image: '',
    name: '',
    relationship: '',
    memo: '',
    gender: '',
  });

   // 프로필 추가
   const handleAddProfile = async () => {
    await addProfile(newProfile); // 프로필 추가
    setNewProfile({ id: Date.now(), image: '', name: '', relationship: '', memo: '', gender: '' }); // 입력 필드 초기화
    router.push('/people');
  };

  // 모든 프로필 삭제
  const handleDeleteAllProfiles = async () => {
    await deleteAllProfiles(); // 모든 프로필 삭제
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

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setNewProfile({ ...newProfile, image: result.assets[0].uri });
    }
  };

  return (
    <View style ={styles.container}>
        <View style={styles.inputContainer}>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            
            <TextInput
              style={styles.input}
              placeholder="이름"
              value={newProfile.name}
              onChangeText={(text) => setNewProfile({ ...newProfile, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="관계"
              value={newProfile.relationship}
              onChangeText={(text) => setNewProfile({ ...newProfile, relationship: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="메모"
              value={newProfile.memo}
              onChangeText={(text) => setNewProfile({ ...newProfile, memo: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="성별 ('여자' 또는 '남자')"
              value={newProfile.gender}
              onChangeText={(text) => setNewProfile({ ...newProfile, gender: text })}
            />
            <Button title="프로필 추가" onPress={handleAddProfile} />
            <Button title="모든 프로필 삭제" onPress={handleDeleteAllProfiles} color="red" />
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container :{flex: 1},
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    image: {
      width: 200,
      height: 200,
    },
});