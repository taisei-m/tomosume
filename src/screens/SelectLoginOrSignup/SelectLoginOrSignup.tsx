import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Button as ButtonElem } from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalContainer from '../../store/GlobalState';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavUnloginParamList, ContainerProps } from '../../types/types';
import { styles } from './style';

const SelectLoginOrSignup: React.FC<NavigationProps & ContainerProps> = (props) => {
	return (
		<View style={styles.container}>
			<View>
				<Text style={styles.topTitle}>Tomosume</Text>
			</View>
			<View style={styles.button}>
				<ButtonElem
					title="新しいアカウントを作成"
					type="solid"
					buttonStyle={styles.gotoSignupButton}
					onPress={() => props.navigation.navigate('CreateAccount')}
				/>
			</View>
			<TouchableOpacity onPress={() => props.navigation.navigate('LoginScreen')}>
				<Text style={styles.gotoLoginText}>ログイン</Text>
			</TouchableOpacity>
		</View>
	);
};

type SelectLoginOrSignupWrapper = StackNavigationProp<NavUnloginParamList, 'SelectLoginOrSignup'>;

type NavigationProps = {
	navigation: SelectLoginOrSignupWrapper;
};

export const SelectLoginOrSignupWrapper: React.FC<NavigationProps> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{(globalState: GlobalContainer) => (
				<SelectLoginOrSignup globalState={globalState} navigation={navigation} />
			)}
		</Subscribe>
	);
};
