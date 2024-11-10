import React from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import { Profile } from '@/types/index';
import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
//Icon
import Ionicons from '@expo/vector-icons/Ionicons';

export default function profileScreen(){
    const router = useRouter();
    const gotoPeopelScreen= () => {
      router.back();
    }
    const params = useLocalSearchParams();
    const {image,name,relationship, memo, gender, age} = params  as {
        image?: string;
        name?: string;
        relationship?: string;
        memo?: string;
        gender?: string;
        age?: string;
      };
    return(
      <>
      <Stack.Screen 
        options={{ 
            title : '',
            headerLeft: () => (
              <Pressable onPress={gotoPeopelScreen} >
                <Ionicons name="chevron-back" size={24} color="#4169e1" />
              </Pressable>
            ),
            headerStyle:{
            backgroundColor: '#f2f2f2',
            },
            headerShadowVisible: false,
        }}/> 
      <View  style={styles.container}>
      {image ? (
        <Image 
            source={{ uri: image }} 
            style={styles.image} />
        ) : (
          <View style={styles.defaultImage}>
            <Text style={styles.defaultText}numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
          </View>
       )}
       <Text>이름: {name}</Text>
       <Text>나이 : {age}</Text>
    </View>
    </>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 13,
        alignItems: 'center',
      },
      defaultImage:{
        backgroundColor: 'lightgray',
        width: 80,
        height: 80,
        borderRadius: 50,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      defaultText: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      image: {
        width: 80,
        height: 80,
        borderRadius: 50,
        marginBottom: 10,
      },
});

