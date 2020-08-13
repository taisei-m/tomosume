import React from 'react';
import { AppRegistry } from 'react-native';
import Router from './src/Routes/index';
import { Provider } from 'unstated';

export default function App() {
	return (
		<Provider>
			<Router />
		</Provider>
	);
}
AppRegistry.registerComponent('Appname', () => App);
