import React, { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity,Linking } from 'react-native';
import { Text,  Input, Icon, Button as ButtonElem} from 'react-native-elements'
import firebase from '../../firebaseConfig'
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const CreateAccount = (props: any) => {
    const [_globalState, setGlobalState] = useState(props.globalState)
    const [_navigation, setNavigation] = useState(props.navigation);
    const [_username, setUsername] = useState<string>('');
    const [_email, setEmail] = useState<string>('');
    const [_password, setPassword] = useState<string>('');
    const [_isUnvisiblePassword, setIsUnvisiblePassword] = useState<boolean>(true);
    const [_passwordIconTypeVisible, setPasswordIconTypeVisible] = useState<string>('ios-eye-off');
    const [_signupButtonDisabled, setSignupButtonDisabled] = useState<boolean>(true);
    const [_signupButtonIsloading, setSignupButtonIsloading] = useState<boolean>(false);
    const [_signupButtonDisabledInitialState, setSignupButtonDisabledInitialState] = useState<boolean>(true);
    //エラーメッセ―ジ
    const [_usernameErrorMessage, setUsernameErrorMessage] = useState<string>();
    const [_emailErrorMessage, setEmailErrorMessage] = useState<string>();
    const [_passwordErrorMessage, setPasswordErrorMessage] = useState<string>();
    const [_usernameErrorMessageIsRed, setUsernameErrorMessageIsRed] = useState<boolean>();
    const [_emailErrorMessageIsRed, setEmailErrorMessageIsRed] = useState<boolean>();
    const [_passwordErrorMessageIsRed, setPasswordErrorMessageIsRed] = useState<boolean>();
    const [_signupErrorMessage, setSignupErrorMessage] = useState<string>();
    const [_defaultIconUrl, setDefaultIconUrl] = useState<string>('');

    // firebase storageから画像のurlを取得する処理
    useEffect(() => {
        (async() => {
            const storageRef = firebase.storage().ref('user/icon/' + 'test-image');
            const url = await storageRef.getDownloadURL()
            setDefaultIconUrl(url)
        })()
    }, [])

    ////input関数
    const usernameInput = (passedUsername: string) => {
        setUsername(passedUsername);
    }
    const emailInput = (passedEmail: string) => {
        setEmail(passedEmail);
    }
    const passwordInput = (passedPassword: string) => {
        setPassword(passedPassword);
    }
    const signupButtonDisabledInput = (result: boolean) => {
        setSignupButtonDisabled(result);
    }
    //アイコンが押されたら、パスワードの表示 / 非表示を切り替える
    const isUnvisiblePasswordInput = () => {
        setIsUnvisiblePassword(!_isUnvisiblePassword);
    }
    const signupButtonIsloadingInput = (passed: boolean) => {
        setSignupButtonIsloading(passed);
    }
    const signupButtonDisabledInitialStateInput = (result: boolean) => {
        setSignupButtonDisabledInitialState(result);
    }

    const usernameErrorMessageInput = (passedErrorMessageType: string) => {
        let allowText: string = 'ok ✓';
        let denyText: string = '*13文字以内で入力してください';
        let blankText: string = '';
        let fillblankText: string = '*ユーザーネームは必須です';
        let errorMessage: string = '';
        let errorMessageColorIsRed: boolean = true;
        switch(passedErrorMessageType){
            case 'valid':
                errorMessage = allowText;
                errorMessageColorIsRed= false;
                break;
            case 'invalid':
                errorMessage = denyText;
                errorMessageColorIsRed= true;
                break;
            case 'blank':
                errorMessage = blankText;
                errorMessageColorIsRed= true;
                break;
            case 'fillBlank':
                errorMessage = fillblankText
                break;
        }
        setUsernameErrorMessage(errorMessage);
        setUsernameErrorMessageIsRed(errorMessageColorIsRed)
    }
    const emailErrorMessageInput = (passedErrorMessageType: string) => {
        let allowText: string = 'ok ✓';
        let denyText: string = '*メールアドレスの形式が正しくありません';
        let blankText: string = '';
        let fillblankText: string = '*メールアドレスは必須です';
        let errorMessage: string = '';
        let errorMessageColorIsRed: boolean = true;
        switch(passedErrorMessageType){
            case 'valid':
                errorMessage = allowText;
                errorMessageColorIsRed= false;
                break;
            case 'invalid':
                errorMessage = denyText;
                errorMessageColorIsRed= true;
                break;
            case 'blank':
                errorMessage = blankText;
                errorMessageColorIsRed= true;
                break;
            case 'fillBlank':
                errorMessage = fillblankText
                break;
        }
        setEmailErrorMessage(errorMessage);
        setEmailErrorMessageIsRed(errorMessageColorIsRed)
    }
    const passwordErrorMessageInput = (passedErrorMessageType: string) => {
        let allowText: string = 'ok ✓';
        let denyText: string = '*半角英数字を含む6文字以上にしてください';
        let blankText: string = '';
        let fillblankText: string = '*パスワードは必須です'
        let errorMessage: string = '';
        let errorMessageColorIsRed: boolean = true;
        switch (passedErrorMessageType) {
            case 'valid':
                errorMessage = allowText;
                errorMessageColorIsRed= false;
                break;
            case 'invalid':
                errorMessage = denyText;
                errorMessageColorIsRed= true;
                break;
            case 'blank':
                errorMessage = blankText;
                errorMessageColorIsRed= true;
                break;
            case 'fillBlank':
                errorMessage = fillblankText;
                break;
        }
        setPasswordErrorMessage(errorMessage);
        setPasswordErrorMessageIsRed(errorMessageColorIsRed);
    }
    
    //Signupボタンを押した時に表示されるエラーメッセージの内容
    const signupErrorTextInput = (errorCode: string, errorMessage: string) => {
        let outputErrorText: string = '';
        switch (errorCode) {
            case 'auth/email-already-in-use':
                //Thrown if there already exists an account with the given email address.
                outputErrorText = 'このメールアドレスは既に使用されています';
                break;
            case 'auth/invalid-email':
                //Thrown if the email address is not valid.
                outputErrorText = '有効なメールアドレスを入力してください';
                break;
            case 'auth/operation-not-allowed':
                //Thrown if email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.
                outputErrorText = 'メールアドレスとパスワードによるログインが無効になっています';
                break;
            case 'auth/weak-password':
                //Thrown if the password is not strong enough.
                outputErrorText = '脆弱性が高いためパスワードを再度設定してください';
                break;
            case 'auth/network-request-failed':
                //default firebase error message: ' A network error (such as timeout, interrupted connection or unreachable host) has occurred.'
                outputErrorText = 'ネットワークエラー：インターネットに接続されていません';
                break;
            case 'refresh':
                outputErrorText = '';
                break;
            default:
                outputErrorText = errorMessage;
                break;
        }
        setSignupErrorMessage(outputErrorText);
    }


    //パスワードの表示/非表示に合わせてアイコンの切り替え
    useEffect(
        () => {
            let visibleIconName: string = 'ios-eye';
            let unVisibleIconName: string = 'ios-eye-off';
            let unVisible: boolean = _isUnvisiblePassword;
            let iconName: string;
            if (unVisible) {
                iconName = unVisibleIconName;
            } else {
                iconName = visibleIconName;
            }
            setPasswordIconTypeVisible(iconName);
        }
    ,[_isUnvisiblePassword])

    //フォームの入力を監視、入力に応じてvalidate関数を呼ぶ
    const inputUsername = (inputedUsername: string) => {
        usernameInput(inputedUsername);
        autoValidation(inputedUsername,'username');
    }
    const inputEmail = (inputedEmail: string) => {
        emailInput(inputedEmail);
        autoValidation(inputedEmail, 'email');
    }
    const inutPassword = (inputedPassword: string) => {
        passwordInput(inputedPassword);
        autoValidation(inputedPassword, 'password');
    }

    const autoValidation = (inputedText: string, inputedForm: string) => {
        //signinボタンの上のエラーメッセージを非表示にする
        signupErrorTextInput('refresh', '');

        let username: string = '';
        let email: string = '';
        let password: string = '';

        if (inputedForm == 'username') {
            username = inputedText;
            email = _email;
            password = _password;
        } else if (inputedForm == 'email') {
            username = _username;
            email = inputedText;
            password = _password;
        } else if (inputedForm == 'password') {
            username = _username;
            email = _email;
            password = inputedText;
        }
        //validation
        ////※名詞＋形容詞の場合。名詞のこぶが一つなら前置修飾、二つ以上なら後置修飾or後置で統一？
        let usernamePattern = (username: string):boolean => {
            if (username.length == 0) {
                return false;
            } else if (username.length > 13) {
                return false;
            } else {
                return true;
            }
        }
        let emailPattern = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
        let passwordPattern = new RegExp(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{6,}$/, 'i');
        let isUsernameValid: boolean = usernamePattern(username);
        let isEmailValid: boolean = emailPattern.test(email);
        let isPasswordValid: boolean = passwordPattern.test(password);
        let isUsernameBlank: boolean = true;
        let isEmailBlank: boolean = true;
        let isPasswordBlank: boolean = true;

        //各入力欄が未入力かどうか確かめる
        if (username == '') {
            isUsernameBlank = true;
        } else {
            isUsernameBlank = false;
        }
        if (email == '') {
            isEmailBlank = true;
        } else {
            isEmailBlank = false;
        }
        if (password == '') {
            isPasswordBlank = true;
        } else {
            isPasswordBlank = false;
        }

        //各入力欄のエラーの内容と色を切り替え
        let usernameValidationErrorMessageType: string = '';
        if (isUsernameValid) {
            usernameValidationErrorMessageType = 'valid';
        } else if (!isUsernameValid) {
            if (isUsernameBlank) {
                usernameValidationErrorMessageType = 'blank';
            } else {
                usernameValidationErrorMessageType = 'invalid';
            }
        }
        usernameErrorMessageInput(usernameValidationErrorMessageType);

        let emailValidationErrorMessageType: string = '';
        if (isEmailValid){
            emailValidationErrorMessageType = 'valid';
        } else if (!isEmailValid) {
            if (isEmailBlank) {
                emailValidationErrorMessageType = 'blank';
            } else if (!isEmailBlank) {
                emailValidationErrorMessageType = 'invalid';
            }
        }
        emailErrorMessageInput(emailValidationErrorMessageType);

        let passwordValidationErrorMessageType: string = '';
        if (isPasswordValid) {
            passwordValidationErrorMessageType = 'valid';
        } else if (!isPasswordValid) {
            if (isPasswordBlank) {
                passwordValidationErrorMessageType = 'blank';
            } else if (!isPasswordBlank) {
                passwordValidationErrorMessageType = 'invalid';
            }
        }
        passwordErrorMessageInput(passwordValidationErrorMessageType);

        //signupボタンの表示/非表示の切り替え
        let signupButtonDisabled: boolean = true;
        if (isUsernameValid && isEmailValid && isPasswordValid) {
            signupButtonDisabled = false;
        } else {
            signupButtonDisabled = true;
        }
        signupButtonDisabledInput(signupButtonDisabled);
    }

    const pushSignup = () => {
        signupButtonIsloadingInput(true);
        signupButtonDisabledInitialStateInput(false);
        signupButtonDisabledInput(true);

        firebase.auth().createUserWithEmailAndPassword(_email, _password).catch(function (error) {
            console.log("errorCode: " + error.code)
            console.log("errorMessage: " + error.message)
            return error;
        }).then(async (result) => {
            //fiebaseと通信の上でのsigninエラーを表示する: signinボタンの上に表示
            signupErrorTextInput(result.code, result.messasge);

            if (result.user) {
                let user = result.user;
                _globalState.setCreateAccountEmail(user.email);

                let db = firebase.firestore().collection('userList').doc(user.uid)
                db.set({
                    userName: _username,
                    iconURL: _defaultIconUrl,
                    uid: user.uid
                })
                db.collection('follower').doc('first').set({})
                db.collection('followee').doc('first').set({})
                firebase.auth().languageCode = "ja";
                let sentEmail: boolean | undefined
                //なんでかわからんけどsendEmailVerificationメソッドこのファイルやとエラーでやんけどresendEmailで使うと[Error: We have blocked all requests from this device due to unusual activity. Try again later.]のエラーcatchする。
                await user.sendEmailVerification().then(function () {
                    //※errorがある場合でもthenの中身も実行される?
                    sentEmail = true;
                })
                .catch(function() {
                    sentEmail = false;
                });
                if (sentEmail == true) {
                    _navigation.navigate('ResendEmail');
                }
            } else {
                console.log("予期せぬエラーが発生しました CreateAccount.tsx");
            }
            signupButtonIsloadingInput(false);
            signupButtonDisabledInitialStateInput(true);
            signupButtonDisabledInput(false);
        })
    }

    return (
        <KeyboardAwareScrollView style={styles.keyboardScrollView}>
        <View style={styles.container}>
        {/* <View>

            <Text style={styles.logo}>アカウント新規作成</Text>

        </View> */}
        <View style={styles.inputView} >
            <Input
                inputStyle={styles.inputText}
                placeholder="ユーザー名（アプリ内で変更可能）"
                placeholderTextColor="#818181"
                value={_username}
                errorMessage={_usernameErrorMessage}
                errorStyle={_usernameErrorMessageIsRed ?styles.redInputErrorMessage :styles.greenInputErrorMessage}
                onChangeText={inputUsername}
            />
        </View>
        <View style={styles.inputView} >
            <Input
                inputStyle={styles.inputText}
                placeholder="メールアドレス"
                placeholderTextColor="#818181"
                value={_email}
                errorMessage={_emailErrorMessage}
                errorStyle={_emailErrorMessageIsRed ?styles.redInputErrorMessage :styles.greenInputErrorMessage}
                onChangeText={inputEmail}
            />
        </View>
        <View style={styles.inputView} >
            <Input
                inputStyle={styles.inputText}
                placeholder="パスワード(半角英数字６文字以上)"
                placeholderTextColor="#818181"
                value={_password}
                secureTextEntry={_isUnvisiblePassword}
                errorMessage={_passwordErrorMessage}
                errorStyle={_passwordErrorMessageIsRed ?styles.redInputErrorMessage :styles.greenInputErrorMessage}
                onChangeText={inutPassword}
                rightIcon={
                    <Icon
                    name= {_passwordIconTypeVisible}
                    type='ionicon'
                    color='#517fa4' 
                    onPress={() => {isUnvisiblePasswordInput()}}
                    />                    
                }
            />
        </View>
       {/* ボタンの上のエラーメッセージ */}
        <View>
            <Text style={styles.aboveButtonMessage}>
                {_signupErrorMessage}
            </Text>
        </View>
        <View
            style={{width: '80%'}}
        >
            <ButtonElem
            title="新規登録"
            type="solid"
            buttonStyle={styles.button}
            onPress={pushSignup}
                        disabled={_signupButtonDisabled}
                        disabledStyle={_signupButtonDisabledInitialState
                            ? null
                            : {
                                backgroundColor: '5E9CFE'
                            }
                        }
            accessibilityLabel="Learn more about this purple button"
            loading={_signupButtonIsloading}
            />
        </View>


        <TouchableOpacity
            onPress={() => props.navigation.navigate('LoginScreen')}
        >
            <Text style={styles.AlreadyHaveAccountText}> 既にアカウントをお持ちの方はこちら </Text>
        </TouchableOpacity>
        <View style={{marginLeft:40, marginRight: 30, marginTop: 80}}>
                    <Text>登録することで、
                    <Text style={{color: 'blue', textDecorationLine: 'underline'}}
                            onPress={() => Linking.openURL('https://tomosume.flycricket.io/privacy.html')}>
                    プライバシーポリシー
                    </Text>
                    に同意したことになります。</Text>
        </View>

        </View>
        </KeyboardAwareScrollView>
    );
}

const CreateAccountWrapper = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalStateContainer]}>
            {
                globalState => <CreateAccount globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}

export default CreateAccountWrapper;


const styles = StyleSheet.create({
    keyboardScrollView: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: '30%'
    },
    logo: {
        fontWeight:"bold",
        fontSize:30,
        color:"black",
        marginTop: "20%",
        marginBottom: "10%"
    },
    inputView:{
        width:"85%",
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20,
    },
    inputText:{
        height:50,
        color:"black",
        paddingLeft: 5,
        paddingRight: 0,
        fontSize: 14,
    },
    redInputErrorMessage: {
        color: 'red',
    },
    greenInputErrorMessage: {
        color: '#48D1CC',
    },
    aboveButtonMessage: {
		marginTop: '2%',
		marginBottom: '4%',
		color: 'red',
	 },
    button: {
        backgroundColor:"#5E9CFE",
        borderRadius: 25,
        borderColor: 'black',
        height: 50,
    },
    icon: {
        marginRight: 10
    },
    AlreadyHaveAccountText: {
        textDecorationLine: 'underline',
        marginTop: '5%',
    }
});