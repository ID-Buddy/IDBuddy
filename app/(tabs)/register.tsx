import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, TextInput, Button, Image, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { ThemedView } from '@/components/ThemedView';

const RegisterScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [db, setDb] = useState<any>(null); // 데이터베이스 객체
  const [profiles, setProfiles] = useState<any[]>([]);
  const [newProfile, setNewProfile] = useState({
    image: '',
    name: '',
    relationship: '',
    memo: '',
    gender: '', // 성별 추가
  });

  // 데이터베이스 초기화 및 프로필 데이터 불러오기
  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await SQLite.openDatabaseAsync('profiles.db');
      setDb(database); // 데이터베이스 객체 저장

      // 프로필 데이터 불러오기
      fetchProfiles(database);
      setLoading(false); // 초기화가 완료되면 로딩 상태를 false로 변경
    };

    initializeDatabase();
  }, []);

  // 프로필 데이터 불러오기
  const fetchProfiles = async (database: any) => {
    const result = await database.getAllAsync('SELECT * FROM profiles');
    setProfiles(result);
  };

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
      fetchProfiles(db); // 새 프로필을 추가한 후 다시 불러오기
    }
  };

  // 모든 프로필 데이터 삭제
  const deleteAllProfiles = async () => {
    if (db) {
      await db.runAsync('DELETE FROM profiles'); // 모든 프로필 데이터 삭제
      fetchProfiles(db); // 삭제 후 프로필 리스트 다시 불러오기
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.Container}>
        <ActivityIndicator size="large" color="#4169e1" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.Container}>
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

      {/* 등록된 프로필 리스트 */}
      <View>
        {profiles.map((profile) => (
          <View key={profile.id} style={styles.profileContainer}>
            <Image 
              source={profile.image ? { uri: profile.image } : (profile.gender === '여자' ? require('@/assets/images/defaultFemale.png') : require('@/assets/images/defaultMale.png'))}
              style={styles.image}
            />
            <Text>이름: {profile.name}</Text>
            <Text>관계: {profile.relationship}</Text>
            <Text>메모: {profile.memo}</Text>
            <Text>성별: {profile.gender}</Text>
          </View>
        ))}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: 20,
  },
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
  profileContainer: {
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});

export default RegisterScreen;
