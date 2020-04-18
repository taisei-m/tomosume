import React, { Component } from 'react';
import { Provider } from 'unstated';
import { createStackNavigator } from '@react-navigation/stack';
import NavLogined from '../components/NavLogined';
import NavUnlogin from '../components/NavUnlogin';
import { NavigationContainer } from '@react-navigation/native';
import { AsyncStorage } from 'react-native';
import { Subscribe } from 'unstated'
import GlobalStateContainer from '../containers/GlobalState';

class Index extends Component{
  //コンストラクタ
  constructor(props) {
    super(props);
    this.state = {
      globalState: props.globalState
    }; 
    console.log("index");
    console.log(props);
    // AsyncStorage.setItem('UID123', JSON.stringify(UID123_object), () => {
    //     AsyncStorage.getItem('UID123', (err, result) => {
    //       console.log(result);
    //     });
    // });
  }

  render(){
    const Stack = createStackNavigator();
    return (
      // <Provider>
        <NavigationContainer>
          <Stack.Navigator>
            {this.state.globalState.state.isSignout === true ? (
              // No token found, user isn't signed in
                <Stack.Screen name="NavUnlogin" component={NavUnlogin} options={{ headerShown: false }} />
            ) : (
                // User is signed in
                <Stack.Screen name="NavLogined" component={NavLogined} options={{ headerShown: false }} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      // </Provider>
  )
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

