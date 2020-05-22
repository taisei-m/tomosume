import * as React from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import { Subscribe } from 'unstated';
import { Button } from 'react-native-elements';

//@ts-ignore
import firebase from '../../firebase';
import GlobalStateContainer from '../containers/GlobalState';


const Setting = (props) => {

const logout = () => {  
    firebase.auth().signOut().then(function() {
        console.log("Sign-out successful and call global.logout")
        AsyncStorage.setItem('Authenticated', 'false', () => {
        props.globalState.logout();
    });
    })
    .catch(function(error) {
        console.log(error); 
    }); 
    alert('logout')
} 
    return (
        <View style={styles.container}>
            <View style={{marginTop: 50}}>
                <Button
                    buttonStyle={{borderRadius: 25, height: 50, width: 300 }}
                    title={'ログアウト'}
                    type={props.buttonType}
                    onPress={logout}
                />
            </View>
        </View>
    );
}

const SettingWrapper = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalStateContainer]}>
            {
                globalState => <Setting globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}

export default SettingWrapper;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center'
    },
})