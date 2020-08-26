import React from 'react';
import SelectLoginOrSignup from '../screens/SelectLoginOrSignup';
import { LoginScreenWrapper } from '../screens/LoginScreen/LoginScreen';
import { CreateAccountWrapper } from '../screens/CreateAccount/CreateAccount';
import ResetPassword from '../screens/ResetPassword';
import AfterResetEmail from '../screens/AfterResetPassword';
import ResendEmail from '../screens/ResendEmail';
import { NavLogin } from './NavLogin';
import { createStackNavigator } from '@react-navigation/stack';
import { NavUnloginParamList } from '../types/types';

const TabUnlogin = createStackNavigator<NavUnloginParamList>();

export const NavUnlogin: React.FC = () => {
	return (
		<TabUnlogin.Navigator initialRouteName="SelectLoginOrSignup">
			<TabUnlogin.Screen
				name="SelectLoginOrSignup"
				component={SelectLoginOrSignup}
				options={{ headerShown: false }}
			/>
			<TabUnlogin.Screen name="LoginScreen" component={LoginScreenWrapper} options={{ headerShown: false }} />
			<TabUnlogin.Screen
				name="CreateAccount"
				component={CreateAccountWrapper}
				options={{ headerShown: false }}
			/>
			<TabUnlogin.Screen
				name="ResetPassword"
				component={ResetPassword}
				options={{ headerShown: false }}
			/>
			<TabUnlogin.Screen
				name="AfterResetEmail"
				component={AfterResetEmail}
				options={{ headerShown: false }}
			/>
			<TabUnlogin.Screen name="ResendEmail" component={ResendEmail} options={{ headerShown: false }} />
			<TabUnlogin.Screen name="NavLogin" component={NavLogin} options={{ headerShown: false }} />
		</TabUnlogin.Navigator>
	);
};
