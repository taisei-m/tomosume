import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Top from '../screens/Top';
import Search from './Search';
import Post from '../screens/Post';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileStack from '../Routes/ProfileStack';

const Tab1 = createBottomTabNavigator();

export default Tab = () => {
  return (
    <Tab1.Navigator
    initialRouteName = "Top"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Top') {
          iconName = focused
            ? 'ios-information-circle'
            : 'ios-information-circle-outline';
        } else if (route.name === 'Post') {
          iconName = focused ? 'ios-list-box' : 'ios-list';
        } else if (route.name === 'Search') {
          iconName = focused ? 'ios-search' : 'ios-search'
        } else if (route.name === 'Profile') {
          iconName = focused ? 'ios-contact' : 'ios-contact'
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: '#5E9CFE',
      inactiveTintColor: 'gray',
    }}
    >
      <Tab1.Screen name="Top" component={Top} />
      <Tab1.Screen name="Search" component={Search} />
      <Tab1.Screen name="Post" component={Post} />
      <Tab1.Screen name="Profile" component={ProfileStack} />
    </Tab1.Navigator>
  );
}
