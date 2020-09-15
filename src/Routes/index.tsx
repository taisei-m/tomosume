import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavLogin } from './NavLogin';
import { NavUnlogin } from './NavUnlogin';
import { NavigationContainer } from '@react-navigation/native';
import { Subscribe } from 'unstated';
import GlobalContainer from '../store/GlobalState';
import SplashScreen from '../screens/Splash';
import { IndexParamList, ContainerProps } from '../types/types';

const Stack = createStackNavigator<IndexParamList>();

const Index: React.FC<ContainerProps> = (props) => {
	if (props.globalState.state.isSplash == true || props.globalState.state.isSignout == undefined) {
		return <SplashScreen />;
	}
	return (
		<NavigationContainer>
			<Stack.Navigator>
				{props.globalState.state.isSignout == true ? (
					<Stack.Screen name="NavUnlogin" component={NavUnlogin} options={{ headerShown: false }} />
				) : (
					<Stack.Screen name="NavLogined" component={NavLogin} options={{ headerShown: false }} />
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

const indexWrapper = () => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{(globalState: GlobalContainer) => <Index globalState={globalState} />}
		</Subscribe>
	);
};

export default indexWrapper;
