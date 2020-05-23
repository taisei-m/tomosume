import React from 'react';
import LoginScreen from './LoginScreen';
import CreateAccount from './CreateAccount';
import ResetPassword from './ResetPassword';
import ResendEmail from '../screens/ResendEmail';
import NavLogined from './NavLogined';
import { createStackNavigator } from '@react-navigation/stack';

const TabUnlogin = createStackNavigator();

export default Unlogin = () => {
  return (
    <TabUnlogin.Navigator initialRouteName = "LoginScreen">
      <TabUnlogin.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
      <TabUnlogin.Screen name="CreateAccount" component={CreateAccount} options={{ headerShown: false }}/>
      <TabUnlogin.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
      <TabUnlogin.Screen name="ResendEmail" component={ResendEmail} options={{ headerShown: false }} />
      <TabUnlogin.Screen name="NavLogined" component={NavLogined} options={{ headerShown: false }} />
    </TabUnlogin.Navigator>
  );
}