import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function RecordEmptyScreen() {
  return(
    <View style={styles.container}>
      <Text style={styles.text}>아직 기록이 없습니다.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
    fontWeight: 'semibold',
  }
});