import React, { Component, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Text, } from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';


const LoginScreen = (props) => {
    console.log("LoginScreen")
    console.log(props);
    const [navigation, setNavigation] = useState(props.navigation);
    const [globalState, setGlobalState] = useState(props.globalState);

    login = () => {        
        console.log("method login")
        globalState.login();
    }
        
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.logo}>TomoSume</Text>
            </View>
            <View style={styles.inputView} >
                <TextInput
                    style={styles.inputText}
                    placeholder="userID"
                    placeholderTextColor="#003f5c"
                />
            </View>
            <View style={styles.inputView} >
                <TextInput
                    style={styles.inputText}
                    placeholder="password"
                    placeholderTextColor="#003f5c"
                />
            </View>
            <TouchableOpacity>
                <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={this.login}
            >
                <Text style={styles.buttonText}> Sign In </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('CreateAccount')}
            >
                <Text> Create Account </Text>
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
        color:"white"
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
