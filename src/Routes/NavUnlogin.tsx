import React from 'react';
import { SelectLoginOrSignupWrapper } from '../screens/SelectLoginOrSignup/SelectLoginOrSignup';
import { LoginScreenWrapper } from '../screens/LoginScreen/LoginScreen';
import { CreateAccountWrapper } from '../screens/CreateAccount/CreateAccount';
import { ResetPasswordWrapper } from '../screens/ResetPassword/ResetPassword';
import { AfterResetPasswordWrapper } from '../screens/AfterResetPassword/AfterResetPassword';
import { ResendEmailWrapper } from '../screens/ResendEmail/ResendEmail';
import { NavLogin } from './NavLogin';
import { createStackNavigator } from '@react-navigation/stack';
import { NavUnloginParamList } from '../types/types';

const TabUnlogin = createStackNavigator<NavUnloginParamList>();

export const NavUnlogin: React.FC = () => {
	return (
		<TabUnlogin.Navigator initialRouteName="SelectLoginOrSignup">
			<TabUnlogin.Screen
				name="SelectLoginOrSignup"
				component={SelectLoginOrSignupWrapper}
				options={{ headerShown: false }}
			/>
			<TabUnlogin.Screen
				name="LoginScreen"
				component={LoginScreenWrapper}
				options={{ headerShown: false }}
			/>
			<TabUnlogin.Screen
				name="CreateAccount"
				component={CreateAccountWrapper}
				options={{ headerShown: false }}
			/>
			<TabUnlogin.Screen
				name="ResetPassword"
				component={ResetPasswordWrapper}
				options={{ headerShown: false }}
			/>
			<TabUnlogin.Screen
				name="AfterResetPassword"
				component={AfterResetPasswordWrapper}
				options={{ headerShown: false }}
			/>
			<TabUnlogin.Screen
				name="ResendEmail"
				component={ResendEmailWrapper}
				options={{ headerShown: false }}
			/>
			<TabUnlogin.Screen name="NavLogin" component={NavLogin} options={{ headerShown: false }} />
		</TabUnlogin.Navigator>
	);
};
