import React from 'react';
import { AppRegistry } from 'react-native';
//@ts-ignore
import Router from './src/Routes/index'
import { Provider } from 'unstated';
// import {decode, encode} from 'base-64'
// // if (!global.btoa) { global.btoa = encode }
// // if (!global.atob) { global.atob = decode }


export default function App() {
  return (
    <Provider>
      <Router />
    </Provider>
  );
}
AppRegistry.registerComponent('Appname', () => App);
