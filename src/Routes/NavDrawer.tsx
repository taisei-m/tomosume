import * as React from 'react';
import { Button, View } from 'react-native';
import HomeScreen from '../screens/CreateAccount';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function NotificationsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}


export default function NavDrawer() {
  const Drawer = createBottomTabNavigator();


  return (
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
  );
}