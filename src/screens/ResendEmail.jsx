import React, { Component, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { Text, } from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';
import firebase from '../../firebase'

const ResendEmail = (props) => {
    const [navigation, setNavigation] = useState(props.navigation);
    const [globalState, setGlobalState] = useState(props.globalState);
    const [titleText, setTitleText] = useState("確認メールを送信しました");
    const [contentText, setContentText] = useState("メールを確認して本登録をしてください。");
 
    


    const emailInput = (text) => {
        setEmail(text)
    }
    
    const titleTextInput = () => {
        setTitleText("メールを再送信しました")
    }
     
    
    const DoResendEmail = () => {
        /*
        サインインした後やとuserでメールアドレス取れるから再送信用のメールアドレス入力欄は作らんだ。
        本登録する前にアプリ再起動したら仮認証状態無くなってuserでメアド取れやんくなる。
        やから、仮登録して、本登録前にアプリ一回終了して、かつメアド見れやん状態の人やったらそのメアドでは
        誰も登録できやんくなる。
        仮登録期間が一定数あってそれが過ぎると仮登録情報消されるとかあるんかな？
        */


        let user = firebase.auth().currentUser;
        console.log("user = " + user)
            
        user.sendEmailVerification().then(function() {
        // Email sent.
            titleTextInput();
        }).catch(function(error) {
        // An error happened.
        })
    }


    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.titleText}>{titleText}</Text>
            </View>
            <View>
                <Text style={styles.contentText}>{contentText}</Text>
            </View>
            
           
            
            <TouchableOpacity
                style={styles.button}
                onPress={DoResendEmail}
            >
                <Text style={styles.buttonText}> メールを再送信する </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('LoginScreen')}
            >
                <Text style={styles.buttonToLogin}> ログイン画面へ </Text>
            </TouchableOpacity>
        </View>
    );
}

const ResendEmailWrapper = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalStateContainer]}>
            {
                globalState => <ResendEmail globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}


export default ResendEmailWrapper;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText:{
        fontWeight:"bold",
        fontSize:26,
        color:"black",
        marginBottom:40
    },
    contentText:{
        fontSize:20,
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
    buttonToLogin: {
        textDecorationLine: 'underline'
    },
    icon: {
        marginRight: 10
    }
});
