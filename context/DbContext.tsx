// app/Context/DbContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

// Profile 타입 정의
export interface Profile {
  id: number; // 자동 증가되는 기본 키
  image?: string | null; // 이미지 URL (null 가능)
  name: string; // 이름 (필수)
  relationship: string; // 관계 (필수)
  gender: string; // 성별 (필수)
  memo: string; // 메모 (필수)
}

// 데이터베이스 컨텍스트 생성
interface DbContextType {
  db: SQLite.SQLiteDatabase | null; // 데이터베이스 객체
  profiles: Profile[]; // 프로필 데이터 배열
}

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

  return (
    <DbContext.Provider value={{ db, profiles }}>
      {children}
    </DbContext.Provider>
  );
};

