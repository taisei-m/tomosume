import React from 'react';
import SelectLoginOrSignup from '../screens/selectLoginOrSignup';
import LoginScreen from '../screens/LoginScreen';
import CreateAccount from '../screens/CreateAccount';
import ResetPassword from '../screens/ResetPassword';
import afterResetEmail from '../screens/afterResetPassword';
import ResendEmail from '../screens/ResendEmail';
import NavLogined from './NavLogined';
import { createStackNavigator } from '@react-navigation/stack';

const TabUnlogin = createStackNavigator();

export default Unlogin = () => {
  return (
    <TabUnlogin.Navigator initialRouteName="LoginScreen"
    initialRouteName = "SelectLoginOrSignup"
    >
      <TabUnlogin.Screen name="SelectLoginOrSignup" component={SelectLoginOrSignup} options={{ headerShown: false }}/>
      <TabUnlogin.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
      <TabUnlogin.Screen name="CreateAccount" component={CreateAccount} options={{ headerShown: false }}/>
      <TabUnlogin.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
      <TabUnlogin.Screen name="afterResetEmail" component={afterResetEmail} options={{ headerShown: false }} />
      <TabUnlogin.Screen name="ResendEmail" component={ResendEmail} options={{ headerShown: false }} />
      <TabUnlogin.Screen name="NavLogined" component={NavLogined} options={{ headerShown: false }} />
    </TabUnlogin.Navigator>
  );
}