import React, { Component, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { Text, Button as ButtonElem} from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';
import firebase from '../../firebaseConfig'

const ResetPassword = (props) => {
    const [navigation, setNavigation] = useState(props.navigation);
    const [_email, setEmail] = useState<string>('');
    const [_setErrorMessageAboveSubmitButton, setErrorMessageAboveSubmitButton] = useState<string>('');
    const [_submitButtonIsloading, setSubmitButtonIsloading] = useState<boolean>(false);

    const emailInput = (passedEmail: string) => {
        let errorCode = 'refresh';
        let errorMessage = '';
        setEmail(passedEmail);
        errorMessageAboveSubmitButtonInput(errorCode, errorMessage);
    }
    const submitButtonIsloadingInput = (result: boolean) => {
        setSubmitButtonIsloading(result);
    }
    //Signupボタンを押した時に表示されるエラーメッセージの内容
    const errorMessageAboveSubmitButtonInput = (errorCode: string, errorMessage: string) => {
        let outputErrorText: string = '';
        switch (errorCode) {
            case 'email is blank':
                outputErrorText = 'メールアドレスが未入力です';
                break;
            case 'email did not match regular expression':
                outputErrorText = 'メールアドレスの形式が正しくありません';
                break;
            case 'auth/invalid-email':
                //Thrown if the email address is not valid.
                outputErrorText = '有効なメールアドレスを入力してください';
                break;
            case 'auth/missing-android-pkg-name':
                //An Android package name must be provided if the Android app is required to be installed.
                outputErrorText = 'An Android package name must be provided if the Android app is required to be installed';
                break;
            case 'auth/missing-continue-uri':
                //An Android package name must be provided if the Android app is required to be installed.
                outputErrorText = 'An Android package name must be provided if the Android app is required to be installed';
                break;
            case 'auth/missing-ios-bundle-id':
                //A continue URL must be provided in the request.
                outputErrorText = 'A continue URL must be provided in the request';
                break;
            case 'auth/invalid-continue-uri':
                //An iOS Bundle ID must be provided if an App Store ID is provided.
                outputErrorText = 'An iOS Bundle ID must be provided if an App Store ID is provided';
                break;
            case 'auth/unauthorized-continue-uri':
                //The continue URL provided in the request is invalid.
                outputErrorText = 'The continue URL provided in the request is invalid';
                break;
            case 'auth/user-not-found':
                //The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase console.
                outputErrorText = 'メールアドレスまたはパスワードが間違っています';
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
        setErrorMessageAboveSubmitButton(outputErrorText);
    }
    const resetPassword = () => {
        submitButtonIsloadingInput(true);
        console.log("pushed resetPassword")
        let email: string = _email;
        let errorCode: string = '';
        let errorMessage: string = '';
        let emailPattern = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
        let approveEmailValidation = emailPattern.test(email);
        if (email == '') {
            errorCode = 'email is blank';
            errorMessage = '';
            errorMessageAboveSubmitButtonInput(errorCode, errorMessage);
        } else if (!approveEmailValidation) {
            // errorMessage = '有効なメールアドレスを入力してください';
            errorCode = 'email did not match regular expression'
            errorMessage = '';
            errorMessageAboveSubmitButtonInput(errorCode, errorMessage);
        } else{
            let user = firebase.auth();
            firebase.auth().languageCode = 'ja';
            user.sendPasswordResetEmail(email).then(function() {
            // Email sent.
               alert("パスワード再設定メールを送信しました。");
               props.navigation.navigate('LoginScreen');
            }).catch(function(error) {
            // An error happened.
                errorCode = error.code;
                errorMessage = error.message;
                errorMessageAboveSubmitButtonInput(errorCode, errorMessage);
            });
        }
        submitButtonIsloadingInput(false);
    }
        
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.logo}>Reset Password</Text>
            </View>
            <View style={styles.inputView} >
                <TextInput
                    style={styles.inputText}
                    placeholder="email"
                    placeholderTextColor="#818181"
                    value={_email}
                    onChangeText={emailInput}
                />
            </View>
            <View>
                <Text style={styles.aboveButtonMessage}>
                    {_setErrorMessageAboveSubmitButton}
                </Text>
            </View>
            <View
                style={{width: '80%'}}
            >
                <ButtonElem
                title="submit"
                type="solid"
                buttonStyle={styles.button}
                onPress={resetPassword}
                loading={_submitButtonIsloading}
                    />
            </View>

            <TouchableOpacity
                onPress={() => { navigation.navigate('LoginScreen') }}
            >
                <Text style={styles.AlreadyHaveAnAccountText}>  Already have an account  </Text>
            </TouchableOpacity>



        </View>
    );
}

const ResetPasswordWrapper = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalStateContainer]}>
            {
                globalState => <ResetPassword globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}

export default ResetPasswordWrapper;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo:{
        fontWeight:"bold",
        fontSize:40,
        color:"black",
        marginBottom:40
    },
    inputView:{
        width:"80%",
        borderRadius:25,
        borderColor: 'black',
        borderWidth: 1,
        height:50,
        marginBottom:0,
        justifyContent: "center",
        paddingLeft: '5%',
        paddingRight: '5%',
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
    aboveButtonMessage: {
        marginRight: '5%',
        marginLeft: '5%',
		marginTop: '3%',
		marginBottom: '2%',
		color: 'red',
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
    icon: {
        marginRight: 10
    },
    AlreadyHaveAnAccountText: {
        color: 'black',
        textDecorationLine: 'underline',
        marginTop: '5%',
    }
});
