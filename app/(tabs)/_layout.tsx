import { Tabs } from 'expo-router';
import React from 'react';
import { Image,View,Pressable } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';



export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        
      }}>
      <Tabs.Screen
        name="register"
        options={{
          title: '',
          tabBarLabel: 'People',
          headerShown: true,
          headerStyle:{
            backgroundColor: '#4169e1',
            shadowColor: 'transparent', // 그림자 색상 투명하게 설정
            shadowOffset: { width: 0, height: 0 }, // 그림자 오프셋 설정
            shadowOpacity: 0, // 그림자 불투명도 설정
            shadowRadius: 0, // 그림자 반경 설정
          },
          headerRight: () => (
            <Pressable>
                <Ionicons name="person-add" size={24} color="white" />
            </Pressable>
          ),
          headerRightContainerStyle: {paddingRight: 20,},
          tabBarActiveTintColor: '#4169e1',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'people-sharp' : 'people-outline'} size={30} color={focused ? '#4169e1': 'lightgray'} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarLabel: '',
          headerRight: () => (
            <View
              style={{
                shadowColor: '#4169e1', // 흰색 그림자
                shadowOpacity: 0.5,  // 그림자의 투명도
                shadowRadius: 8,    // 블러 강도
                shadowOffset: {
                  width: 0,
                  height: 4,         // 그림자의 위치
                },
                elevation: 10,}}>
              <Image
                style={{ 
                  width: 40, 
                  height: 45, 
                  marginRight: 10,
                }}
                source={require('@/assets/images/ID-B_logo.png')} // 로고 이미지 경로 설정
                resizeMode="contain"
              />
            </View>
            
          ),
          headerTransparent: true,
       
          tabBarActiveTintColor: '#4169e1',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} size={30}color={focused ? '#4169e1': 'lightgray'} />
          ),
        }}
      />
      
    </Tabs>
  );
}
