import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Text, Button as ButtonElem } from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../store/GlobalState';
import firebase from '../../firebaseConfig';

const ResetPassword = (props: any) => {
	const [navigation] = useState(props.navigation);
	const [_email, setEmail] = useState<string>('');
	const [_setErrorMessageAboveSubmitButton, setErrorMessageAboveSubmitButton] = useState<string>('');
	const [_submitButtonIsloading, setSubmitButtonIsloading] = useState<boolean>(false);

	const emailInput = (passedEmail: string) => {
		const errorCode = 'refresh';
		const errorMessage = '';
		setEmail(passedEmail);
		errorMessageAboveSubmitButtonInput(errorCode, errorMessage);
	};
	const submitButtonIsloadingInput = (result: boolean) => {
		setSubmitButtonIsloading(result);
	};
	//Signupボタンを押した時に表示されるエラーメッセージの内容
	const errorMessageAboveSubmitButtonInput = (errorCode: string, errorMessage: string) => {
		let outputErrorText = '';
		switch (errorCode) {
			case 'email is blank':
				outputErrorText = 'メールアドレスが未入力です';
				break;
			case 'email did not match regular expression':
				outputErrorText = 'メールアドレスの形式が正しくありません';
				break;
			case 'auth/invalid-email':
				//Thrown if the email address is not valid.
				outputErrorText = '有効なメールアドレスを入力してください';
				break;
			case 'auth/missing-android-pkg-name':
				//An Android package name must be provided if the Android app is required to be installed.
				outputErrorText =
					'An Android package name must be provided if the Android app is required to be installed';
				break;
			case 'auth/missing-continue-uri':
				//An Android package name must be provided if the Android app is required to be installed.
				outputErrorText =
					'An Android package name must be provided if the Android app is required to be installed';
				break;
			case 'auth/missing-ios-bundle-id':
				//A continue URL must be provided in the request.
				outputErrorText = 'A continue URL must be provided in the request';
				break;
			case 'auth/invalid-continue-uri':
				//An iOS Bundle ID must be provided if an App Store ID is provided.
				outputErrorText = 'An iOS Bundle ID must be provided if an App Store ID is provided';
				break;
			case 'auth/unauthorized-continue-uri':
				//The continue URL provided in the request is invalid.
				outputErrorText = 'The continue URL provided in the request is invalid';
				break;
			case 'auth/user-not-found':
				//The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase console.
				outputErrorText = 'このメールアドレスは登録されていません';
				break;
			case 'auth/network-request-failed':
				//default firebase error message: ' A network error (such as timeout, interrupted connection or unreachable host) has occurred.'
				outputErrorText = 'ネットワークエラー：インターネットに接続されていません';
				break;
			case 'refresh':
				outputErrorText = '';
				break;
			default:
				outputErrorText = errorMessage;
				break;
		}
		setErrorMessageAboveSubmitButton(outputErrorText);
	};
	const pushSubmit = () => {
		submitButtonIsloadingInput(true);
		console.log('pushed resetPassword');
		const email: string = _email;
		let errorCode = '';
		let errorMessage = '';
		const emailPattern = new RegExp(
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
		);
		const approveEmailValidation = emailPattern.test(email);
		console.log(email);
		props.globalState.setResetPasswordEmail(email);

		if (email == '') {
			errorCode = 'email is blank';
			errorMessage = '';
			errorMessageAboveSubmitButtonInput(errorCode, errorMessage);
		} else if (!approveEmailValidation) {
			// errorMessage = '有効なメールアドレスを入力してください';
			errorCode = 'email did not match regular expression';
			errorMessage = '';
			errorMessageAboveSubmitButtonInput(errorCode, errorMessage);
		} else {
			const user = firebase.auth();
			firebase.auth().languageCode = 'ja';
			user
				.sendPasswordResetEmail(email)
				.then(function () {
					// Email sent.
					// alert("パスワード再設定メールを送信しました。");
					props.navigation.navigate('afterResetEmail');
				})
				.catch(function (error) {
					// An error happened.
					errorCode = error.code;
					errorMessage = error.message;
					errorMessageAboveSubmitButtonInput(errorCode, errorMessage);
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

const ResetPasswordWrapper = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalStateContainer]}>
			{(globalState) => <ResetPassword globalState={globalState} navigation={navigation} />}
		</Subscribe>
	);
};

export default ResetPasswordWrapper;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontWeight: 'bold',
		fontSize: 27,
		color: 'black',
		marginBottom: 40,
	},
	resetDescription: {
		width: '80%',
		marginBottom: 30,
	},
	inputView: {
		width: '80%',
		borderRadius: 25,
		borderColor: 'black',
		borderWidth: 1,
		height: 50,
		marginBottom: 0,
		justifyContent: 'center',
		paddingLeft: '5%',
		paddingRight: '5%',
	},
	inputText: {
		height: 50,
		color: 'black',
	},
	forgot: {
		margin: 20,
		color: '#818181',
		marginBottom: 60,
	},
	aboveButtonMessage: {
		marginRight: '5%',
		marginLeft: '5%',
		marginTop: '3%',
		marginBottom: '2%',
		color: 'red',
	},
	button: {
		backgroundColor: '#5E9CFE',
		borderRadius: 25,
		borderColor: 'black',
		height: 50,
	},
	buttonText: {
		color: 'white',
	},
	icon: {
		marginRight: 10,
	},
	AlreadyHaveAnAccountText: {
		color: 'black',
		textDecorationLine: 'underline',
		marginTop: '5%',
	},
});
