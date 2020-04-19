import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Text, } from 'react-native-elements'
import firebase from '../../firebase'

export default CreateAccount = (props) => {
    const [userId, setName] = useState()
    const [password, setPass] = useState()
    const userIdInput = (text) => {
        setName(text)
    }
    const passwordInput = (pass) => {
        setPass(pass)
    }
    const signUp = () => {
        console.log(userId);
        console.log(password)
        firebase.auth().createUserWithEmailAndPassword(userId, password)
        .then(function() {
            alert('sign up success')
        })
        .catch(function(error) {
            alert(error.message)
        })
    }
    return (
        <View style={styles.container}>
        <View>
            <Text style={styles.newAccountTitle}>Create New Account</Text>
        </View>
        <View style={styles.inputView} >
            <TextInput  
                style={styles.inputText}
                placeholder="userID"
                placeholderTextColor="#818181"
                value={userId}
                onChangeText={userIdInput}
            />
        </View>
        <View style={styles.inputView} >
            <TextInput  
                style={styles.inputText}
                placeholder="password" 
                placeholderTextColor="#818181"
                value={password}
                secureTextEntry={true}
                onChangeText={passwordInput}
            />
        </View>
        <View style={styles.inputView} >
            <TextInput  
                style={styles.inputText}
                placeholder="confirm-password" 
                placeholderTextColor="#818181"
            />
        </View>
        <TouchableOpacity
            style={styles.signUpButton}
            onPress={signUp}
        >
            <Text style={styles.buttonText}> Sign Up </Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => props.navigation.navigate('LoginScreen')}
        >
            <Text> Already have an account </Text>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    container1: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    newAccountTitle: {
        fontWeight:"bold",
        fontSize:30,
        color:"black",
        marginTop: 120,
        marginBottom: 60
    },
    logo:{
        fontWeight:"bold",
        fontSize:50,
        color:"black",
        marginBottom:100
    },
    inputView:{
        width:"80%",
        borderRadius:25,
        borderColor: 'black',
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20,
        color: 'black'
    },
    inputText:{
        height:50,
        color:"black",
        borderColor: '#818181',
        borderBottomWidth: 1,
        padding: 5
    },
    forgot: {
        margin: 20,
        color: '#818181',
        marginBottom: 30
    },
    signUpButton: {
        width:"70%",
        backgroundColor:"#5E9CFE",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 50,
        marginBottom:30
    },
    button: {
        width:"70%",
        backgroundColor:"#5E9CFE",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginBottom:30
    },
    buttonText: {
        color: 'white'
    },
    icon: {
        marginRight: 10
    }
});