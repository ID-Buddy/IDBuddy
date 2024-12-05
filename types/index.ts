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
export interface Record {
  id: number; //식별된 사람 id
  timestamp : number; //기록된 시간(Date.now()의 값)
  detail : string | null // 사용자가 기입한 내용(만남일기)
}
  // 데이터베이스 컨텍스트 생성
export interface DbContextType {
    db: SQLite.SQLiteDatabase | null; // 데이터베이스 객체
    profiles: Profile[]; // 프로필 데이터 배열
    profileInfo: Profile | null | undefined;
    addProfile: (profile: Profile) => Promise<void>; // 프로필 추가 함수
    deleteAllProfiles: () => Promise<void>; // 모든 프로필 삭제 함수
    deleteProfile: (id: number) => Promise<void>; // 모든 프로필 삭제 함수
    fetchProfileById: (id:number) => Promise<Profile|null>; // ID로 특정 프로필 정보 가져오기
    updateProfile: (profile:Profile) => Promise<void>//프로필 업데이트 함수
    
    recordDb: SQLite.SQLiteDatabase | null; 
    records: Record[]; // 기록데이터 배열
    addRecord: (record: Record) => Promise<void>; // 기록 추가 함수
    deleteRecordsBeforeMidnight: ()=>Promise<void> //자정 이전 기록 삭제 함수
  
  }



// 검색어 타입 설정
// keyword와 onChangeText를 포함하는 객체 타입을 설정
export interface SearchContextType {
  keyword: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
}
