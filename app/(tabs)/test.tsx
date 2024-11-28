import React from 'react';
import { Button, View, ScrollView, Text } from 'react-native';
import * as Speech from 'expo-speech';

export default function App() {
  const speak = () => {
    Speech.speak('안녕하세요! Expo Speech를 테스트합니다.', {
      language: 'ko-KR', // 한국어로 설정
      pitch: 1.0, // 음성의 높이
      rate: 1.0,  // 음성의 속도
    });
  };
  return (
    <View style={{flexDirection: 'row', flex: 1, marginTop: 100,}}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          <Text>asdasdasd</Text>
          <Text>asdasdasd</Text>
          <Text>asdasdasd</Text>
          <Text>asdasdasd</Text>
          <Text>asdasdasd</Text>
          <Text>asdasdasd</Text>
          <Text>asdasdasd</Text>
          <Text>asdasdasd</Text>
          <Text>asdasdasd</Text>
          <Text>asdasdasd</Text>
        </ScrollView>
      </View>
  );
}