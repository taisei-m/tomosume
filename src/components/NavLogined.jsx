import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Post from '../screens/Post';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileStack from '../Routes/ProfileStack';
import topStack from '../Routes/topStack'
import SearchStack from '../Routes/SearchStack'

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
            ? 'md-home'
            : 'md-home';
        } else if (route.name === 'Post') {
          iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
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
      <Tab1.Screen name="Top" component={topStack} options={{title: 'トップ'}}/>
      <Tab1.Screen name="Search" component={SearchStack} options={{title: '検索'}}/>
      <Tab1.Screen name="Post" component={Post} options={{title: '投稿'}}/>
      <Tab1.Screen name="Profile" component={ProfileStack} options={{title: 'プロフィール'}}/>
    </Tab1.Navigator>
  );
}
