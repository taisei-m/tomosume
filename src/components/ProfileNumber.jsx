import React from 'react';
import { StyleSheet, Text, View} from 'react-native';

export default ProfileNumber = (props) => {
    return(
        <View style={props.centerClass}>
            <Text 
                style={styles.number}
                onPress={props.press}
            >{props.number}</Text>
            <Text style={styles.numberKey}>{props.itemName}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    number: {
        fontSize: 28
    },
    numberKey: {
        fontSize: 12,
        textAlign: 'center',
        color: '#818181'
    },
})