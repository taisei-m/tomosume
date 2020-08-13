import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity,} from 'react-native';
import { Text } from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../store/GlobalState';
import {StackProps} from '../types/types';

const ResendEmail = (props:StackProps) => {
	const [_navigation] = useState(props.navigation);
	const [_email, setEmail] = useState<string>('');
	const [_titleText, setTitleText] = useState<string>('');
	const emailInput = (text: string) => {
		setEmail(text);
	};
	const titleTextInput = (textType: string, passedEmail: string) => {
		let titleText = '';
		if (textType == '初期表示') {
			titleText = passedEmail + '\nへパスワード再設定メールを送信しました';
		} else if (textType == '再送信') {
			titleText = _email + '\nへメールを再送信しました';
		}
		setTitleText(titleText);
	};
	useEffect(
		() => {
			const email: string = props.globalState.state.resetPasswordEmail;
			emailInput(email);
			const textType = '初期表示';
			titleTextInput(textType, email);
		}, []);

	return (
		<View style={styles.container}>
			<View style={styles.titleTextView}>
				<Text style={styles.titleText}>{_titleText}</Text>
			</View>
			<TouchableOpacity
				onPress={() => { _navigation.navigate('LoginScreen'); }}
			>
				<Text style={styles.ToLoginText}> ログイン画面へ </Text>
			</TouchableOpacity>
		</View>
	);
};

const ResendEmailWrapper = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalStateContainer]}>
			{
				globalState => <ResendEmail globalState={globalState} navigation = {navigation} />
			}
		</Subscribe>
	);
};


export default ResendEmailWrapper;


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleTextView: {
		width: '80%',
	},
	titleText:{
		fontWeight:'bold',
		fontSize:26,
		color:'black',
		marginBottom:40
	},
	ToLoginText: {
		textDecorationLine: 'underline',
		marginTop: '5%',
	},
});
