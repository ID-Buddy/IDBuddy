import * as SQLite from 'expo-sqlite';

export interface Profile {
    id: number; // 자동 증가되는 기본 키
    image?: string | null; // 이미지 URL (null 가능)
    name: string; // 이름 (필수)
    relationship: string; // 관계 (필수)
    gender: string; // 성별 (필수)
    memo: string; // 메모 (필수)
  }

  // 데이터베이스 컨텍스트 생성
export interface DbContextType {
    db: SQLite.SQLiteDatabase | null; // 데이터베이스 객체
    profiles: Profile[]; // 프로필 데이터 배열
  }