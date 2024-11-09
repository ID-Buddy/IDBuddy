import { Tabs, useRouter,Link } from 'expo-router';
import React from 'react';
import { Image,View,Pressable, Text } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          paddingTop: 5,
        }
      }}>
      <Tabs.Screen
        name="people"
        options={{
          title: '',
          tabBarLabel: 'People',
          headerShown: true,
          headerStyle:{
            backgroundColor: '#f2f2f2',
            shadowColor: 'transparent', // 그림자 색상 투명하게 설정
            shadowOffset: { width: 0, height: 0 }, // 그림자 오프셋 설정
            shadowOpacity: 0, // 그림자 불투명도 설정
            shadowRadius: 0, // 그림자 반경 설정
          },
          headerLeft: () => (
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'center' }}>
            <Image
                  style={{ 
                    width: 29, 
                    height: 29,
                    marginRight: 3, 
                    opacity: 0.5,
                  }}
                  source={require('@/assets/images/ID-B_logo2.png')} // 로고 이미지 경로 설정
                  resizeMode="contain"
                />
            <Text style ={{color: '#c8c8c8', fontFamily: 'Prompt', fontSize: 23}}>idbuddy</Text>
            </View>
          ),
          headerLeftContainerStyle: {paddingLeft: 20,},
          headerRight: () => (
            <View>
              <Link href="../register" style={{}}>
                <Ionicons name="person-add" size={24} color="#4169E1" />
              </Link>
            </View>
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
          tabBarLabel: 'Camera',
          headerTransparent: true,
       
          tabBarActiveTintColor: '#4169e1',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons  name={focused ? "video-wireless" :"video-wireless-outline"} size={30}color={focused ? '#4169e1': 'lightgray'} />
          ),
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: '',
          headerTransparent: true,
          tabBarLabel: 'Test',
          tabBarActiveTintColor: '#4169e1',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons  name={focused ? "video-wireless" :"video-wireless-outline"} size={30}color={focused ? '#4169e1': 'lightgray'} />
          ),
        }}
      />
      
    </Tabs>
  );
}
