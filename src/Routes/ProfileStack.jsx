import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../screens/Profile';
import followTabList from '../screens/followTabList';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavDrawer from '../Routes/NavDrawer'
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';



const ProfileNavStack = createStackNavigator();

const ProfileStack = (props) => {
    return (
    <ProfileNavStack.Navigator>
        <ProfileNavStack.Screen 
                name="Profile"
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
                                console.log("sss");
                                props.navigation.navigate('drawer')
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
            name="drawer"
            component={NavDrawer}
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
