import React, { useEffect } from 'react';
import { useState } from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import { Text, Input, Icon, Button as ButtonElem } from 'react-native-elements';
import firebase from '../../../firebaseConfig';
import { Subscribe } from 'unstated';
import GlobalContainer from '../../store/GlobalState';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { testEmailPattern, testPasswordPattern } from '../LoginScreen/index';
import {
	changeUserNameErrorMessage,
	changeEmailErrorMessage,
	passwordErrorMessageInput,
	getSignupErrorMessage,
	checkIsUserNameValid,
	checkIsEmpty,
	changeValidationMessageType,
	checkCanSignup,
	setUser,
} from './index';
import { styles } from './style';
import { NavUnloginParamList, ContainerProps } from '@/types/types';
import { StackNavigationProp } from '@react-navigation/stack';

const CreateAccount: React.FC<NavigationProps & ContainerProps> = (props) => {
	const [_username, setUsername] = useState<string>('');
	const [_email, setEmail] = useState<string>('');
	const [_password, setPassword] = useState<string>('');
	const [_isUnvisiblePassword, setIsUnvisiblePassword] = useState<boolean>(true);
	const [_passwordIconTypeVisible, setPasswordIconTypeVisible] = useState<string>('ios-eye-off');
	const [_signupButtonDisabled, setSignupButtonDisabled] = useState<boolean>(true);
	const [_signupButtonIsloading, setSignupButtonIsloading] = useState<boolean>(false);
	const [_signupButtonDisabledInitialState, setSignupButtonDisabledInitialState] = useState<boolean>(
		true,
	);
	//エラーメッセ―ジ
	const [_usernameErrorMessage, setUsernameErrorMessage] = useState<string>();
	const [_emailErrorMessage, setEmailErrorMessage] = useState<string>();
	const [_passwordErrorMessage, setPasswordErrorMessage] = useState<string>();
	const [_usernameErrorMessageIsRed, setUsernameErrorMessageIsRed] = useState<boolean>();
	const [_emailErrorMessageIsRed, setEmailErrorMessageIsRed] = useState<boolean>();
	const [_passwordErrorMessageIsRed, setPasswordErrorMessageIsRed] = useState<boolean>();
	const [_signupErrorMessage, setSignupErrorMessage] = useState<string>();
	const [_defaultIconUrl, setDefaultIconUrl] = useState<string>('');

	// firebase storageから画像のurlを取得する処理
	useEffect(() => {
		(async () => {
			const storageRef = firebase.storage().ref('user/icon/' + 'test-image');
			const url = await storageRef.getDownloadURL();
			setDefaultIconUrl(url);
		})();
	}, []);

	//パスワードの表示/非表示に合わせてアイコンの切り替え
	useEffect(() => {
		const unVisible: boolean = _isUnvisiblePassword;
		let iconName: string;
		if (unVisible) {
			iconName = 'ios-eye-off';
		} else {
			iconName = 'ios-eye';
		}
		setPasswordIconTypeVisible(iconName);
	}, [_isUnvisiblePassword]);

	//フォームの入力を監視、入力に応じてvalidate関数を呼ぶ
	const inputUsername = (inputedUsername: string) => {
		setUsername(inputedUsername);
		autoValidation(inputedUsername, 'username');
	};
	const inputEmail = (inputedEmail: string) => {
		setEmail(inputedEmail);
		autoValidation(inputedEmail, 'email');
	};
	const inutPassword = (inputedPassword: string) => {
		setPassword(inputedPassword);
		autoValidation(inputedPassword, 'password');
	};

	const input = (
		inputedText: string,
		inputedForm: 'username' | 'email' | 'password',
	): { username: string; email: string; password: string } => {
		let registerdInfo = {
			username: '',
			email: '',
			password: '',
		};
		if (inputedForm == 'username') {
			registerdInfo.username = inputedText;
			registerdInfo.email = _email;
			registerdInfo.password = _password;
		} else if (inputedForm == 'email') {
			registerdInfo.username = _username;
			registerdInfo.email = inputedText;
			registerdInfo.password = _password;
		} else {
			registerdInfo.username = _username;
			registerdInfo.email = _email;
			registerdInfo.password = inputedText;
		}
		return registerdInfo;
	};
	const autoValidation = (inputedText: string, inputedForm: 'username' | 'email' | 'password') => {
		// 新規作成ボタンの上のエラーメッセージを非表示にする
		let outputErrorText: string = '';
		setSignupErrorMessage(outputErrorText);
		const registerInfo = input(inputedText, inputedForm);
		//validation
		const isUsernameValid: boolean = checkIsUserNameValid(registerInfo.username);
		const isEmailValid: boolean = testEmailPattern(registerInfo.email);
		const isPasswordValid: boolean = testPasswordPattern(registerInfo.password);

		const isUserNameEmpty = checkIsEmpty(registerInfo.username);
		const isEmailEmpty = checkIsEmpty(registerInfo.email);
		const isPasswordEmpty = checkIsEmpty(registerInfo.password);
		// 各入力欄のエラーの内容と色を切り替え
		//// ユーザー名
		const userNameValidationMessageType = changeValidationMessageType(
			isUsernameValid,
			isUserNameEmpty,
		);
		const userNameErrorMessage = changeUserNameErrorMessage(userNameValidationMessageType);
		setUsernameErrorMessage(userNameErrorMessage.errorMessage);
		setUsernameErrorMessageIsRed(userNameErrorMessage.errorMessageColorIsRed);

		//// メールアドレス
		const emailValidationMessageType = changeValidationMessageType(isEmailValid, isEmailEmpty);
		const emailErrorMessage = changeEmailErrorMessage(emailValidationMessageType);
		setEmailErrorMessage(emailErrorMessage.errorMessage);
		setEmailErrorMessageIsRed(emailErrorMessage.errorMessageColorIsRed);

		//// パスワード
		const passwordValidationMessageType = changeValidationMessageType(
			isPasswordValid,
			isPasswordEmpty,
		);
		const passwordErrorMessage = passwordErrorMessageInput(passwordValidationMessageType);
		setPasswordErrorMessage(passwordErrorMessage.errorMessage);
		setPasswordErrorMessageIsRed(passwordErrorMessage.errorMessageColorIsRed);

		// 新規登録ボタンの表示/非表示の切り替え
		const canSignup = checkCanSignup({
			userName: isUsernameValid,
			email: isEmailValid,
			password: isPasswordValid,
		});
		setSignupButtonDisabled(canSignup);
	};
	const signup = () => {
		setSignupButtonIsloading(true);
		setSignupButtonDisabledInitialState(false);
		setSignupButtonDisabled(true);

		firebase
			.auth()
			.createUserWithEmailAndPassword(_email, _password)
			.catch((error) => {
				const authError = error as firebase.auth.Error;
				const errorCode = authError.code;
				const errorMessage = authError.message;
				const signupErrorMessage: string = getSignupErrorMessage(errorCode, errorMessage);
				setSignupErrorMessage(signupErrorMessage);
			})
			.then(async (result) => {
				if (typeof result == 'object') {
					const user = result.user;
					if (user) {
						if (user.email) {
							props.globalState.setCreateAccountEmail(user.email);
						} else {
							console.log('email is empty');
						}
						setUser(_username, _defaultIconUrl, user.uid);
						firebase.auth().languageCode = 'ja';
						//FIXME:sendEmailVerificationメソッドこのファイルやとエラーでやんけどresendEmailで使うと[Error: We have blocked all requests from this device due to unusual activity. Try again later.]のエラーcatchする。
						await user
							.sendEmailVerification()
							.then(() => {
								props.navigation.navigate('ResendEmail');
							})
							.catch((error) => {
								console.log(error);
							});
					} else {
						console.log('予期せぬエラーが発生しました CreateAccount.tsx');
					}
				} else {
					console.log('error');
				}
				setSignupButtonIsloading(false);
				setSignupButtonDisabledInitialState(true);
				setSignupButtonDisabled(false);
			});
	};

	return (
		<KeyboardAwareScrollView style={styles.keyboardScrollView}>
			<View style={styles.container}>
				<View style={styles.inputView}>
					<Input
						inputStyle={styles.inputText}
						placeholder="ユーザー名（アプリ内で変更可能）"
						placeholderTextColor="#818181"
						value={_username}
						errorMessage={_usernameErrorMessage}
						errorStyle={
							_usernameErrorMessageIsRed ? styles.redInputErrorMessage : styles.greenInputErrorMessage
						}
						onChangeText={inputUsername}
					/>
				</View>
				<View style={styles.inputView}>
					<Input
						inputStyle={styles.inputText}
						placeholder="メールアドレス"
						placeholderTextColor="#818181"
						value={_email}
						errorMessage={_emailErrorMessage}
						errorStyle={
							_emailErrorMessageIsRed ? styles.redInputErrorMessage : styles.greenInputErrorMessage
						}
						onChangeText={inputEmail}
					/>
				</View>
				<View style={styles.inputView}>
					<Input
						inputStyle={styles.inputText}
						placeholder="パスワード(半角英数字６文字以上)"
						placeholderTextColor="#818181"
						value={_password}
						secureTextEntry={_isUnvisiblePassword}
						errorMessage={_passwordErrorMessage}
						errorStyle={
							_passwordErrorMessageIsRed ? styles.redInputErrorMessage : styles.greenInputErrorMessage
						}
						onChangeText={inutPassword}
						rightIcon={
							<Icon
								name={_passwordIconTypeVisible}
								type="ionicon"
								color="#517fa4"
								onPress={() => {
									setIsUnvisiblePassword(!_isUnvisiblePassword);
								}}
							/>
						}
					/>
				</View>
				{/* ボタンの上のエラーメッセージ */}
				<View>
					<Text style={styles.aboveButtonMessage}>{_signupErrorMessage}</Text>
				</View>
				<View style={{ width: '80%' }}>
					<ButtonElem
						title="新規登録"
						type="solid"
						buttonStyle={styles.button}
						onPress={signup}
						disabled={_signupButtonDisabled}
						disabledStyle={_signupButtonDisabledInitialState ? null : { backgroundColor: '5E9CFE' }}
						accessibilityLabel="Learn more about this purple button"
						loading={_signupButtonIsloading}
					/>
				</View>

				<TouchableOpacity onPress={() => props.navigation.navigate('LoginScreen')}>
					<Text style={styles.AlreadyHaveAccountText}> 既にアカウントをお持ちの方はこちら </Text>
				</TouchableOpacity>
				<View style={{ marginLeft: 40, marginRight: 30, marginTop: 80 }}>
					<Text>
						登録することで、
						<Text
							style={{ color: 'blue', textDecorationLine: 'underline' }}
							onPress={() => Linking.openURL('https://tomosume.flycricket.io/privacy.html')}>
							プライバシーポリシー
						</Text>
						に同意したことになります。
					</Text>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
};

type CreateAccountNavigationProps = StackNavigationProp<NavUnloginParamList, 'CreateAccount'>;

type NavigationProps = {
	navigation: CreateAccountNavigationProps;
};

export const CreateAccountWrapper: React.FC<NavigationProps> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{(globalState: GlobalContainer) => (
				<CreateAccount globalState={globalState} navigation={navigation} />
			)}
		</Subscribe>
	);
};
