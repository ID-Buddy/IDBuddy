import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Context 
import { useDb } from '@/context/DbContext';
import { DbContextType } from '@/types/index';
interface RecordItemProps {
  id: number;
  timestamp: number;
  detail: string | null;
}

const RecordItem: React.FC<RecordItemProps> = ({ id, timestamp, detail}) => {
  const {deleteRecord, updateDetail} = useDb() as DbContextType;
  const [isInputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  // 데이터 추가 함수
  const addRecordToStorage = async (id: number, newRecord: RecordItemProps) => {
    try {
      // AsyncStorage에서 기존 데이터를 가져오기
      const existingRecordsJSON = await AsyncStorage.getItem(id.toString());
      const existingRecords = existingRecordsJSON ? JSON.parse(existingRecordsJSON) : [];

      // 새로운 데이터를 리스트에 추가
      existingRecords.push(newRecord);

      // 리스트의 길이가 10개를 초과하면 가장 오래된 데이터를 제거
      if (existingRecords.length > 10) {
        existingRecords.shift(); // 가장 오래된 데이터를 제거
      }

      // 업데이트된 리스트를 AsyncStorage에 저장
      await AsyncStorage.setItem(id.toString(), JSON.stringify(existingRecords));
    } catch (error) {
      console.error('Error adding record to AsyncStorage:', error);
    }
  };
  const handleSubmit = () => {
    const record = {
      id: id,
      timestamp: timestamp,
      detail: inputValue 
    };
    updateDetail(record);
    addRecordToStorage(id, record);
  };
  const toggleInput = () => {
    setInputVisible(!isInputVisible);
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

  const handleDelete = () => {
    deleteRecord(id, timestamp);
  };

  
  return (
    <View style={styles.recordItem}>
      <Text style={styles.recordText}>ID: {id}</Text>
      <Text style={styles.recordText}>Timestamp: {new Date(timestamp).toLocaleString()}</Text>
      <Text style={styles.recordText}>Detail: {detail ? detail : 'No details provided'}</Text>
      
      <TouchableOpacity onPress={toggleInput} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {isInputVisible ? 'Hide Input' : 'Add Details'}
        </Text>
      </TouchableOpacity>
      
      {isInputVisible && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter additional details"
            value={inputValue}
            onChangeText={handleInputChange}
          />
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
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
  toggleButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4169e1',
    borderRadius: 5,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  inputContainer: {
    marginTop: 10,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    padding: 10,
    backgroundColor: '#4169e1',
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default RecordItem;
