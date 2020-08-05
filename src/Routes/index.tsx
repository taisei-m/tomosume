import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavLogin } from './NavLogin';
import {NavUnlogin} from './NavUnlogin';
import { NavigationContainer } from '@react-navigation/native';
import { Subscribe } from 'unstated'
import GlobalStateContainer from '../store/GlobalState';
import SplashScreen from '../screens/Splash'
import {IndexParamList} from '../types/types'

const Stack = createStackNavigator<IndexParamList>();

type IndexProps = {
  globalState: {
    state: {
      isSplash: boolean
      isSignout: string
    }
  }
}
const Index: React.FC<IndexProps> = (props) => {
  if (props.globalState.state.isSplash == true || props.globalState.state.isSignout=="") {
    return <SplashScreen />;
  }
      return (
          <NavigationContainer>
            <Stack.Navigator>
              {props.globalState.state.isSignout == "true" ? (
                  <Stack.Screen
                    name="NavUnlogin"
                    component={NavUnlogin}
                    options={{ headerShown: false }}
                  />
              ) : (
                  <Stack.Screen
                    name="NavLogined"
                    component={NavLogin}
                    options={{ headerShown: false }}
                  />
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

