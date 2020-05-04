import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../screens/Profile';
import followTabList from '../screens/followTabList';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavDrawerMenu from './NavDrawerMenu'
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';



const ProfileNavStack = createStackNavigator();

const ProfileStack = (props) => {
    var navigation = props.navigation
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', e => {
            // e.preventDefault();
            props.navigation.navigate('Profile')
        });
        return unsubscribe;
      }, [navigation]);
        

    return (
        <ProfileNavStack.Navigator>
        <ProfileNavStack.Screen 
                name="ProfileTop"
                component={Profile}
                options={{
                    headerShown: true,
                    headerLeft: () => (
                        <Ionicons
                            name={'md-menu'}
                            size={30}
                            style={{ marginLeft: 10 }}
                            // color={color}
                            onPress={() => {
                                props.navigation.navigate('idealDrawer')
                            }}
                        />
                    )
                }}
        />
        <ProfileNavStack.Screen
            name="followTabList"
            component={followTabList}
            options={{ headerShown: false }}
        />
        <ProfileNavStack.Screen
            name="idealDrawer"
            component={NavDrawerMenu}
            options={{ headerShown: true }}
        />
    </ProfileNavStack.Navigator>
    )
};

const ProfileStackWrapper = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalStateContainer]}>
            {
                globalState => <ProfileStack globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}
  
export default ProfileStackWrapper;
