import React, { useState, Component } from 'react';
import { Provider } from 'unstated';
import { createStackNavigator } from '@react-navigation/stack';
import NavLogined from '../components/NavLogined';
import NavUnlogin from '../components/NavUnlogin';
import { NavigationContainer } from '@react-navigation/native';
import { AsyncStorage } from 'react-native';
import { Subscribe } from 'unstated'
import GlobalStateContainer from '../containers/GlobalState';
import SplashScreen from '../components/Splash'
import firebase from '../../firebase'

const Index = (props) => {
  console.log("index//////////////////////////////////////////////////////");
  console.log(props.globalState.state);
  const [globalState, setGlobalState] = useState(props.globalState);
  const [isSplash, setIisSplash] = useState(props.globalState.state.isSplash);
  const [isSignout, setIsSignout] = useState(props.globalState.state.isSignout);
  const [user, setUser] = useState(props.globalState.state.user);
  const Stack = createStackNavigator();
  
  // componentDidMount() {
  // // 初回のフェッチ
  // console.log("first");
  // }

  // componentDidUpdate() {
  // // props.id が変更されたら再フェッチ
  //   // console.log(props.globalState.isLoading,props.globalState.isSignout);
  // }
  console.log("check how you are")
  // console.log("isSplash = " + isSplash,"isSignout = " + isSignout);
  console.log("global.isSplash = " + props.globalState.state.isSplash)
  console.log("global.isSignout = " + props.globalState.state.isSignout)

  if(props.globalState.state.isSplash==false&&props.globalState.state.isSignout!=""){ 
    console.log("to Nav");
      return (
          <NavigationContainer>
            <Stack.Navigator>
              {props.globalState.state.isSignout == "true" ? (
                // No token found, user isn't signed in
                  <Stack.Screen name="NavUnlogin" component={NavUnlogin} options={{ headerShown: false }} />
              ) : (
                  // User is signed in
                  <Stack.Screen name="NavLogined" component={NavLogined} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
      )
  } else {
    console.log("to splash");
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  } 
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

