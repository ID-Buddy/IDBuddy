import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RecordItemProps {
  id: number;
  timestamp: number;
  detail: string | null;
}

const RecordItem: React.FC<RecordItemProps> = ({ id, timestamp, detail }) => {
  return (
    <View style={styles.recordItem}>
      <Text style={styles.recordText}>ID: {id}</Text>
      <Text style={styles.recordText}>Timestamp: {new Date(timestamp).toLocaleString()}</Text>
      <Text style={styles.recordText}>Detail: {detail ? detail : 'No details provided'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  recordItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recordText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default RecordItem;
