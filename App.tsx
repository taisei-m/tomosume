import React from 'react';
import { AppRegistry } from 'react-native';
import Router from './src/Routes/index';
import { Provider } from 'unstated';
import { ChakraProvider } from '@chakra-ui/react';

export default function App() {
	return (
		<Provider>
			<ChakraProvider>
				<Router />
			</ChakraProvider>
		</Provider>
	);
}
AppRegistry.registerComponent('Appname', () => App);
