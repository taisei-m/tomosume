import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { Text, } from 'react-native-elements'
import firebase from '../../firebaseConfig'
import { getAppLoadingLifecycleEmitter } from 'expo/build/launch/AppLoading';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';
import { resolveModuleName } from 'typescript';
import { useEffect } from 'react';

const Splash = (props) => {
   const [globalState, setGlobalState] = useState(props.globalState);
//    console.log("Splash////////////////////////////////////////")
//    console.log(globalState.state)
        
        //globalStateのisSplashをfalseにする
        const SplashFalse = () => {
            console.log("SplashFalse>>>")
            globalState.setSplashFalse();
        }
    
        //端末のAsyncStorageを見てそのアプリにこれまでログインしたことあるかどうかとログイン状態を見る。
        //ログイン状態やったらユーザー情報firebaseから持ってきてglobalStateに入れる。
        const checkSignout = async() => {
            console.log("checkSignout>>>")

            AsyncStorage.getItem('Authenticated', (err, result) => {
                let asyncAuth;
                 
                if (err) {
                    //////アプリ初回インストール後の起動時
                    // console.log('Authenticated err = ' + err)
                    asyncAuth = "false";
                } else if (result) {
                    //////アプリ初回インストール時の起動以降の起動時
                    console.log('Authenticated result = ' + result)
        
                    if (result == "true") {
                        //////認証済みの場合：storageにtrueがある場合
                        asyncAuth = "false";
                        firebase.auth().onAuthStateChanged(function (user) {
                            if (user) {
                                // User is signed in.
                                globalState.setUserData(user);
                            } else {
                                // No user is signed in.
                                console.log("No user is signed in.");
                            }
                        });
                    } else if (result == "false") {
                        //////未認証の場合：storageにfalseがある場合
                        asyncAuth = "true"
                    } else {
                        console.log("asyncAuthの取得でエラー");
                    }
                }
                globalState.setSignout(asyncAuth);
                return;
            })
        };
    
    useEffect(() => {
        (async () => {
            await checkSignout();//他にも欲しいデータあって通信したかったからpromiseAll使ったりして纏めて
            setTimeout(SplashFalse, 1000);
        })();
    }, [])


    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.newAccountTitle}>Splash</Text>
            </View>
        </View>
    );
}


const SplashWrapper = () => {
  return (
      <Subscribe to={[GlobalStateContainer]}>
          {
              globalState => <Splash globalState={globalState} />
          }
      </Subscribe>
  );
}


export default SplashWrapper;


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
        width:"80%",
        borderRadius:25,
        borderColor: 'black',
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20,
        color: 'black'
    },
    inputText:{
        height:50,
        color:"black",
        borderColor: '#818181',
        borderBottomWidth: 1,
        padding: 5
    },
    forgot: {
        margin: 20,
        color: '#818181',
        marginBottom: 30
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