import React from 'react';
import LoginScreen from './LoginScreen';
import CreateAccount from './CreateAccount';
import NavLogined from './NavLogined';
import { createStackNavigator } from '@react-navigation/stack';

const TabUnlogin = createStackNavigator();

export default Unlogin = () => {
  return (
    <TabUnlogin.Navigator>
      <TabUnlogin.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
      <TabUnlogin.Screen name="CreateAccount" component={CreateAccount} options={{ headerShown: false }}/>
      <TabUnlogin.Screen name="NavLogined" component={NavLogined} options={{ headerShown: false }} />
    </TabUnlogin.Navigator>
  );
}