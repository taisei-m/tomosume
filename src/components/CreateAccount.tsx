import React, { useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput,} from 'react-native';
import { Text,  Input, Icon} from 'react-native-elements'
import firebase from '../../firebaseConfig'
import { getAppLoadingLifecycleEmitter } from 'expo/build/launch/AppLoading';

export default CreateAccount = (props) => {
    const [_navigation, setNavigation] = useState(props.navigation);
    const [_username, setUsername] = useState<string>();
    const [_email, setEmail] = useState<string>();
    const [_password, setPassword] = useState<string>();
    const [_isUnvisiblePassword, setIsUnvisiblePassword] = useState<boolean>(true);
    const [_PaswordIconTypeVisible, setPasswordIconTypeVisible] = useState<string>('ios-eye-off')
    //エラーメッセ―ジ
    const [_usernameErrorMessage, setUsernameErrorMessage] = useState<string>();
    const [_emailErrorMessage, setEmailErrorMessage] = useState<string>();
    const [_passwordErrorMessage, setPasswordErrorMessage] = useState<string>();
    
    // console.log("CreateAccount////////////////////////////////////////")
    
    //input関数
    const usernameInput = (passedUsername: string) => {
        setUsername(passedUsername);
    }
    const emailInput = (passedEmail: string) => {
        setEmail(passedEmail);
    }
    const passwordInput = (passedPassword: string) => {
        setPassword(passedPassword);
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
    
    //アイコンが押されたら、表示/非表示を切り替える
    const _isUnvisiblePasswordInput = () => {
        setIsUnvisiblePassword(!_isUnvisiblePassword);
    }

    //フォームの入力を監視、入力に応じてvalidate関数を呼ぶ
    const inputUsername = (inputedUsername: string) => {
        usernameInput(inputedUsername);
    }
    const inputEmail = (inputedEmail: string) => {
        emailInput(inputedEmail);
    }
    const inutPassword = (inputedPassword: string) => {
        passwordInput(inputedPassword);
    }
    

    const signUp = () => {
        if (email == null || email == "" ){
            alert("emailを入力してください");
        } else if (password == null || email == ""){
            alert("passwordを入力してください");
        } else if (confirmPassword == null || email == ""){
            alert("confirmPasswordを入力してください");
        } else if (password != confirmPassword){
            alert("パスワードが一致していません")
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
                // var errorCode = error.code;
                // var errorMessage = error.message;
                // console.log("errorCode: "+errorCode)
                // console.log("errorMessage: "+errorMessage)
                return error;
            }).then(async(result) => {
                if (result.message) {
                    alert(result.message);
                }　else if (result.user) {
                    let user = firebase.auth().currentUser;
                    let db = firebase.firestore().collection('userList').doc(user.uid)
                    db.set({
                        userName: 'user-name',
                        iconURL: 'test-url',
                        uid: user.uid
                    })
                    db.collection('follower').doc('first').set({})
                    db.collection('followee').doc('first').set({})
                    firebase.auth().languageCode = "ja";
                    // console.log("user = "+ user)
                    user.sendEmailVerification().then(function() {
                        navigation.navigate('ResendEmail');
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
                    name= {_PaswordIconTypeVisible}
                    type='ionicon'
                    color='#517fa4' 
                    onPress={() => {_isUnvisiblePasswordInput()}}
                    />                    
                }
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