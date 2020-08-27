import { NavUnloginParamList } from '@/types/types';
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalContainer from '../../store/GlobalState';
import { ContainerProps } from '../../types/types';
import { styles } from './style';
import { titleTextInput} from './index';
import { StackNavigationProp } from '@react-navigation/stack';


const AfterResetPassword: React.FC<NavigationProps & ContainerProps> = (props) => {
	const [_navigation] = useState(props.navigation);
	const [_email, setEmail] = useState<string>('');
	const [_titleText, setTitleText] = useState<string>('');
	const emailInput = (text: string) => {
		setEmail(text);
	};

	useEffect(() => {
		const email: string = props.globalState.state.resetPasswordEmail;
		emailInput(email);
		const textType = '初期表示';
		setTitleText(titleTextInput(textType, email, _email));
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.titleTextView}>
				<Text style={styles.titleText}>{_titleText}</Text>
			</View>
			<TouchableOpacity
				onPress={() => {
					_navigation.navigate('LoginScreen');
				}}>
				<Text style={styles.ToLoginText}> ログイン画面へ </Text>
			</TouchableOpacity>
		</View>
	);
};

type AfterResetPasswordProps = StackNavigationProp<NavUnloginParamList, 'AfterResetPassword'>;


type NavigationProps = {
    navigation: AfterResetPasswordProps;
}

export const AfterResetPasswordWrapper: React.FC<NavigationProps> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{(globalState: GlobalContainer) => <AfterResetPassword globalState={globalState} navigation={navigation} />}
		</Subscribe>
	);
};



