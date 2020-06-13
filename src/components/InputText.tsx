import React from 'react';
import { StyleSheet, View, TextInput} from 'react-native';

interface InputTextProps{
    holderName: string,
    price: string,
    change: any
    canEdit?: boolean
}

const InputText = (props: InputTextProps) => {
    return(
        <View　style={styles.inputView} >
            <TextInput
                editable={props.canEdit}
                placeholderTextColor="#818181"
                style={styles.inputText}
                placeholder={props.holderName}
                value={props.price}
                onChangeText={props.change}
                keyboardType="numeric"
            />
        </View>
    )
}

export default InputText

const styles = StyleSheet.create({
    inputView:{
        borderRadius:25,
        borderColor: 'black',
        height:50,
        padding:20,
        paddingTop: 0,
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