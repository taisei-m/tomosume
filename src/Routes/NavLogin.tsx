import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {PostScreenWrapper} from '../screens/PostScreen/PostScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {ProfileStack} from './ProfileStack';
import {TopStack} from './topStack'
import {SearchStack} from './SearchStack'
import {NavLoginParamList} from '../types/types'

const ButtonTab = createBottomTabNavigator<NavLoginParamList>();

export const NavLogin:React.FC = () => {
  return (
    <ButtonTab.Navigator
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
      activeTintColor: '#fbd01d',
      inactiveTintColor: 'gray',
    }}
    >
      <ButtonTab.Screen name="Top" component={TopStack} options={{title: 'トップ'}}/>
      <ButtonTab.Screen name="Search" component={SearchStack} options={{title: '検索'}}/>
      <ButtonTab.Screen name="Post" component={PostScreenWrapper} options={{title: '投稿'}}/>
      <ButtonTab.Screen name="Profile" component={ProfileStack} options={{title: 'プロフィール'}}/>
    </ButtonTab.Navigator>
  );
}