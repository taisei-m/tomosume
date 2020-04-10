import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './components/Home'
import DetailsScreen from './components/Login'

const RootStack = createSwitchNavigator(
  {
    Home: { 
      screen: HomeScreen,
    },
    Details: { 
      screen: DetailsScreen
    },
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}