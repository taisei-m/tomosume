import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavLogined from './NavLogined';
import NavUnlogin from './NavUnlogin';
import { NavigationContainer } from '@react-navigation/native';
import { Subscribe } from 'unstated'
import GlobalStateContainer from '../containers/GlobalState';
import SplashScreen from '../screens/Splash'

const Index = (props) => {
  const [globalState, setGlobalState] = useState(props.globalState);
  const [isSplash, setIisSplash] = useState(props.globalState.state.isSplash);
  const [isSignout, setIsSignout] = useState(props.globalState.state.isSignout);
  const [user, setUser] = useState(props.globalState.state.user);
  const Stack = createStackNavigator();
  if (props.globalState.state.isSplash == true || props.globalState.state.isSignout=="") {
    return <SplashScreen />;
  }
  // if(props.globalState.state.isSplash==false&&props.globalState.state.isSignout!=""){
    // console.log("to Nav");
      return (
          <NavigationContainer>
            <Stack.Navigator>
              {props.globalState.state.isSignout == "true" ? (
                  <Stack.Screen name="NavUnlogin" component={NavUnlogin} options={{ headerShown: false }} />
              ) : (
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

