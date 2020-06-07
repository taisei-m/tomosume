import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, FlatList, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import {db} from '../../firebaseConfig';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';

const ChangeUserName = (props) => {
    const [_userName, setUserName] = useState<string>('')
    useEffect(() => {
        db.collection('userList').doc(props.globalState.state.uid).get()
        .then((doc) => {
            setUserName(doc.data().userName)
        })
    }, [])

    const changeName = () => {
        db.collection('userList').doc(props.globalState.state.uid).update({
            userName: _userName
        })
        props.navigation.navigate('ProfileTop')
    }

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <TextInput
                    defaultValue={_userName}
                    style={styles.textInput}
                    onChangeText={setUserName}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={changeName}>
                    <Text>変更</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const changeUserNameWrapper = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalStateContainer]}>
            {
                globalState => <ChangeUserName globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}

export default changeUserNameWrapper;
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    textInput: {
        borderColor: 'black',
        borderWidth: 1,
        width: '70%',
        borderRadius: 10,
        height: 30,
        padding: 5,
        marginTop: 10
    },
    button: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        marginTop: 10,
        marginLeft: 10
    }
})