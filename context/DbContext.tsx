// app/Context/DbContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

import { Profile } from '@/types/index';
import { Record } from '@/types/index';
import { DbContextType } from '@/types/index';


// 데이터베이스 컨텍스트 생성
const DbContext = createContext<DbContextType | null>(null);

// 커스텀 훅으로 컨텍스트 사용
export const useDb = () => {
  return useContext(DbContext);
};

// 데이터베이스 공급자
export const DbProvider = ({ children }: { children: React.ReactNode }) => {
  //profile 관련
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null); // 프로필데이터베이스 객체
  const [profiles, setProfiles] = useState<Profile[]>([]); // 프로필 데이터
  const [profileInfo, setProfileInfo] = useState<Profile |null >(null);//특정 프로필 데이터

  //recent record 관련
  const [recordDb, setRecordDb] = useState<SQLite.SQLiteDatabase | null>(null); // 기록저장데이터베이스 객체
  const [records, setRecords] = useState<Record[]>([]); //기록 데이터
  
  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await SQLite.openDatabaseAsync('profiles.db');
      const recordDatabase = await SQLite.openDatabaseAsync('records.db')

      setDb(database); // 프로필 데이터베이스 객체 저장
      fetchProfiles(database); // 프로필 데이터 불러오기

      setRecordDb(recordDatabase) // 기록 데이터베이스 객체 저장
      fetchRecords(recordDatabase);
    };

    initializeDatabase();
  }, []);

  // 프로필 데이터 불러오기
  const fetchProfiles = async (database: any) => {
    const result = await database.getAllAsync('SELECT * FROM profiles');
    setProfiles(result); // 프로필 상태 업데이트
  };

  // 기록 데이터 불러오기
  const fetchRecords = async (database: any) => {
    const result = await database.getAllAsync('SELECT * FROM records')
    setRecords(result); // 기록 상태 업데이트 
  }

  //프로필 업데이트 
  const updateProfile = async (profile: Profile) => {
    if(db) {
      await db.runAsync(
        `UPDATE profiles SET image = ?, name = ?, relationship = ?, memo = ?, gender = ?, age = ? WHERE id = ?`,
        profile.image || '',
        profile.name  || '', 
        profile.relationship || '',
        profile.memo || '',
        profile.gender || '',
        profile.age || '',
        profile.id
      );
      fetchProfiles(db); // 프로필 추가 후 상태 업데이트
    }
  };
  //디테일 업데이트
  const updateDetail = async (record: Record) => {
    if(recordDb) {
      await recordDb.runAsync(
        `UPDATE records SET detail = ? WHERE id = ? AND timestamp = ?`,
        record.detail,
        record.id,
        record.timestamp
      );
      fetchRecords(recordDb); // 프로필 추가 후 상태 업데이트
    }
  };
  // 프로필 추가
  const addProfile = async (newProfile: Profile) => {
    if (db) {
      await db.runAsync(
        'INSERT INTO profiles (id,image, name, relationship, memo, gender,age) VALUES (?,?, ?, ?, ?, ?,?)',
        newProfile.id,
        newProfile.image || '', 
        newProfile.name || '', 
        newProfile.relationship || '',
        newProfile.memo || '', 
        newProfile.gender || '', 
        newProfile.age || ''
      );
      fetchProfiles(db); // 프로필 추가 후 상태 업데이트
    }
  };

  // 기록 추가
  const addRecord = async (newRecord: Record) => {
    if(recordDb){
      await recordDb.runAsync(
        'INSERT INTO records (id,timestamp,detail) VALUES (?,?,?)',
        newRecord.id,
        newRecord.timestamp,
        newRecord.detail || '',
      );
      fetchRecords(recordDb); // 기록 추가 후 상태 업데이트 
    }
  }

  // 모든 프로필 데이터 삭제
  const deleteAllProfiles = async () => {
    if (db) {
      await db.runAsync('DELETE FROM profiles'); // 모든 프로필 데이터 삭제
      fetchProfiles(db); // 삭제 후 상태 업데이트
    }
  };
  //프로필 삭제
  const deleteProfile = async (id: number) => {
    if (db) {
      await db.runAsync(`DELETE FROM profiles WHERE id = ?`, [id]); // ID로 특정 프로필 삭제
      fetchProfiles(db); // 삭제 후 상태 업데이트
    }
  };

  //기록 삭제
  const deleteRecord = async (id: number, timestamp: number) => {
    if (recordDb) {
      await recordDb.runAsync(`DELETE FROM records WHERE id = ? AND timestamp = ?`, [id, timestamp]);
      fetchRecords(recordDb); // 삭제 후 상태 업데이트
    }
  };
  //id로 검색
  const fetchProfileById = async (id: number) => {
    if (db) {
      try {
        const result = await db.getFirstAsync(
          'SELECT * FROM profiles WHERE id = ?;',
          [id]
        );
        if (result) {
          return result ? (result as Profile) : null; // undefined 대신 null 반환
        } else {
          console.warn(`No profile found with id ${id}`);
        }
      } catch (error) {
        console.error('Error fetching profile by id:', error);
      }
    }
    return null; // 에러 발생 시 null 반환
  };
  
  // 특정 날짜 이전의 기록 삭제 함수
  const deleteRecordsBeforeMidnight = async () => {
    if (recordDb) {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

      await recordDb.runAsync(
        'DELETE FROM records WHERE timestamp <?',
        midnight.getTime() // 자정의 타임스탬프 값
      );
      fetchRecords(recordDb); // 삭제 후 상태 업데이트
    }
  };
  return (
    <DbContext.Provider 
      value={{ 
        db, 
        profiles, 
        profileInfo, 
        recordDb,
        records,
        updateProfile, 
        addProfile, 
        deleteProfile, 
        deleteAllProfiles, 
        fetchProfileById,
        addRecord,
        deleteRecordsBeforeMidnight,
        deleteRecord,
        updateDetail,
      }}>
      {children}
    </DbContext.Provider>
  );
};

