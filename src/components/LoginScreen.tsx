import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, AsyncStorage} from 'react-native';
import { Text, } from 'react-native-elements';
import { Subscribe } from 'unstated';
import firebase from '../../firebase'
//@ts-ignore
import GlobalStateContainer from '../containers/GlobalState';

const LoginScreen = (props: any) => {
    const [navigation, setNavigation] = useState(props.navigation);
    const [globalState, setGlobalState] = useState(props.globalState);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validateTextEmail, setValidateTextEmail] = useState('');
    const [validateTextPassword, setValidateTextPassword] = useState('');
    const [signinErrorText, setSigninErrorText] = useState('');
    const [emailErrorIsRed, setEmailErrorIsRed] = useState(Boolean);
    const [passwordErrorIsRed, setPasswordErrorIsRed] = useState(Boolean);
    // console.log("LoginScreen/////////////////////////////////////")
    // console.log(globalState.state);

    const emailInput = (text) => {
        setEmail(text)
    }
    const passwordInput = (pass) => {
        setPassword(pass)
    }
    const emailErrorIsRedInput = (result: boolean) => {
        setEmailErrorIsRed(result)
    }
    const passwordErrorIsRedInput = (result: boolean) => {
        setPasswordErrorIsRed(result)
    }

    const validateTextEmailInput = (result: boolean, blank: boolean) => {
        let allowText: string = 'ok ✓';
        let denyText: string = '*有効なメールアドレスを入力してください';
        let blankText: string = '*メールアドレスは必須です';
        if (result) {
            setValidateTextEmail(allowText);
        } else {
            if (blank) {
                setValidateTextEmail(blankText);
            } else  {
                setValidateTextEmail(denyText);
            }
        }
    }
    const validateTextPasswordInput = (result: boolean, blank: boolean) => {
        let allowText: string = 'ok ✓';
        let denyText: string = '*半角英数字を含む6文字以上にしてください';
        let blankText: string = '*パスワードは必須です';

        if (result) {
            setValidateTextPassword(allowText);
        } else {
            if (blank) {
                setValidateTextPassword(blankText);
            } else {
                setValidateTextPassword(denyText);
            }
        }
    }
    const signinErrorTextInputBlank = (errorCode: string) => {
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
    
    const login = () => {
        console.log("pushed login--------------")
        
        let emailPattern = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
        let passwordPattern = new RegExp(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{6,}$/, 'i');

        let approveEmailValidation = emailPattern.test(email);
        let approvePasswordValidation = passwordPattern.test(password);
        let isEmailBlank: boolean = true;
        let isPasswordBlank: boolean = true;
        
        console.log("checkEmail = " + approveEmailValidation);
        console.log("checkPassword = " + approvePasswordValidation);
            
        //////入力欄の値に応じて入力方法のメッセージ(変更内容)を表示する
        ////signinボタンの上に表示されるメッセージ
        let blankErrorCode: string = '';
        if (email == "") {
            blankErrorCode = 'Email is blank';
        } else if (password == "") {
            blankErrorCode = 'Password is blank';
        } else if (email !== "" && password !== "") {
            blankErrorCode = 'None is blank';
        }
        signinErrorTextInputBlank(blankErrorCode);
        //フォームに値があるかどうかの判別
        if (email == "") {
            isEmailBlank = true;
        } else {
            isEmailBlank = false;
            emailErrorIsRedInput(false);
        }

        if (password == "") {
            isPasswordBlank = true;
        } else {
            isPasswordBlank = false;
            passwordErrorIsRedInput(false);
        }
        
        
        ////フォーム(validate)の下に表示されるメッセージ
        //メールアドレス
        if (approveEmailValidation == true) {
            validateTextEmailInput(true, isEmailBlank);
            emailErrorIsRedInput(false);
        } else {
            validateTextEmailInput(false, isEmailBlank);
            emailErrorIsRedInput(true);
        }
        //パスワード
        if (approvePasswordValidation == true) {
            validateTextPasswordInput(true, isPasswordBlank);
            passwordErrorIsRedInput(false);
        } else {
            validateTextPasswordInput(false, isPasswordBlank);
            passwordErrorIsRedInput(true);
        }
        
        //正規表現のvalidationも未入力のチェックも通ったらfirebaseにアクセス
        if (approveEmailValidation == true && approvePasswordValidation == true) {
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
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
                        console.log("メール認証済")
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
                    value={email}
                    onChangeText={emailInput}
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
                    value={password}
                    onChangeText={passwordInput}
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

            <TouchableOpacity
                style={styles.button}
                onPress={login}
            >
                <Text style={styles.buttonText}> Sign In </Text>
            </TouchableOpacity>
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
        marginBottom:30
    },
    buttonText: {
        color: 'white'
    },
    icon: {
        marginRight: 10
    }
});
