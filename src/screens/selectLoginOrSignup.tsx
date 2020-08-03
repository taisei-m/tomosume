
import React from 'react';
import { StyleSheet, View, TouchableOpacity,} from 'react-native';
import { Text, Button as ButtonElem} from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../store/GlobalState';
import {StackProps} from '../types/types'

const SelectLoginOrSignup = (props: StackProps) => {
    return(
    <View style={styles.container}>
        <View>
            <Text style={styles.topTitle}>
                Tomosume
            </Text>
        </View>
        <View style={styles.button}>
            <ButtonElem
                title="新しいアカウントを作成"
                    type="solid"
                    buttonStyle={styles.gotoSignupButton}
                onPress={() => props.navigation.navigate('CreateAccount')}
            />
        </View>
        <TouchableOpacity
            onPress={() => props.navigation.navigate('LoginScreen')}
        >
            <Text style={styles.gotoLoginText}>
                ログイン
            </Text>
        </TouchableOpacity>
        </View>
    )  
}

const SelectLoginOrSignupWrapper = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalStateContainer]}>
            {
                globalState => <SelectLoginOrSignup globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}

export default SelectLoginOrSignupWrapper;


const styles = StyleSheet.create({
    keyboardScrollView: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    topTitle:{
        fontWeight:"bold",
        fontSize:50,
        color: "black",
        marginTop: "45%",
        marginBottom:"20%",
    },
    button: {
        width:'80%'
    },
    gotoSignupButton: {
        backgroundColor:"#5E9CFE",
        borderRadius: 25,
        borderColor: 'black',
        height: 50,
    },
    gotoLoginText: {
    // color: '#818181',
        color: 'black',
        textDecorationLine: 'underline',
        marginTop: '10%',
    },
});
