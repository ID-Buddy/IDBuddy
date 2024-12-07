import React , {useEffect, useState}from 'react';
import {View, Text, StyleSheet, Image, Pressable, Button, FlatList} from 'react-native';
import { Profile } from '@/types/index';
import {Stack, useLocalSearchParams, useRouter, Link} from 'expo-router';
import { useDb } from '@/context/DbContext';
import { DbContextType } from '@/types/index';
import { Record } from '@/types/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Icon
import Ionicons from '@expo/vector-icons/Ionicons';

export default function profileScreen(){
    const router = useRouter();
    const {deleteProfile, fetchProfileById} = useDb() as DbContextType;
    const gotoPeopleScreen= () => {
      router.back();
    }
    const params = useLocalSearchParams();
    const {id,image,name,relationship, memo, gender, age} = params  as {
        id?: number;
        image?: string;
        name?: string;
        relationship?: string;
        memo?: string;
        gender?: string;
        age?: string;
      };
    const [records, setRecords] = useState<Record[]>([]);

    useEffect(() => {
      if (id !== undefined) { // id가 존재하는지 확인
        const fetchRecords = async () => {
          try {
            // AsyncStorage에서 해당 id의 데이터를 가져오기
            const storedRecordsJSON = await AsyncStorage.getItem(id.toString());
            if (storedRecordsJSON) {
              // JSON을 파싱하여 리스트 형태로 변환
              const storedRecords = JSON.parse(storedRecordsJSON);
              setRecords(storedRecords);
            }
          } catch (error) {
            console.error('Error fetching records from AsyncStorage:', error);
          }
        };
  
        fetchRecords();
      } else {
        console.warn('ID is not provided');
      }
    }, [id]);

    const handleDeleteProfile = async () =>{
      await deleteProfile(id as number)
      router.back();
    };
    const handleEditProfile = () => {
      router.replace('/editprofile');
    };
    return(
      <>
      <Stack.Screen 
        options={{ 
            title : '',
            headerLeft: () => (
              <Pressable onPress={gotoPeopleScreen} >
                <Ionicons name="chevron-back" size={25} color="#4169e1" />
              </Pressable>
            ),
            headerRight: () => (
              <Link 
                href={{
                  pathname: "/editprofile",
                  params: {id:id,image:image,name:name,relationship:relationship, memo:memo, gender:gender, age:age}
                }}>
                  <Text style={styles.edit_btn}>편집</Text>
                </Link>
            ),
            headerStyle:{
              backgroundColor: '#f2f2f2',
            },
            headerShadowVisible: false,
        }}/> 
      <View  style={styles.container}>
      {image ? (
        <Image 
            source={{ uri: image }} 
            style={styles.image} />
        ) : (
          <View style={styles.defaultImage}>
            <Text style={styles.defaultText}numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
          </View>
       )}
       <View style={styles.info_container}>
        <View style={styles.row_center}>
          <Text style={[styles.content, styles.name]}>{name}</Text>
          <Text style={styles.content}>({age},{gender})</Text>
        </View>
        <Text style={[styles.content, styles.ref]}>{relationship}</Text>
        <View style={styles.memo_container}>
          <Text style={styles.memo_title}>메모</Text>
          <Text style={styles.memo}>{memo}</Text>
        </View>
       </View>
       <View style={styles.container}>
        {records.length > 0 ? (
          <FlatList
            data={records}
            keyExtractor={(item, index) => index.toString()} // 고유 키 생성
            renderItem={({ item }) => (
              <View style={styles.recordItem}>
                <Text>ID: {item.id}</Text>
                <Text>Timestamp: {new Date(item.timestamp).toLocaleString()}</Text>
                <Text>Detail: {item.detail ? item.detail : 'No details provided'}</Text>
              </View>
            )}
          />
        ) : (
          <Text>No records found for this ID</Text>
        )}
      </View>
       <Button title="프로필 삭제" onPress={() => id !== undefined && handleDeleteProfile()} color="red" />
    </View>
    </>
    );
}

const styles = StyleSheet.create({
  row_center:{
    flexDirection: 'row',
    alignItems:'center'
  }, 
  recordItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  edit_btn:{
    fontSize: 19,
    color: "#4169e1",
  },
  ref:{
    color: '#838383',
  },
  memo_title:{
    fontSize: 17,
    color: '#4169E1',
    marginBottom: 8,
  },
  memo_container:{
    marginTop: 10,
    borderColor: '#4169E1',
    borderRadius: 10,
    backgroundColor: '#f6f6f6',
    width: '80%',
    borderWidth:1.5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  memo:{
    lineHeight: 25,
  },
  container:{
        flex: 1,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 13,
        alignItems: 'center',
      },
      info_container:{
        marginTop: -50,
        paddingTop: 65,
        backgroundColor: 'white',
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingBottom: 25,
        zIndex: 1,
        shadowColor: '#a4a4a4',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: {
          width: 0,
          height: 3,
        },
        elevation: 3,
      },
      defaultImage:{
        backgroundColor: '#c4c4c4',
        width: 200,
        height: 200,
        borderRadius: 50,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
      },
      defaultText: {
        fontSize: 60,
        fontWeight: 'bold',
      },
      image: {
        width: 200,
        height: 200,
        borderRadius: 50,
        zIndex: 2,
      },
      content:{
        fontSize: 15,
        marginBottom : 8,
      },
      name:{
        fontSize: 20,
        fontWeight: 600,
      }
});

