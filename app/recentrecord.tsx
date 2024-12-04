import React from 'react';
import { Button, View, ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import {Stack, useRouter,Link} from 'expo-router';
import * as Speech from 'expo-speech';
import { WebView } from 'react-native-webview';
//Icon
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
//Context 
import { useDb } from '@/context/DbContext';
import { DbContextType } from '@/types/index';

export default function recentRecordScreen() {
  const router = useRouter();
  const goback = () => {
    router.back();
  };
 
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
        <Text style={styles.info_text}>오늘의 만남 일기를 작성하면 프로필에서 확인할 수 있습니다.{'\n'}단, 저장하지 않은 기록은 하루 동안만 보관되며, 자정이 지나면 자동으로 삭제됩니다!</Text>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  box:{
    flex:1,
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