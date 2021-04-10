import React from 'react';
import { AppRegistry } from 'react-native';
import Router from './src/Routes/index';
import { Provider } from 'unstated';
import { Clipboard } from 'react-native';

export default function App() {
	if (__DEV__) {
		Clipboard.setString('');
	}
	return (
		<Provider>
			<Router />
		</Provider>
	);
}
AppRegistry.registerComponent('Appname', () => App);
