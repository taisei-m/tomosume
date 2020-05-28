import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, AsyncStorage, Button} from 'react-native';
import { Text, Button as ButtonElem} from 'react-native-elements';
import { Subscribe } from 'unstated';
import firebase from '../../firebase'
//@ts-ignore
import GlobalStateContainer from '../containers/GlobalState';

const LoginScreen = (props: any) => {
    const [navigation, setNavigation] = useState(props.navigation);
    const [globalState, setGlobalState] = useState(props.globalState);
    const [emailAsRendered, setEmailAsRendered] = useState('');
    const [passwordAsRendered, setPasswordAsRendered] = useState('');
    const [validateTextEmail, setValidateTextEmail] = useState('');
    const [validateTextPassword, setValidateTextPassword] = useState('');
    const [signinErrorText, setSigninErrorText] = useState('');
    const [emailErrorIsRed, setEmailErrorIsRed] = useState(Boolean);
    const [passwordErrorIsRed, setPasswordErrorIsRed] = useState(Boolean);
    const [signinButtonDisabled, setSingnBunttonDisabled] = useState(true);
    // console.log("LoginScreen/////////////////////////////////////")
    // console.log(globalState.state);

    const emailAsRenderedInput = (text) => {
        setEmailAsRendered(text)
    }
    const passwordAsRenderedInput = (pass) => {
        setPasswordAsRendered(pass)
    }
    const emailErrorIsRedInput = (result: boolean) => {
        setEmailErrorIsRed(result)
    }
    const passwordErrorIsRedInput = (result: boolean) => {
        setPasswordErrorIsRed(result)
    }
    const signinButtonDisabledInput = (result: boolean) => {
        setSingnBunttonDisabled(result);
    }



    const validateTextEmailInput = (textType: string) => {
        let allowText: string = 'ok ✓';
        let denyText: string = '*有効なメールアドレスを入力してください';
        let blankText: string = '';
        let fillblankText: string = '*メールアドレスは必須です';
        
        switch(textType){
            case 'allow':
                setValidateTextEmail(allowText);
                break;
            case 'deny':
                setValidateTextEmail(denyText);
                break;
            case 'blank':
                setValidateTextEmail(blankText);
                break;
            case 'fillBlank':
                setValidateTextEmail(fillblankText)
        }  
    }

    const validateTextPasswordInput = (textType: string) => {
        let allowText: string = 'ok ✓';
        let denyText: string = '*半角英数字を含む6文字以上にしてください';
        let blankText: string = '';
        let fillblankText: string = '*パスワードは必須です'

        switch (textType) {
            case 'allow':
                setValidateTextPassword(allowText);
                break;
            case 'deny':
                setValidateTextPassword(denyText);
                break;
            case 'blank':
                setValidateTextPassword(blankText);
                break;
            case 'fillBlank':
                setValidateTextPassword(fillblankText)
        }
    }
        
    const signinErrorTextBlankInput = (errorCode: string) => {
        let outputErrorText: string = '';

        switch (errorCode) {
            case 'Email is blank':
                    outputErrorText = 'メールアドレスが未入力です';
                break;
            case 'Password is blank':
                outputErrorText = 'パスワードが未入力です';
                break;
            case 'None is blank':
                    outputErrorText = '';
                break;
        }
        setSigninErrorText(outputErrorText);
    }
    const signinErrorTextInputFirebase = (errorCode: string, errorMessage: string) => {
        let outputErrorText: string = '';

        switch (errorCode) {
            case 'auth/wrong-password':
                //default firebase error message: 'The password is invalid or the user does not have a password'
                outputErrorText = 'パスワードが違います。もしくは設定されていません。'
                break;
            case 'auth/user-not-found':
                 //default firebase error message: 'There is no user record corresponding to this identifier. The user may have been deleted.'
                outputErrorText = 'メールアドレスまたはパスワードが間違っています'
                break;
            case 'auth/network-request-failed':
                 //default firebase error message: ' A network error (such as timeout, interrupted connection or unreachable host) has occurred.'
                outputErrorText = 'ネットワークエラー：インターネットに接続されていません'
                break;
            case 'authentication mail-did not check':
                outputErrorText = '認証エラー：アカウント作成時に送信された認証メールを確認してくだい';
                break;
            default:
                outputErrorText = errorMessage;
                break;
        }
        setSigninErrorText(outputErrorText);
    }


    ////入力されたのがemailかpasswordかどっちか判別してログイン関数を呼ぶ
    const inputedMail = (textInputed: string) => {
        emailAsRenderedInput(textInputed);
        let inputedPlace: string = 'email';
        doValidate(textInputed, inputedPlace);
    }
    const inputedPassword = (textInputed: string) => {
        passwordAsRenderedInput(textInputed);
        let inputedPlace: string = 'password';
        doValidate(textInputed, inputedPlace);
    }
    
    ////ログイン関数
    const doValidate = (textInputed: string, inputedPlace: string) => {
        console.log("pushed login--------------")
        let email: string = "";
        let password: string = "";

        if (inputedPlace == "email") {
            //メールアドレスの欄ににゅうりょくされた場合
            email = textInputed;
            password = passwordAsRendered;
        } else if (inputedPlace == "password") {
            //パスワードの欄に入力された場合
            email = emailAsRendered;
            password = textInputed;
        }

        let emailPattern = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
        let passwordPattern = new RegExp(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{6,}$/, 'i');

        let approveEmailValidation = emailPattern.test(email);
        let approvePasswordValidation = passwordPattern.test(password);
        let isEmailBlank: boolean = true;
        let isPasswordBlank: boolean = true;
        
        console.log("checkEmail = " + approveEmailValidation);
        console.log("checkPassword = " + approvePasswordValidation);
            
        //////入力欄の値に応じて入力方法のメッセージ(変更内容)を表示する

        ////フォームに値があるかどうかの判別
        if (email == "") {
            isEmailBlank = true;
        } else {
            isEmailBlank = false;
        }

        if (password == "") {
            isPasswordBlank = true;
        } else {
            isPasswordBlank = false;
        }
        
        ////フォーム(validate)の下に表示されるメッセージ
        //メールアドレス
        if (approveEmailValidation) {
            validateTextEmailInput('allow');
            emailErrorIsRedInput(false);
        } else if (!approveEmailValidation) {
            if (isEmailBlank) {
                validateTextEmailInput('blank');
                emailErrorIsRedInput(true);
            } else if (!isEmailBlank) {
                validateTextEmailInput('deny');
                emailErrorIsRedInput(true);
            }
        }
        //パスワード
        if (approvePasswordValidation) {
            validateTextPasswordInput('allow');
            passwordErrorIsRedInput(false);
        } else if (!approvePasswordValidation) {
            if (isPasswordBlank) {
                validateTextPasswordInput('blank');
                passwordErrorIsRedInput(true);
            } else if (!isPasswordBlank) {
                validateTextPasswordInput('deny');
                passwordErrorIsRedInput(true);
            }
        }
        
        //signinボタンを表示するかどうか
        if (approveEmailValidation == true && approvePasswordValidation == true) {
            if (isEmailBlank == false && isPasswordBlank == false) {
                signinButtonDisabledInput(false);
            }
        } else {
            signinButtonDisabledInput(true);
        }
    }

    const pushLogin = () => {
        console.log("testLogin---------------------------------------------")
        
        // //////未入力欄があるかどうかのチェック
        // ///signinボタンの上に表示されるメッセージ
        // let blankErrorCode: string = '';
        // if (emailAsRendered == "") {
        //     blankErrorCode = 'Email is blank';
        //     validateTextEmailInput('fillBlank');
        //     emailErrorIsRedInput(true);
        // } else if (passwordAsRendered == "") {
        //     blankErrorCode = 'Password is blank';
        
        // } else if (emailAsRendered !== "" && passwordAsRendered !== "") {
        //     blankErrorCode = 'None is blank';
        // }
        // signinErrorTextBlankInput(blankErrorCode);


            firebase.auth().signInWithEmailAndPassword(emailAsRendered, passwordAsRendered).catch(function (error) {
                console.log(error.code)
                console.log(error.message)
                return error;
            }).then((result) => {
                console.log("code = " + result.code)
                console.log("message = " + result.message)
                console.log(result)
                
                //fiebaseと通信の上でのsigninエラーを表示する: signinボタンの上に表示
                signinErrorTextInputFirebase(result.code, result.messasge);

                //firebaseに認可されたらログイン処理(ユーザー情報の取得、AsyncStorage)
                if (result.user) {
                    if (result.user.emailVerified == true) {
                        //////メール認証ができている場合
                        console.log("メール認証済");
                        AsyncStorage.setItem('Authenticated', 'true');
                        globalState.login(result.user);
                    }
                    else if (result.user.emailVerified == false) {
                        //////メールを登録したけどメール認証していない場合
                        console.log("メール未認証")
                        let checkingAuthEmailErrorCode: string = 'authentication mail-did not check';
                        let checkingAuthEmailErrorMessage: string = '';
                        //fiebaseと通信の上でのsigninエラーを表示する: signinボタンの上に表示
                        signinErrorTextInputFirebase(checkingAuthEmailErrorCode, checkingAuthEmailErrorMessage);
                    }
                } else {
                    console.log("予期せぬエラーが発生しました");
                }
            })
        }
    
    
    
        
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.logo}>TomoSume</Text>
            </View>
            {/* Emailの入力フォーム */}
            <View style={styles.inputView} >
                <TextInput
                    style={styles.inputText}
                    placeholder="email"
                    placeholderTextColor="#818181"
                    value={emailAsRendered}
                    onChangeText={inputedMail}
                />
            </View>
            <View >
                <Text
                    style={
                        emailErrorIsRed
                            ? styles.inputErrorMessage
                            : styles.inputNotErrorMessage}
                >
                    {validateTextEmail}
                </Text>
            </View>
            {/* Passwordの入力フォーム */}
            <View style={styles.inputView} >
                <TextInput
                    style={styles.inputText}
                    placeholder="password"
                    placeholderTextColor="#818181"
                    value={passwordAsRendered}
                    onChangeText={inputedPassword}
                    autoCapitalize='none'
                />
            </View>
            <View>
                <Text style={ passwordErrorIsRed ?styles.inputErrorMessage :styles.inputNotErrorMessage}>
                    {validateTextPassword}
                </Text>
            </View>
            {/* パスワード忘れたボタン */}
            <TouchableOpacity 
                onPress={() => navigation.navigate('ResetPassword')}
            >
                <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
            {/* ボタンの上のエラーメッセージ */}
            <View>
                <Text style={styles.inputErrorMessage}>
                    {signinErrorText}
                </Text>
            </View>

            {/* <TouchableOpacity
                style={styles.button}
                onPress={login}
                >
                <Text
                    style={styles.buttonText}
                    disabled={false}
                >
                    Sign In
                </Text>
            </TouchableOpacity> */}
            
            
            
                <ButtonElem
                title="testLogin"
                type="solid"
                buttonStyle={styles.button}
                // disabledStyle={styles.disabledButtton}
                titleStyle={styles.buttonText}
                // disabledTitleStyle={styles.}
                
                onPress={pushLogin}
                    // color="#841584"
                    disabled={signinButtonDisabled}
                    accessibilityLabel="Learn more about this purple button"
                    loading={false}
                    />

                {/* アカウント作成画面へ　ボタン */}
            <TouchableOpacity
                onPress={() => navigation.navigate('CreateAccount')}
            >
                <Text> Create Account </Text>
            </TouchableOpacity>
                        
            <TouchableOpacity
                onPress={() => navigation.navigate('ResendEmail')}
            >
                <Text> ResendEmail </Text>
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
    sigininButton: {
        width: "80%",
        // backgroundColor: string;
        // borderRadius: number;
        // height: number;
        // alignItems: "center";
        // justifyContent: "center";
        // marginBottom: number;
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo:{
        fontWeight:"bold",
        fontSize:50,
        color: "black",
        marginTop: "5%",
        marginBottom:"20%",
    },
    inputView:{
        width:"80%",
        borderRadius:25,
        borderColor: 'black',
        borderWidth: 1,
        height: 50,
        justifyContent:"center",
        paddingLeft: '5%',
        paddingRight: 20,
    },
    inputText:{
        height:50,
        color: "black",
    },
    inputErrorMessage:{
        marginBottom: "5%",
        color: "red",
    },
    inputNotErrorMessage:{
        marginBottom: "5%",
        color: "#48D1CC",
    },
    forgot: {
        marginTop: "0%",
        color: '#818181',
        marginBottom: "13%",
    },
    button: {
        width:"80%",
        backgroundColor:"#5E9CFE",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent: "center",
        marginBottom: '10%',
        padding: 0
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    icon: {
        marginRight: 10
    }
});
