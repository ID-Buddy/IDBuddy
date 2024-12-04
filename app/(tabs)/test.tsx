import React from 'react';
import { Button, View, ScrollView, Text } from 'react-native';
import * as Speech from 'expo-speech';
import { WebView } from 'react-native-webview';
export default function App() {
  return (
    <View style={{flexDirection: 'row', flex: 1, marginTop: 100,}}>
        <WebView
              style={{flex:1}}
              source={{ uri: 'http://192.168.137.8:5001/api/video_feed' }}
            />
      </View>
  );
}