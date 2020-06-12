import React, { useState, Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavLogined from '../components/NavLogined';
import NavUnlogin from '../components/NavUnlogin';
import { NavigationContainer } from '@react-navigation/native';
import { Subscribe } from 'unstated'
import GlobalStateContainer from '../containers/GlobalState';
import SplashScreen from '../components/Splash'

const Index = (props) => {
  const [globalState, setGlobalState] = useState(props.globalState);
  const [isSplash, setIisSplash] = useState(props.globalState.state.isSplash);
  const [isSignout, setIsSignout] = useState(props.globalState.state.isSignout);
  const [user, setUser] = useState(props.globalState.state.user);
  const Stack = createStackNavigator();
  
  if (props.globalState.state.isSplash == true || props.globalState.state.isSignout=="") {
    return <SplashScreen />;
  }
      return (
          <NavigationContainer>
            <Stack.Navigator>
              {props.globalState.state.isSignout == "true" ? (
                // No token found, user isn't signed in
                  <Stack.Screen name="NavUnlogin" component={NavUnlogin} options={{ headerShown: false }} />
              ) : (
                  // User is signed in
                  <Stack.Screen name="NavLogined" component={NavLogined} options={{ headerShown: false }}/>
              )}
            </Stack.Navigator>
          </NavigationContainer>
      )
}


const indexWrapper = () => {
  return (
      <Subscribe to={[GlobalStateContainer]}>
          {
              globalState => <Index globalState={globalState} />
          }
      </Subscribe>
  );
}

export default indexWrapper;

