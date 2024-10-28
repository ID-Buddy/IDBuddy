import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import SearchBar from '@/components/SearchBar';
import { LinearGradient } from 'expo-linear-gradient';

import { useDb } from '@/context/DbContext';
import Empty from '@/components/Empty';
import ProfileItem from '@/components/ProfileItem';
import { DbContextType } from '@/types/index';

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
      <ScrollView contentContainerStyle={styles.scrollContainer} stickyHeaderIndices={[1]} style={{ flex: 1 }}>
        <View style={styles.HeaderContainer}>
          <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold', marginRight: 5 }}>People</Text>
          <Text style={{ fontSize: 18, color: 'lightblue', marginTop: 6 }}>({profiles.length})</Text>
        </View>
        <View style={styles.SearchContainer}>
          <SearchBar />
        </View>
        <View style={styles.Container}>
          {profiles.length === 0 ? <Empty /> : 
          (
            <View>
              {profiles.map((profile) => (
                <View key={profile.id}>
                   <ProfileItem id={profile.id} image={profile.image} memo={profile.memo} gender={profile.gender} name={profile.name} relationship={profile.relationship} />
                </View>
              ))}
            </View>
          )} 
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  HeaderContainer: { paddingLeft: 20, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  SearchContainer: {
    backgroundColor: '#4169e1',
    paddingTop: 5,
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
  scrollContainer: {
    flexGrow: 1, // ScrollView 내부의 콘텐츠가 공간을 차지하도록 함
  },
  Container: {
    flexGrow: 1, // 프로필 리스트를 포함하는 뷰가 가용 공간을 차지하도록 함
    padding: 20,
    backgroundColor: 'white',
  },

});

export default RegisterScreen;
