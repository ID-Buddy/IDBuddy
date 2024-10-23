import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, StyleSheet, View, TextInput, Button, Image, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { ThemedView } from '@/components/ThemedView';
import SearchBar from '@/components/SearchBar';
import { LinearGradient } from 'expo-linear-gradient';

const RegisterScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [num, setNum] = useState(0)
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
    setNum(result.length)
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
    <LinearGradient
        colors={['#4169e1', 'white']}
        locations={[0.2,1]}
        style={styles.background}>
      <ScrollView stickyHeaderIndices={[1]} style={{flex:1}}>
        <View style={styles.HeaderContainer}  >
          <Text style={{color: 'white',fontSize: 40, fontWeight: 'bold', marginRight: 5}}>People</Text>
          <Text style={{fontSize: 18, color: 'lightblue', marginTop: 6,}}>({num})</Text>
        </View>
        <View style={styles.SearchContainer}>
          <SearchBar />
        </View>
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
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background:{
    flex:1,
  },
  HeaderContainer: {paddingLeft: 20, flex:1, marginBottom: 20, flexDirection: 'row', alignItems: 'center'},
  SearchContainer: {
    backgroundColor: '#4169e1',
    paddingTop: 5,
    flex: 1,
    marginBottom: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingBottom: 10,
    shadowColor: '#4169e1', // 흰색 그림자
    shadowOpacity: 0.5,  // 그림자의 투명도
    shadowRadius: 10,    // 블러 강도
    shadowOffset: {
      width: 0,
      height: 10,         // 그림자의 위치
    },
    elevation: 10, 
  },
  Container: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    paddingBottom:200,
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
