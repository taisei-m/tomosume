import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../screens/Profile';
import followTabList from '../screens/followTabList';

const ProfileNav = createStackNavigator();

export default ProfileStack = () => {
    return (
    <ProfileNav.Navigator>
        <ProfileNav.Screen 
            name="Profile" 
            component={Profile} 
            options={{ headerShown: false }}
            />
        <ProfileNav.Screen
            name="followTabList"
            component={followTabList}
            options={{ headerShown: false }}
        />
    </ProfileNav.Navigator>
    )
};
