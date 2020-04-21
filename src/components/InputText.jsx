import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';

export default InputText = (props) => {
    return(
        <View style={styles.inputView} >
            <TextInput  
                placeholderTextColor="#818181"
                style={styles.inputText}
                placeholder={props.holderName}
                value={props.value}
                onChangeText={props.change}
            />
        </View> 
    )
}
const styles = StyleSheet.create({
    inputView:{
        borderRadius:25,
        borderColor: 'black',
        height:50,
        marginBottom:20,
        padding:20,
        color: 'black',
        alignContent: 'center',
        marginHorizontal: 40
    },
    inputText:{
        height:50,
        color:"black",
        borderColor: '#818181',
        borderBottomWidth: 1,
        padding: 5
    },
})