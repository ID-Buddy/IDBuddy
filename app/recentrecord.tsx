import React, {useState, useEffect} from 'react';
import { ActivityIndicator, View,Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import {Stack, useRouter} from 'expo-router';
//Component
import Empty from '@/components/RecordEmpty';
import RecordItem from '@/components/RecordItem';
//Icon
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
//Context 
import { useDb } from '@/context/DbContext';
import { Record } from '@/types/index';
import { DbContextType } from '@/types/index';

export default function recentRecordScreen() {
  const {records} = useDb() as DbContextType;
  const router = useRouter();
  const goback = () => {
    router.back();
  };
  const [isLoading, setLoading] = useState(true); // 초기 로딩 상태

  // 프로필 데이터가 업데이트되면 상태를 업데이트
  useEffect(() => {
    if (records.length >= 0) {
      setLoading(false); // 프로필이 있을 때 로딩 상태 false로 변경
    }
  }, [records]); // profiles가 변경될 때마다 실행


  if (isLoading) {
    return (
      <View style={styles.box}>
        <ActivityIndicator size="large" color="#4169e1" />
      </View>
    );
  }
  return (
    <>
    <Stack.Screen
      options={{ 
        title : '오늘 하루 만남 기록',
        
        headerLeft: () => (
          <Pressable onPress={goback} >
            <Feather name="chevron-down" size={30} color="#4169e1" />
          </Pressable>
        ),
        headerStyle:{
          backgroundColor: '#f2f2f2',
        },
        headerShadowVisible: false,
        headerTitleStyle :{
          fontSize: 20,

        }
    }}
    />
    <View style={styles.box}>
      <View style={styles.info}>
        <Entypo name="info-with-circle" size={24} color="#4169e1" />
        <Text style={styles.info_text}>
          오늘의 만남 일기를 작성하면 <Text style={styles.txt_blue_bold}>프로필</Text>에서 확인할 수 있습니다.
          {'\n'}단, 저장하지 않은 기록은 하루 동안만 보관되며, <Text style={styles.txt_blue_bold}>자정</Text>
          이 지나면 자동으로 삭제됩니다.
        </Text>
      </View>
      <ScrollView style={styles.record_container}>
        {records.length === 0 ? <Empty /> : 
          (
            <View style={styles.box}>
            {records.map((record) => (
              <View key={record.id + record.timestamp}>
                <RecordItem
                  id={record.id}
                  timestamp={record.timestamp}
                  detail={record.detail}
                />
              </View>
            ))}
            </View>
          )} 
      </ScrollView>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  box:{
    flex:1,
  },
  txt_blue_bold:{
    fontWeight: 'bold',
    color : '#4169e1'
  },
  record_container:{
    flex:1, 
    backgroundColor: '#f2f2f2',
  },
  info:{
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#D0E3FF',
  },
  info_text:{
    flex: 1,
    lineHeight: 24
  },
});