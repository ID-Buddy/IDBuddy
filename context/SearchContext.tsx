import React, {createContext,useContext, useState} from 'react';

import { SearchContextType } from '@/types/index';
const SearchContext = createContext<SearchContextType|null>(null);

// 커스텀 훅으로 컨텍스트 사용
export const useSearch = () => {
    return useContext(SearchContext);
  };
  
export function SearchContextProvider({children}: { children: React.ReactNode }) {
    const [keyword, onChangeText] = useState<string>('');
    return (
        <SearchContext.Provider value={{keyword, onChangeText}}>
            {children}
        </SearchContext.Provider>
    )
}