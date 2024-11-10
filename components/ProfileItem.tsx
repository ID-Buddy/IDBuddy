import React from 'react';
import {Link} from 'expo-router';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';

import { Profile } from '@/types/index';

export default function ProfileItem({image,name,relationship, memo, gender, age}:Profile){
  return(
    <View style={styles.container} >
    <Link 
      href={{
        pathname: "/profile",
        params: {image:image,name:name,relationship:relationship, memo:memo, gender:gender, age:age}
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
        <View style={styles.info}>
          <Text>{name}</Text>
          <Text>{relationship}</Text>
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
    justifyContent: 'flex-start',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'space-between',
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
  name: {
    
  }
});