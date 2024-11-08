import React from 'react';
import {
    Pressable,
    StyleSheet,
    TextInput,
    useWindowDimensions,
    View,
} from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
//SearchContext
import { useSearch } from '@/context/SearchContext';
import { SearchContextType } from '@/types/index';

export default function SearchBar() {
    const {keyword, onChangeText}= useSearch() as SearchContextType;
    const {width} = useWindowDimensions();
    return(
      <View style={[styles.block, {width: width - 40 }]}>
        <TextInput 
          style={styles.input} 
          placeholder='이름을 검색하세요'
          value={keyword}
          onChangeText={onChangeText}
        />
        <Pressable
          style={({pressed}) => [styles.button, pressed && {opacity: 0.5}]}
          onPress={() => onChangeText('')}>
          <MaterialIcons name="cancel" size={20} color="#4169e1" /> 
        </Pressable>  
      </View>
    )
}

const styles = StyleSheet.create({
    block:{
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor: '#e3e3e3',
        height: 40,
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    input:{
        flex:1,
    },
    button: {
        marginLeft: 8,
    },
});