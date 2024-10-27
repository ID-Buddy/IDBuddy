import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, StyleSheet, View, Button, Image, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { ThemedView } from '@/components/ThemedView';
import SearchBar from '@/components/SearchBar';
import { LinearGradient } from 'expo-linear-gradient';

import { useDb } from '@/context/DbContext';
import Empty from '@/components/Empty';

const RegisterScreen = () => {
  const { profiles } = useDb(); // DbContext에서 프로필 가져오기
  const [isLoading, setLoading] = useState(profiles.length === 0); // 초기 로딩 상태

  // 프로필 데이터가 업데이트되면 로딩 상태를 false로 변경
  useEffect(() => {
    if (profiles.length >= 0) {
      setLoading(false);
    }
  }, [profiles]);

  if (isLoading) {
    return (
      <ThemedView style={styles.Container}>
        <ActivityIndicator size="large" color="#4169e1" />
      </ThemedView>
    );
  }

  return (
    <LinearGradient colors={['#4169e1', 'white']} locations={[0.2, 1]} style={styles.background}>
      <ScrollView stickyHeaderIndices={[1]} style={{ flex: 1 }}>
        <View style={styles.HeaderContainer}>
          <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold', marginRight: 5 }}>People</Text>
          <Text style={{ fontSize: 18, color: 'lightblue', marginTop: 6 }}>({profiles.length})</Text>
        </View>
        <View style={styles.SearchContainer}>
          <SearchBar />
        </View>
        <ThemedView style={styles.Container}>
          {profiles.length === 0? <Empty /> : 
          (
            <View>
              {profiles.map((profile) => (
                <View key={profile.id} style={styles.profileContainer}>
                  {profile.image ? (
                    <Image 
                      source={{ uri: profile.image }} 
                      style={styles.image} 
                    />
                  ) : (
                    <View style={styles.defaultProfile}>
                      <Text style={styles.defaultText}>{profile.name}</Text>
                    </View>
                  )}
                  <Text>이름: {profile.name}</Text>
                  <Text>관계: {profile.relationship}</Text>
                  <Text>메모: {profile.memo}</Text>
                  <Text>성별: {profile.gender}</Text>
                </View>
              ))}
            </View>
          )} 
        </ThemedView>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  HeaderContainer: { paddingLeft: 20, flex: 1, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  SearchContainer: {
    backgroundColor: '#4169e1',
    paddingTop: 5,
    flex: 1,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    shadowColor: '#4169e1',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 10,
  },
  Container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    paddingBottom: 200,
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
  defaultProfile:{
    backgroundColor: 'lightgray',
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultText: {
    fontSize: 30,
    fontWeight: 'bold',
  }
});

export default RegisterScreen;
