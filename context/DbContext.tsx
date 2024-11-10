// app/Context/DbContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

import { Profile } from '@/types/index';
import { DbContextType } from '@/types/index';


// 데이터베이스 컨텍스트 생성
const DbContext = createContext<DbContextType | null>(null);

// 커스텀 훅으로 컨텍스트 사용
export const useDb = () => {
  return useContext(DbContext);
};

// 데이터베이스 공급자
export const DbProvider = ({ children }: { children: React.ReactNode }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null); // 데이터베이스 객체
  const [profiles, setProfiles] = useState<Profile[]>([]); // 프로필 데이터

  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await SQLite.openDatabaseAsync('profiles.db');
      setDb(database); // 데이터베이스 객체 저장
      fetchProfiles(database); // 프로필 데이터 불러오기
    };

    initializeDatabase();
  }, []);

  // 프로필 데이터 불러오기
  const fetchProfiles = async (database: any) => {
    const result = await database.getAllAsync('SELECT * FROM profiles');
    setProfiles(result); // 프로필 상태 업데이트
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

  return (
    <DbContext.Provider value={{ db, profiles, addProfile, deleteProfile, deleteAllProfiles }}>
      {children}
    </DbContext.Provider>
  );
};

