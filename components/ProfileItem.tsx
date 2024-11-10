import React from 'react';
import {Link} from 'expo-router';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';

import { Profile } from '@/types/index';

export default function ProfileItem({id,image,name,relationship, memo, gender, age}:Profile){
  if (image){
    console.log(image);
  }
  return(
    <View style={styles.container} >
    <Link 
      href={{
        pathname: "/profile",
        params: {id:id,image:image,name:name,relationship:relationship, memo:memo, gender:gender, age:age}
      }}>
      <View  style={styles.item}>
        {image ? (
        <Image 
            source={{ uri: image }} 
            style={styles.image} 
        />
        ) : (
        <View style={styles.defaultImage}>
            <Text style={styles.defaultText}numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
        </View>
        )}
        <View style={styles.content}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.info}>
            <Text style={styles.relationship}>{relationship}</Text>
          </View>  
        </View>
      </View>
    </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 3,
  },
  item:{
    width: '100%',
    padding: 10, 
    flexDirection:'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  defaultImage:{
    backgroundColor: '#c4c4c4',
    width: 60,
    height: 60,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 600,
  },
  relationship:{
    fontSize: 15,
  },
  info:{
    borderRadius: 100,
    backgroundColor: '#D0E3FF',
    padding: 6,
    paddingLeft: 7,
    paddingRight: 7,
  }
});