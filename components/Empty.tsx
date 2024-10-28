import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function RegisterScreen() {
  return(
    <View style={styles.container}>
        <Text style={styles.text}>등록된 프로필이 없습니다!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
    fontWeight: 'semibold',
  }
});