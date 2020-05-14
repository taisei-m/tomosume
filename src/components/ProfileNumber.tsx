import React from 'react';
import { StyleSheet, Text, View} from 'react-native';

interface ProfileNumberProps {
    number: number
    press: any
    itemName: string
    centerClass?: object
}
const ProfileNumber = (props: ProfileNumberProps) => {
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

export default ProfileNumber

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