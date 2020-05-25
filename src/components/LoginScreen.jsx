import React, { Component, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { Text, } from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';
import firebase from '../../firebaseConfig'

const LoginScreen = (props) => {
    const [navigation, setNavigation] = useState(props.navigation);
    const [globalState, setGlobalState] = useState(props.globalState);
    const [email, setEmail] = useState();
    const [password, setPass] = useState();
    // console.log("LoginScreen/////////////////////////////////////")
    // console.log(globalState.state);

    AsyncStorage.getItem('Authenticated', (err, result) => {
    //   console.log("Authenticated = " + result)
    })


    const emailInput = (text) => {
        setEmail(text)
    }
    const passwordInput = (pass) => {
        setPass(pass)
    }


    const login = () => {
        console.log("pushed login")
        if(email == null || email == ""){
            alert("emailを入力してください");
        }
        else if(password == null || email == ""){
            alert("passwordを入力してください");
        }
        else{
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(error)
                return error;
            }).then((result) =>{
                // console.log("result/////////////////////////////////////////")
                // console.log(result)
                if(result.message){
                    alert(result.message);
                } else if(result.user){
                    if(result.user.emailVerified == true){
                        //////メール認証ができている場合
                        console.log("メール認証済")
                        AsyncStorage.setItem('Authenticated', 'true');                    
                        globalState.login(result.user);
                    }
                    else if(result.user.emailVerified == false){
                        //////メールを登録したけどメール認証していない場合
                        console.log("メール未認証")
                        alert("認証エラー：アカウント作成時に送信された認証メールを確認してくだい");
                    }
                } else {
                    console.log("予期せぬエラーが発生しました");
                }
            })
        }
    }
        
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.logo}>TomoSume</Text>
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
                    onChangeText={passwordInput}
                />
            </View>
            <TouchableOpacity 
                onPress={() => navigation.navigate('ResetPassword')}
            >
                <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={login}
            >
                <Text style={styles.buttonText}> Sign In </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('CreateAccount')}
            >
                <Text> Create Account </Text>
            </TouchableOpacity>
        </View>
    );
}

const LoginScreenWrapper = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalStateContainer]}>
            {
                globalState => <LoginScreen globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}

export default LoginScreenWrapper;


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
    inputView:{
        width:"80%",
        borderRadius:25,
        borderColor: 'black',
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    inputText:{
        height:50,
        color:"black"
    },
    forgot: {
        margin: 20,
        color: '#818181',
        marginBottom: 60
    },
    button: {
        width:"80%",
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
