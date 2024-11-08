import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';

import { Profile } from '@/types/index';

export default function ProfileItem({image,name,relationship, memo, gender, age}:Profile){
  const [isVisible, setIsVisible] = useState<boolean>(false); // 상태 정의

  // toggle 함수
  const toggleVisibility = () => {
    setIsVisible(prevState => !prevState); // 이전 상태 반전
  };

  return(
    <Pressable onPress={toggleVisibility}>
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
          {isVisible?
            <View style={styles.info}>
            <Text>이름: {name}</Text>
            <Text>나이: {Number(age)}</Text>
            <Text>성별: {gender}</Text>
            <Text>관계: {relationship}</Text>
            <Text>메모:</Text>
            <Text>{memo}</Text>
          </View> :(
            <View>
              <Text>{name}</Text>
            </View>
          )
        }
            
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item:{
    flex: 1,
    flexDirection:'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
  },
  info: {
    paddingLeft: 10,
    paddingRight: 10,
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