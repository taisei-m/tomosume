import * as React from 'react';
import { Button, View } from 'react-native';
import HomeScreen from '../screens/CreateAccount';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// function HomeScreen() {
//    console.log("yoiyoi")
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Button
//         onPress={() => navigation.navigate('Notifications')}
//         title="Go to notifications"
//       />
//     </View>
//   );
// }

function NotificationsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}


export default function NavDrawer() {
  //  console.log("nanndeyanen")
  const Drawer = createBottomTabNavigator();

  //  console.log("nanndeyanen222")


  return (
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
  );
}