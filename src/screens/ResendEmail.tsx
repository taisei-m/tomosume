import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { Text, Tile, Button as ButtonElem } from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';
import firebase from '../../firebaseConfig';
import { convertCompilerOptionsFromJson } from 'typescript';

const ResendEmail = (props) => {
    console.log(props.globalState.state.userData.email)
    console.log('resendEmail----------------------------------')
    const [_navigation, setNavigation] = useState(props.navigation);
    const [_email, setEmail] = useState<string>('');
    const [_titleText, setTitleText] = useState<string>('');
    const [_contentText, setContentText] = useState<string>("メールを確認して本登録をしてください。");
    const [_resendButtonIsloading, setResendButtonIsloading] = useState<boolean>(false);
    
    const emailInput = (text: string) => {
        setEmail(text)
    }
    const titleTextInput = (textType: string, passedEmail: string) => {
        let titleText: string = '';
        if (textType == '初期表示') {
            titleText = passedEmail + '\nへメールを送信しました';
        } else if (textType == '再送信') {
            titleText = _email + '\nへメールを再送信しました'
            console.log('jjj')
        }
        setTitleText(titleText);
        resendButtonIsloadingInput(false);
    }
    const resendButtonIsloadingInput = (result: boolean) => {
        setResendButtonIsloading(result);
    }
    
   

    useEffect(
        () => {
            let email: string = props.globalState.state.userData.email;
            emailInput(email);
            let textType: string = '初期表示';
            titleTextInput(textType, email);
    }, [])
     
    
    const DoResendEmail = () => {
        resendButtonIsloadingInput(true);
        /*[改善の余地あり]
        サインインした後やとuserでメールアドレス取れるから再送信用のメールアドレス入力欄は作らんだ。
        本登録する前にアプリ再起動したら仮認証状態無くなってuserでメアド取れやんくなる。
        やから、仮登録して、本登録前にアプリ一回終了して、かつメアド見れやん状態の人やったらそのメアドでは
        誰も登録できやんくなる。
        仮登録期間が一定数あってそれが過ぎると仮登録情報消されるとかあるんかな？
        */
        /*[改善の余地あり]
            ＜sendEmailVerificationの後にthenとcatchに同じ処理が書いてある理由＞
            CraateAccount.jsxの方にも同じようなこと書いたけど
            存在しないメアドでsendEmailVerificationを使った時にcreateaccountのほうはエラーでやんくて
            resendEmailの方はエラー出るっていうよくわからんことなっとるから
            存在しないメアドの場合でもユーザーにはそのメアドに「送信しました」って映るようにした。
            やから両方に同じ処理書いた。今後わかったら改善してくれ。
        */
        let user = props.globalState.state.userData;
        
        user.sendEmailVerification().then(function() {
            // Email sent.
            let textType: string = '再送信';
            let email: string = '';
            titleTextInput(textType, email);
        }).catch(function(error) {
        // An error happened.
            console.log(error);
            let textType: string = '再送信';
            let email: string = '';
            titleTextInput(textType, email);
        })
    }


    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.titleText}>{_titleText}</Text>
            </View>
            <View>
                <Text style={styles.contentText}>{_contentText}</Text>
            </View>

            <View
            style={{width: '80%'}}
            >
                <ButtonElem
                title="メールを再送信する"
                type="solid"
                buttonStyle={styles.button}
                onPress={DoResendEmail}
                loading={_resendButtonIsloading}
                />
            </View>

            <TouchableOpacity
                onPress={() => { _navigation.navigate('LoginScreen') }}
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
        color: "black",
    },
    forgot: {
        margin: 20,
        color: '#818181',
        marginBottom: 60
    },
    button: {
        backgroundColor:"#5E9CFE",
        borderRadius: 25,
        borderColor: 'black',
        height: 50
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
