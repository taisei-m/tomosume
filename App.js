import React from 'react';
import { AppRegistry } from 'react-native';
import Router from './src/Routes/index'


export default function App() {
  return (
    <Router loading = "true" />
  );
}
AppRegistry.registerComponent('Appname', () => App);
