import React, { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput,} from 'react-native';
import { Text,  Input, Icon, Button as ButtonElem} from 'react-native-elements'
import firebase from '../../firebaseConfig'
import { getAppLoadingLifecycleEmitter } from 'expo/build/launch/AppLoading';
import { Subscribe } from 'unstated';
//@ts-ignore
import GlobalStateContainer from '../containers/GlobalState';


CreateAccount = (props:any) => {
    console.log('ca---------------------------------------------')
    const [_navigation, setNavigation] = useState(props.navigation);
    const [_username, setUsername] = useState<string>('');
    const [_email, setEmail] = useState<string>('');
    const [_password, setPassword] = useState<string>('');
    const [_isUnvisiblePassword, setIsUnvisiblePassword] = useState<boolean>(true);
    const [_passwordIconTypeVisible, setPasswordIconTypeVisible] = useState<string>('ios-eye-off');
    const [_signupButtonDisabled, setSignupButtonDisabled] = useState<boolean>(true);
    const [_signupButtonIsloading, setSignupButtonIsloading] = useState<boolean>(false);
    //エラーメッセ―ジ
    const [_usernameErrorMessage, setUsernameErrorMessage] = useState<string>();
    const [_emailErrorMessage, setEmailErrorMessage] = useState<string>();
    const [_passwordErrorMessage, setPasswordErrorMessage] = useState<string>();
    const [_signupErrorMessage, setSignupErrorMessage] = useState<string>();

    
    // console.log("CreateAccount////////////////////////////////////////")
    
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
    const usernameErrorMessageInput = (passedErrorMessageType: string) => {
        let allowText: string = 'ok ✓';
        let denyText: string = '*有効なメールアドレスを入力してください';
        let blankText: string = '';
        let fillblankText: string = '*メールアドレスは必須です';
        let errorMessage: string = '';
        switch(passedErrorMessageType){
            case 'valid':
                errorMessage = allowText;
                break;
            case 'invalid':
                errorMessage = denyText;
                break;
            case 'blank':
                errorMessage = blankText;
                break;
                case 'fillBlank':
                    errorMessage = fillblankText
        }  
        setUsernameErrorMessage(errorMessage);
    }
    const emailErrorMessageInput = (passedErrorMessageType: string) => {
        let allowText: string = 'ok ✓';
        let denyText: string = '*有効なメールアドレスを入力してください';
        let blankText: string = '';
        let fillblankText: string = '*メールアドレスは必須です';
        let errorMessage: string = '';
        switch(passedErrorMessageType){
            case 'valid':
                errorMessage = allowText;
                break;
            case 'invalid':
                errorMessage = denyText;
                break;
            case 'blank':
                errorMessage = blankText;
                break;
            case 'fillBlank':
                errorMessage = fillblankText
        }  
        setEmailErrorMessage(errorMessage);
    }
    const passwordErrorMessageInput = (passedErrorMessageType: string) => {
        let allowText: string = 'ok ✓';
        let denyText: string = '*半角英数字を含む6文字以上にしてください';
        let blankText: string = '';
        let fillblankText: string = '*パスワードは必須です'
        let errorMessage: string = '';
        switch (passedErrorMessageType) {
            case 'valid':
                errorMessage = allowText;
                break;
            case 'invalid':
                errorMessage = denyText;
                break;
            case 'blank':
                errorMessage = blankText;
                break;
            case 'fillBlank':
                errorMessage = fillblankText;
        }
        setPasswordErrorMessage(errorMessage);
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
        let emailPattern = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
        let passwordPattern = new RegExp(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{6,}$/, 'i');
        let isUsernameValid: boolean = emailPattern.test(username);
        let isEmailValid: boolean = emailPattern.test(email);
        let isPasswordValid: boolean = passwordPattern.test(password);
        let isUsernameBlank: boolean = true;
        let isEmailBlank: boolean = true;
        let isPasswordBlank: boolean = true;

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

        let signupButtonDisabled: boolean = true;
        if (isUsernameValid && isEmailValid && isPasswordValid) {
            signupButtonDisabled = false;
        } else {
            signupButtonDisabled = true;
        }
        signupButtonDisabledInput(signupButtonDisabled);
    }

    const pushSignup = () => {
        firebase.auth().createUserWithEmailAndPassword(_email, _password).catch(function (error) {
            console.log("errorCode: " + error.code)
            console.log("errorMessage: " + error.message)
            return error;
        })
        console.log('pppppppppp');
            // }).then(async (result) => {
                console.log('thennn')
                // if (result.message) {
                //     // alert(result.message);
                //     console.log('adsfadf')
                // } else if (result.user) {
                //     console.log('d')
                //     let user = firebase.auth().currentUser;
                //     let db = firebase.firestore().collection('userList').doc(user.uid)
                //     db.set({
                //         userName: 'user-name',
                //         iconURL: 'test-url',
                //         uid: user.uid
                //     })
                //     db.collection('follower').doc('first').set({})
                //     db.collection('followee').doc('first').set({})
                //     firebase.auth().languageCode = "ja";
                //     // console.log("user = "+ user)
                //     user.sendEmailVerification().then(function() {
                //         _navigation.navigate('ResendEmail');
                //     }).catch(function(error) {
                //         cosole.log("error = " + error);
                //         alert("送信先が存在しません。メールアドレスが正しいかご確認ください。")
                //     });
                // } else{
                //     console.log("予期せぬエラーが発生しました");
                // }
        
    }
    


    return (
        <View style={styles.container}>
        <View>
            <Text style={styles.newAccountTitle}>Create New Account</Text>
        </View>
        <View style={styles.inputView} >
            <Input  
                inputStyle={styles.inputText}
                placeholder="usernme（ex. 奥瀬雄哉）"
                placeholderTextColor="#818181"
                value={_username}
                errorMessage={_usernameErrorMessage}
                onChangeText={inputUsername}                
            />
        </View>
        <View style={styles.inputView} >
            <Input  
                inputStyle={styles.inputText}
                placeholder="email"
                placeholderTextColor="#818181"
                value={_email}
                errorMessage={_emailErrorMessage}
                onChangeText={inputEmail}
            />
        </View>
        <View style={styles.inputView} >
            <Input
                inputStyle={styles.inputText}
                placeholder="password" 
                placeholderTextColor="#818181"
                value={_password}
                secureTextEntry={_isUnvisiblePassword}
                errorMessage= {_passwordErrorMessage}
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
            title="testLogin"
            type="solid"
            buttonStyle={styles.button}
            onPress={pushSignup}
            disabled={_signupButtonDisabled}
            accessibilityLabel="Learn more about this purple button"
            loading={_signupButtonIsloading}
            />
        </View>


        <TouchableOpacity
            onPress={() => props.navigation.navigate('LoginScreen')}
        >
            <Text> Already have an account </Text>
        </TouchableOpacity>
        </View>
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
});