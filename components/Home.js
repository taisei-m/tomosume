import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default class Tab1 extends React.Component {
    render(){    
        return (
        <View style={styles.container}>
            <Text style={styles.logo}>Hello 1</Text>
        </View>
    )}    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo:{
        fontWeight:"bold",
        fontSize:50,
        color:"black",
        marginBottom:40
    },
})