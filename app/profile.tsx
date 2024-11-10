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
              backgroundColor: '#f2f2f2'
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
       <View style={styles.info_container}>
        <View style={styles.row_center}>
          <Text style={[styles.content, styles.name]}>{name}</Text>
          <Text style={styles.content}>({age})</Text>
        </View>
        <Text style={[styles.content, styles.ref]}>{relationship}</Text>
        <View style={styles.memo_container}>
          <Text style={styles.memo_title}>메모</Text>
          <Text style={styles.memo}>{memo}</Text>
        </View>
       </View>
    </View>
    </>
    );
}

const styles = StyleSheet.create({
  row_center:{
    flexDirection: 'row',
    alignItems:'center'
  }, 
  ref:{
    color: '#838383',
  },
  memo_title:{
    fontSize: 17,
    color: '#4169E1',
    marginBottom: 8,
  },
  memo_container:{
    marginTop: 10,
    borderColor: '#4169E1',
    borderRadius: 10,
    backgroundColor: '#f6f6f6',
    width: '80%',
    borderWidth:1.5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  memo:{
    lineHeight: 25,
  },
  container:{
        flex: 1,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 13,
        alignItems: 'center',
      },
      info_container:{
        marginTop: -50,
        paddingTop: 65,
        backgroundColor: 'white',
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingBottom: 25,
        zIndex: 1,
        shadowColor: '#a4a4a4',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: {
          width: 0,
          height: 3,
        },
        elevation: 3,
      },
      defaultImage:{
        backgroundColor: 'lightgray',
        width: 200,
        height: 200,
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
        width: 200,
        height: 200,
        borderRadius: 50,
        zIndex: 2,
      },
      content:{
        fontSize: 15,
        marginBottom : 8,
      },
      name:{
        fontSize: 20,
        fontWeight: 600,
      }
});

