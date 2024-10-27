// app/Context/DbContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

// 데이터베이스 컨텍스트 생성
const DbContext = createContext<any>(null);

// 커스텀 훅으로 컨텍스트 사용
export const useDb = () => {
  return useContext(DbContext);
};

// 데이터베이스 공급자
export const DbProvider = ({ children }: { children: React.ReactNode }) => {
  const [db, setDb] = useState<any>(null); // 데이터베이스 객체
  const [profiles, setProfiles] = useState<any[]>([]); // 프로필 데이터

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

  return (
    <DbContext.Provider value={{ db, profiles }}>
      {children}
    </DbContext.Provider>
  );
};

