import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

import { Profile } from '@/types/index';

export default function ProfileItem({id,image,name,relationship, memo, gender}:Profile){
  return(
    <View  style={styles.item}>
        {image ? (
        <Image 
            source={{ uri: image }} 
            style={styles.image} 
        />
        ) : (
        <View style={styles.defaultImage}>
            <Text style={styles.defaultText}>{name}</Text>
        </View>
        )}
        <Text>이름: {name}</Text>
        <Text>관계: {relationship}</Text>
        <Text>메모: {memo}</Text>
        <Text>성별: {gender}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item:{
    flex: 1,
  },
  defaultImage:{
    backgroundColor: 'lightgray',
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },

});