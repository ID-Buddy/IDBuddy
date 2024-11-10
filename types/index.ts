import * as SQLite from 'expo-sqlite';

export interface Profile {
    id: number; // 자동 증가되는 기본 키
    image?: string | null; // 이미지 URL (null 가능)
    name: string; // 이름 (필수)
    relationship: string; // 관계 (필수)
    gender: string; // 성별 (필수)
    memo: string; // 메모 (필수)
    age: string;
  }

  // 데이터베이스 컨텍스트 생성
export interface DbContextType {
    db: SQLite.SQLiteDatabase | null; // 데이터베이스 객체
    profiles: Profile[]; // 프로필 데이터 배열
    addProfile: (profile: Profile) => Promise<void>; // 프로필 추가 함수
    deleteAllProfiles: () => Promise<void>; // 모든 프로필 삭제 함수
    deleteProfile: (id: number) => Promise<void>; // 모든 프로필 삭제 함수
  }


// 검색어 타입 설정
// keyword와 onChangeText를 포함하는 객체 타입을 설정
export interface SearchContextType {
  keyword: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
}
