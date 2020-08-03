import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, } from 'react-native';
import { Text, Button as ButtonElem } from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../store/GlobalState';
import firebase from '../../firebaseConfig';
const ResendEmail = (props) => {
    const [_navigation] = useState(props.navigation);
    const [_email, setEmail] = useState<string>('');
    const [_titleText, setTitleText] = useState<string>('');
    const [_contentText, setContentText] = useState<string>("");
    const [_resendButtonIsloading, setResendButtonIsloading] = useState<boolean>(false);
    
    const emailInput = (text: string) => {
        setEmail(text)
    }
    const resendButtonIsloadingInput = (result: boolean) => {
        setResendButtonIsloading(result);
    }
    const titleTextInput = (textType: string, passedEmail: string) => {
        let titleText: string = '';
        if (textType == '初期表示') {
            titleText = passedEmail + '\nへメールを送信しました';
        } else if (textType == '再送信') {
            titleText = _email + '\nへメールを再送信しました'
        } else if (textType == '再送信失敗') {
            titleText = _email + '\nへメールを再送信できませんでした'
        } else if (textType == '本人確認済') {
            titleText = _email + 'で登録されたアカウントは既に本人確認済です'
        }
        setTitleText(titleText);
    }
    const contentTextInput = (textType: string) => {
        let contentText: string = '';
        let textSentEmailSuccesfully: string = 'メールを確認して本登録をしてください。';
        let textSentEmailFailed: string =  '30秒～1分後に再送信し直してください。';
        let textNotVertified: string = 'ログイン画面からログインしてください。';
        if (textType == '初期表示') {
            contentText = textSentEmailSuccesfully;
        } else if (textType == '再送信') {
            contentText = textSentEmailSuccesfully;
        } if (textType == '再送信失敗') {
            contentText = textSentEmailFailed;
        } if (textType == '本人確認済') {
            contentText = textNotVertified;
        }
        setContentText(contentText);
    }
    useEffect(
        () => {
            let email: string = props.globalState.state.createAccountEmail;
            emailInput(email);
            let textType: string = '初期表示';
            titleTextInput(textType, email);
            contentTextInput(textType);
    }, [])
    const DoResendEmail = async() => {
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
        let user = firebase.auth().currentUser;
        let textType: string = '';
        let email: string = '';
        if (user) {
            user.reload();
            let emailVerified: boolean = user.emailVerified;
            if (emailVerified == true) {
                textType = '本人確認済';
                email = '';
                titleTextInput(textType, email);
                contentTextInput(textType);
            } else if (emailVerified == false) {                
                user.sendEmailVerification().then(function () {
                    // Email sent.
                    textType = '再送信';
                    email = '';
                    titleTextInput(textType, email);
                    contentTextInput(textType);
                }).catch(function (error: any) :void {
                    // An error happened.
                    console.log('再送信失敗', error)
                    textType = '再送信失敗';
                    email = '';
                    titleTextInput(textType, email);
                    contentTextInput(textType);
                })
            }
        } else {
            alert('不正な処理が行われました。新しいメールアドレスで登録し直してください。')
            console.log("ResendEmail.tsx  userが取得できませんでした");
        }
        resendButtonIsloadingInput(false);
    }
    return (
        <View style={styles.container}>
            <View style={{marginLeft: 30, marginRight: 25}}>
                <Text style={styles.titleText}>{_titleText}</Text>
            </View>
            <View >
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
                <Text style={styles.ToLoginText}> ログイン画面へ </Text>
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
    ToLoginText: {
        textDecorationLine: 'underline',
        marginTop: '5%',
    },
    icon: {
        marginRight: 10
    }
});





