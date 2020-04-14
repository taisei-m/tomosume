import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../components/LoginScreen';
import Tab from '../components/Tab';
import CreateAccount from '../components/CreateAccount';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

export default Router = () => {
  return (
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="creatAccount" component={CreateAccount} options={{ headerShown: false }}/>
        <Stack.Screen name="Tab" component={Tab} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}