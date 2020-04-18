import React, { Component } from 'react';
import { Provider } from 'unstated';
import { createStackNavigator } from '@react-navigation/stack';
import NavLogined from '../components/NavLogined';
import NavUnlogin from '../components/NavUnlogin';
import { NavigationContainer } from '@react-navigation/native';
import { AsyncStorage } from 'react-native';





export default class Hoge extends Component{
  //コンストラクタ
  constructor(props){
    super(props); //必ず呼ぶ

    let UID123_object = {
      name: 'Chris',
      age: 30,
      traits: { hair: 'brown', eyes: 'brown' },
    };
    AsyncStorage.setItem('UID123', JSON.stringify(UID123_object), () => {
        AsyncStorage.getItem('UID123', (err, result) => {
          console.log(result);
        });
    });
  }

  render(){
    const Stack = createStackNavigator();
    return (
      <Provider>
        <NavigationContainer >
          <Stack.Navigator>
            {this.props.loading == "true" ? (
              // No token found, user isn't signed in
                <Stack.Screen name="NavUnlogin" component={NavUnlogin} options={{ headerShown: false }} />
            ) : (
                // User is signed in
                <Stack.Screen name="NavLogined" component={NavLogined} options={{ headerShown: false }} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
  )
  }
}


