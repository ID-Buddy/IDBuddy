import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Context 
import { useRouter} from 'expo-router';
import { useDb } from '@/context/DbContext';
import { DbContextType } from '@/types/index';
import { Record } from '@/types/index';
import {Profile} from '@/types/index';
//Icon
import Ionicons from '@expo/vector-icons/Ionicons';
const RecordItem: React.FC<Record> = ({ id, timestamp, detail}) => {
  const {deleteRecord, updateDetail,fetchProfileById} = useDb() as DbContextType;
  const [isInputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [profile, setProfile] = useState<Profile|null>(null);
  const router = useRouter();
  useEffect(() =>{
    if (id){
      const fetchProfile = async () => {
        const result = await fetchProfileById(id);
        setProfile(result);
      };
      fetchProfile();
    } else{
      console.warn('Recent Record: ID is not provided')
    }  
  },[]);
  // 데이터 추가 함수
  const addRecordToStorage = async (id: number, newRecord: Record) => {
    try {
      // AsyncStorage에서 기존 데이터를 가져오기
      const existingRecordsJSON = await AsyncStorage.getItem(id.toString());
      const existingRecords = existingRecordsJSON ? JSON.parse(existingRecordsJSON) : [];

      // 기존 데이터에서 id와 timestamp가 같은 데이터를 제거
      const updatedRecords = existingRecords.filter(
        (record: { timestamp: number; }) => record.timestamp !== newRecord.timestamp
      );

       // 새로운 데이터를 리스트에 추가
      updatedRecords.push(newRecord);

      // 리스트의 길이가 10개를 초과하면 가장 오래된 데이터를 제거
      if (updatedRecords.length > 10) {
        updatedRecords.shift(); // 가장 오래된 데이터를 제거
      }

      // 업데이트된 리스트를 AsyncStorage에 저장
      await AsyncStorage.setItem(id.toString(), JSON.stringify(updatedRecords));
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
      setInputValue('');
      setInputVisible(false);
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

  const navigateToProfile = () => {
    if(profile){
      router.push({
        pathname: "/profile",
        params: {
          id: profile?.id,
          image: profile?.image,
          name: profile?.name,
          relationship: profile?.relationship,
          memo: profile?.memo,
          gender: profile?.gender,
          age: profile?.age,
        },
      });
    }
  };
  return (
    <View style={styles.recordItem}>
      <View style={styles.profile_container}>
      <TouchableOpacity onPress={navigateToProfile}>
        {profile?.image ? (
          <Image 
              source={{ uri: profile?.image }} 
              style={styles.image} 
          />
          ) : (
            
            <View style={styles.defaultImage}>
              <Text style={styles.defaultText}numberOfLines={1} ellipsizeMode='tail'>{profile?.name}</Text>
            </View>
        
          )}
           </TouchableOpacity>
        <View style={styles.text_container}>
          <View style={{flexDirection: 'row', flex:1}}>
            <Text style={styles.recordText}><Text style={styles.bold}>{profile?.name}</Text></Text>
            
          </View>
          <Text style={styles.recordText}>Timestamp: {new Date(timestamp).toLocaleString()}</Text>
          <Text style={styles.recordText}>Detail: {detail ? detail : <Text style={{color: '#a4a4a4'}}>입력한 내용이 없음</Text>}</Text>
        </View>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash-sharp" size={30} color="red" />
        </TouchableOpacity>
      </View>
        
      
      <TouchableOpacity onPress={toggleInput} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {isInputVisible ? '숨기기' : '일기 내용 추가하기'}
        </Text>
      </TouchableOpacity>
      
      {isInputVisible && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter additional details"
            value={inputValue}
            multiline={true}
            onChangeText={handleInputChange}
          />
          <View style={styles.submit_container}>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  submit_container:{
    alignItems:'flex-end'
  },
  bold:{
    fontWeight: 'bold',
    fontSize:16,
  },
  text_container:{

  },
  profile_container:{
    flexDirection: 'row',
    flex: 1,
    gap: 15,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  defaultImage:{
    backgroundColor: '#c4c4c4',
    width: 63,
    height: 63,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: 63,
    height: 63,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    borderRadius: 30,
    borderColor: '#4169e1',
    alignItems: 'flex-end',
    borderWidth: 1,
  },
  submitButtonText: {
    color: '#4169e1',
    fontSize: 14,
    fontWeight: 'semibold',
  },
  deleteButton: {
    alignItems: 'flex-end', 
    flex:1,
    justifyContent: 'flex-start',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default RecordItem;
