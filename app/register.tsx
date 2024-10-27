import React, {useState} from 'react';
import { View, Button, TextInput, StyleSheet} from 'react-native';
import { useDb } from '@/app/Context/DbContext';

export default function RegisterScreen() {
  const { db } = useDb();
  const [newProfile, setNewProfile] = useState({
    image: '',
    name: '',
    relationship: '',
    memo: '',
    gender: '', // 성별 추가
  });

  // 프로필 추가
    const addProfile = async () => {
        if (db) {
          await db.runAsync(
            'INSERT INTO profiles (image, name, relationship, memo, gender) VALUES (?, ?, ?, ?, ?)',
            newProfile.image,
            newProfile.name,
            newProfile.relationship,
            newProfile.memo,
            newProfile.gender // 성별 추가
          );
          setNewProfile({ image: '', name: '', relationship: '', memo: '', gender: '' }); // 입력 필드 초기화
        
        }
      };
    // 모든 프로필 데이터 삭제
    const deleteAllProfiles = async () => {
        if (db) {
        await db.runAsync('DELETE FROM profiles'); // 모든 프로필 데이터 삭제
        }
    };

  return (
    <View style ={styles.container}>
        <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="이미지 URL"
              value={newProfile.image}
              onChangeText={(text) => setNewProfile({ ...newProfile, image: text })}
            />
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
            <Button title="프로필 추가" onPress={addProfile} />
            <Button title="모든 프로필 삭제" onPress={deleteAllProfiles} color="red" />
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
});