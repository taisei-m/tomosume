import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Text, Button as ButtonElem } from 'react-native-elements';
import { Subscribe } from 'unstated';
import firebase from '../../../firebaseConfig';
import { styles } from './style';
import GlobalContainer from '../../store/GlobalState';
import { NavUnloginParamList, ContainerProps } from '../../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { errorMessageAboveSubmitButtonInput } from './index';
import { testEmailPattern } from '../Login/index';

const ResetPassword: React.FC<NavigationProps & ContainerProps> = (props) => {
	const [navigation] = useState(props.navigation);
	const [_email, setEmail] = useState<string>('');
	const [_setErrorMessageAboveSubmitButton, setErrorMessageAboveSubmitButton] = useState<string>('');
	const [_submitButtonIsloading, setSubmitButtonIsloading] = useState<boolean>(false);

	const emailInput = (passedEmail: string) => {
		const errorCode = 'refresh';
		const errorMessage = '';
		setEmail(passedEmail);
		setErrorMessageAboveSubmitButton(errorMessageAboveSubmitButtonInput(errorCode, errorMessage));
	};
	const submitButtonIsloadingInput = (result: boolean) => {
		setSubmitButtonIsloading(result);
	};

	const pushSubmit = () => {
		submitButtonIsloadingInput(true);
		const email: string = _email;
		let errorCode = '';
		let errorMessage = '';

		const approveEmailValidation = testEmailPattern(email);
		props.globalState.setResetPasswordEmail(email);

		if (email == '') {
			errorCode = 'email is blank';
			errorMessage = '';
			setErrorMessageAboveSubmitButton(errorMessageAboveSubmitButtonInput(errorCode, errorMessage));
		} else if (!approveEmailValidation) {
			// errorMessage = '有効なメールアドレスを入力してください';
			errorCode = 'email did not match regular expression';
			errorMessage = '';
			setErrorMessageAboveSubmitButton(errorMessageAboveSubmitButtonInput(errorCode, errorMessage));
		} else {
			const user = firebase.auth();
			firebase.auth().languageCode = 'ja';
			user
				.sendPasswordResetEmail(email)
				.then(function () {
					// Email sent.
					// alert("パスワード再設定メールを送信しました。");
					props.navigation.navigate('AfterResetPassword');
				})
				.catch(function (error) {
					// An error happened.
					errorCode = error.code;
					errorMessage = error.message;
					setErrorMessageAboveSubmitButton(errorMessageAboveSubmitButtonInput(errorCode, errorMessage));
				});
		}
		submitButtonIsloadingInput(false);
	};

	return (
		<View style={styles.container}>
			<View>
				<Text style={styles.title}>パスワードをお忘れの場合</Text>
			</View>
			<View style={styles.resetDescription}>
				<Text>
					パスワードの再設定用リンクを送信いたします。ご登録いただいたメールアドレスを入力し、送信ボタンを押してください
				</Text>
			</View>
			<View style={styles.inputView}>
				<TextInput
					style={styles.inputText}
					placeholder="メールアドレス"
					placeholderTextColor="#818181"
					value={_email}
					onChangeText={emailInput}
				/>
			</View>
			<View>
				<Text style={styles.aboveButtonMessage}>{_setErrorMessageAboveSubmitButton}</Text>
			</View>
			<View style={{ width: '80%' }}>
				<ButtonElem
					title="送信"
					type="solid"
					buttonStyle={styles.button}
					onPress={pushSubmit}
					loading={_submitButtonIsloading}
				/>
			</View>

			<TouchableOpacity
				onPress={() => {
					navigation.navigate('LoginScreen');
				}}>
				<Text style={styles.AlreadyHaveAnAccountText}> ログイン画面へ </Text>
			</TouchableOpacity>
		</View>
	);
};

type ResetPasswordProps = StackNavigationProp<NavUnloginParamList, 'ResetPassword'>;

type NavigationProps = {
	navigation: ResetPasswordProps;
};

export const ResetPasswordWrapper: React.FC<NavigationProps> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{(globalState: GlobalContainer) => (
				<ResetPassword globalState={globalState} navigation={navigation} />
			)}
		</Subscribe>
	);
};
