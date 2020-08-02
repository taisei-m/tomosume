import React from 'react';
import SelectLoginOrSignup from '../screens/selectLoginOrSignup';
import LoginScreen from '../screens/LoginScreen';
import CreateAccount from '../screens/CreateAccount';
import ResetPassword from '../screens/ResetPassword';
import afterResetEmail from '../screens/afterResetPassword';
import ResendEmail from '../screens/ResendEmail';
import {NavLogin} from './NavLogin';
import { createStackNavigator } from '@react-navigation/stack';
import {NavUnloginParamList} from '../types/types'

const TabUnlogin = createStackNavigator<NavUnloginParamList>()

export const NavUnlogin: React.FC = () => {
  return (
    <TabUnlogin.Navigator
    initialRouteName = "SelectLoginOrSignup"
    >
      <TabUnlogin.Screen name="SelectLoginOrSignup" component={SelectLoginOrSignup} options={{ headerShown: false }}/>
      <TabUnlogin.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
      <TabUnlogin.Screen name="CreateAccount" component={CreateAccount} options={{ headerShown: false }}/>
      <TabUnlogin.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
      <TabUnlogin.Screen name="afterResetEmail" component={afterResetEmail} options={{ headerShown: false }} />
      <TabUnlogin.Screen name="ResendEmail" component={ResendEmail} options={{ headerShown: false }} />
      <TabUnlogin.Screen name="NavLogin" component={NavLogin} options={{ headerShown: false }} />
    </TabUnlogin.Navigator>
  );
}