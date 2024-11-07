import React from 'react';
import {
    Pressable,
    StyleSheet,
    TextInput,
    useWindowDimensions,
    View,
} from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function SearchBar() {
    const {width} = useWindowDimensions();
    return(
      <View style={[styles.block, {width: width - 40 }]}>
        <TextInput style={styles.input} placeholder='검색'/>
        <Pressable
          style={({pressed}) => [styles.button, pressed && {opacity: 0.5}]}>
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