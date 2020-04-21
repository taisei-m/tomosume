import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Text, } from 'react-native-elements'
import firebase from '../../firebase'
import { getAppLoadingLifecycleEmitter } from 'expo/build/launch/AppLoading';

export default CreateAccount = (props) => {
    console.log(props)
    const [email, setEmail] = useState();
    const [password, setPass] = useState();
    const [navigation, setNavigation] = useState(props.navigation);
    const userIdInput = (text) => {
        setEmail(text)
    }
    const passwordInput = (pass) => {
        setPass(pass)
    }
    const signUp = () => {
        console.log(email);
        console.log(password)
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
            // ...
        }).then(() => {
            console.log("success 登録");
            var user = firebase.auth().currentUser;
            firebase.auth().languageCode = "ja";
            user.sendEmailVerification().then(function() {
                // Email sent.
              }).catch(function(error) {
                // An error happened.
              });
        }).then(() => {
            alert("メール見て");
            // var result = confirm("登録したメールアドレスに認証メールを送信しました。ログインするために認証してください。");
            if (true) {
                navigation.navigate('LoginScreen');
            } else {
                result;
            }
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
                placeholder="mail"
                placeholderTextColor="#818181"
                value={email}
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