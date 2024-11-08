import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import SearchBar from '@/components/SearchBar';
import { LinearGradient } from 'expo-linear-gradient';
import Empty from '@/components/Empty';
import ProfileItem from '@/components/ProfileItem';

//Context 
import { useDb } from '@/context/DbContext';
import { DbContextType } from '@/types/index';
import { useSearch } from '@/context/SearchContext';
import { SearchContextType } from '@/types/index';

const RegisterScreen = () => {
  const { profiles } = useDb() as DbContextType; // DbContext에서 프로필 가져오기
  const [isLoading, setLoading] = useState(true); // 초기 로딩 상태

  // 프로필 데이터가 업데이트되면 상태를 업데이트
  useEffect(() => {
    if (profiles.length >= 0) {
      setLoading(false); // 프로필이 있을 때 로딩 상태 false로 변경
    }
  }, [profiles]); // profiles가 변경될 때마다 실행
 
  const {keyword, onChangeText}= useSearch() as SearchContextType;
  const filteredProfiles = profiles.filter(profile =>
    profile.name.includes(keyword) // 대소문자 구분 없이 필터링
  );


  if (isLoading) {
    return (
      <ThemedView style={styles.Container}>
        <ActivityIndicator size="large" color="#4169e1" />
      </ThemedView>
    );
  }

  
  return (
    <LinearGradient colors={['#f2f2f2', 'white']} locations={[0.2, 1]} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer} stickyHeaderIndices={[1]} style={{ flex: 1 }}>
        <View style={styles.HeaderContainer}>
          <Text style={styles.title_people}>People</Text>
          <Text style={styles.content_len}>({profiles.length})</Text>
        </View>
        <View style={styles.SearchContainer}>
          <SearchBar />
        </View>
        <View style={styles.Container}>
          {filteredProfiles.length === 0 ? <Empty /> : 
          (
            <View>
              {filteredProfiles.map((profile) => (
                <View key={profile.id}>
                  <ProfileItem age={profile.age} id={profile.id} image={profile.image} memo={profile.memo} gender={profile.gender} name={profile.name} relationship={profile.relationship} />
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
  title_people:{fontFamily: 'Propmt_SemiBold',color: '#474747', fontSize: 40, fontWeight: 'bold', marginRight: 5 },
  content_len:{ fontSize: 18, color: '#4169E1', marginTop: 6 },
  HeaderContainer: { paddingLeft: 20, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  SearchContainer: {
    backgroundColor: '#f2f2f2',
    paddingTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    shadowColor: '#a4a4a4',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    elevation: 10,
  },
  scrollContainer: {
    flexGrow: 1, // ScrollView 내부의 콘텐츠가 공간을 차지하도록 함
  },
  Container: {
    flexGrow: 1, // 프로필 리스트를 포함하는 뷰가 가용 공간을 차지하도록 함
    padding: 20,
    backgroundColor: '#f2f2f2',
  },

});

export default RegisterScreen;
