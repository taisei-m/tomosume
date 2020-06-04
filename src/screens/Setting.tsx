import * as React from 'react';
import { View, StyleSheet, AsyncStorage, FlatList, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements'
import { Subscribe } from 'unstated';
import firebase from '../../firebaseConfig';
import GlobalStateContainer from '../containers/GlobalState';

const Setting = (props) => {

const Item = (props) => {
    return (
        <View>
            <TouchableOpacity style={{flexDirection: 'row'}} onPress={props.itemMethod}>
                <Icon containerStyle={styles.icon} name={props.iconName} type='font-awesome'/>
                <Text style={styles.itemName}>{props.title}</Text>
            </TouchableOpacity>
        </View>
    )
}

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
const changeUserName = () => {
    console.log('change')
    props.navigation.navigate('changeUserName')
}
const showAppTerm = () => {
    console.log('利用規約見るところ')
}
const itemList = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'ユーザー名変更',
        icon: 'user-o',
        method: changeUserName
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: '利用規約',
        icon: 'book',
        method: showAppTerm
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'ログアウト',
        icon: 'sign-out',
        method: logout
    },
]
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={itemList}
                renderItem={({ item }) => (
                    <Item
                        title={item.title}
                        iconName={item.icon}
                        itemMethod={item.method}
                    />
                )}
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
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
    itemName: {
        fontSize: 25,
        marginHorizontal: 10,
        marginVertical: 6
    },
    icon: {
        marginVertical: 6
    }
})