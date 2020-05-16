import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { Text, } from 'react-native-elements'
import firebase from '../../firebase'
import { getAppLoadingLifecycleEmitter } from 'expo/build/launch/AppLoading';

export default CreateAccount = (props) => {
    const [email, setEmail] = useState();
    const [password, setPass] = useState();
    const [confirmPassword, setConfPass] = useState();
    const [navigation, setNavigation] = useState(props.navigation);
    console.log("CreateAccount////////////////////////////////////////")
    AsyncStorage.getItem('Authenticated', (err, result) => {
    //   console.log("Authenticated = " + result)
    })

    const emailInput = (text) => {
        setEmail(text)
    }
    const passwordInput = (pass) => {
        setPass(pass)
    }

    const signUp = () => {
         if(email == null || email == "" ){
            alert("emailを入力してください");
        }
        else if(password == null || email == ""){
            alert("passwordを入力してください");
        }else if(password != confirmPassword){
            alert("パスワードが一致していません")
        }
        else{
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
                // var errorCode = error.code;
                // var errorMessage = error.message;
                // console.log("errorCode: "+errorCode)
                // console.log("errorMessage: "+errorMessage)
                return error;
            }).then((result) => {
                if(result.message){
                    alert(result.message);
                }　else if(result.user) {
                    var user = firebase.auth().currentUser;
                    firebase.auth().languageCode = "ja";

                    console.log("user = "+ user)

                    user.sendEmailVerification().then(function() {
                        alert("メールを送信しました。メールを確認して本登録をしてください");
                        navigation.navigate('LoginScreen');
                    }).catch(function(error) {
                        cosole.log("error = " + error);
                        alert("送信先が存在しません。メールアドレスが正しいかご確認ください。")
                    });
                } else{
                    console.log("予期せぬエラーが発生しました");
                }
            });
        }
    }


    return (
        <View style={styles.container}>
        <View>
            <Text style={styles.newAccountTitle}>Create New Account</Text>
        </View>
        <View style={styles.inputView} >
            <TextInput  
                style={styles.inputText}
                placeholder="email"
                placeholderTextColor="#818181"
                value={email}
                onChangeText={emailInput}
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
                value={confirmPassword}
                secureTextEntry={true}
                onChangeText={setConfPass}
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