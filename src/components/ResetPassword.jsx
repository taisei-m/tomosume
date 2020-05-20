import React, { Component, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { Text, } from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';
import firebase from '../../firebase'

const ResetPassword = (props) => {
    const [navigation, setNavigation] = useState(props.navigation);
    const [globalState, setGlobalState] = useState(props.globalState);
    const [email, setEmail] = useState();
    const [password, setPass] = useState();
    console.log("ResetPassword/////////////////////////////////////")
    // console.log(globalState.state);

    

    const emailInput = (text) => {
        setEmail(text)
    }
   
    const resetPassword = () => {
        console.log("pushed resetPassword")
        console.log(email)
        if(email == "" || email == null ){
            alert("emailを入力してください");
        }   
        else{
            var auth = firebase.auth();
            firebase.auth().languageCode = 'ja';
            auth.sendPasswordResetEmail(email).then(function() {
            // Email sent.
               alert("再設定メールを送信しました。");
               props.navigation.navigate('LoginScreen');
            }).catch(function(error) {
            // An error happened.
               console.log(error);
               console.log(error.message);
               alert(error.message);
            });
        }
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
                    value={email}
                    onChangeText={emailInput}
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={resetPassword}
            >
                <Text style={styles.buttonText}> submit </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('LoginScreen')}
            >
                <Text>  Already have an account  </Text>
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
