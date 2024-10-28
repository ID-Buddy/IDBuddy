import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, StyleSheet, View, Button, Image, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { ThemedView } from '@/components/ThemedView';
import SearchBar from '@/components/SearchBar';
import { LinearGradient } from 'expo-linear-gradient';

import { useDb } from '@/context/DbContext';
import Empty from '@/components/Empty';
import ProfileItem from '@/components/ProfileItem';
//type
import { DbContextType } from '@/types/index';
import { Profile } from '@/types/index';

const RegisterScreen = () => {
  const { profiles } = useDb() as DbContextType; // DbContext에서 프로필 가져오기
  const [isLoading, setLoading] = useState(true); // 초기 로딩 상태

  // 프로필 데이터가 업데이트되면 상태를 업데이트
  useEffect(() => {
    if (profiles.length >= 0) {
      setLoading(false); // 프로필이 있을 때 로딩 상태 false로 변경
    }
  }, [profiles]); // profiles가 변경될 때마다 실행
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
            <View style={styles.profileContainer}>
              {profiles.map((profile) => (
                <View key={profile.id} style={{flex: 1}}>
                   <ProfileItem id={profile.id} image={profile.image} memo={profile.memo} gender={profile.gender} name={profile.name} relationship={profile.relationship} />
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
    flex:1,
  },
});

export default RegisterScreen;
