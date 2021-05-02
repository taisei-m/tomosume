import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import { Subscribe } from 'unstated';
import firebase from '../../../firebaseConfig';
import GlobalContainer from '../../store/GlobalState';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signinErrorTextInputFirebase, checkEmailPattern, checkPasswordPattern } from './index';
import { styles } from './style';
import { NavUnloginParamList, ContainerProps } from '../../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '../../components/molecules/Button';
import { Input } from 'react-native-elements';

const LoginScreen: React.FC<NavigationProps & ContainerProps> = (props) => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [emailValidationMessage, setEmailValidationMessage] = useState<string>('');
	const [passwordValidationMessage, setPasswordValidationMessage] = useState<string>('');
	const [signinErrorText, setSigninErrorText] = useState<string>('');
	const [canSignin, setCanSignin] = useState<boolean>(false);

	useEffect(() => {
		validate('email');
	}, [email]);

	useEffect(() => {
		validate('password');
	}, [password]);

	useEffect(() => {
		if (emailValidationMessage === 'ok' && passwordValidationMessage === 'ok') {
			setCanSignin(true);
		} else {
			setCanSignin(false);
		}
	}, [emailValidationMessage, passwordValidationMessage]);

	const validateEmail = () => {
		const isValidated = checkEmailPattern(email);
		if (email === '') {
			setEmailValidationMessage('');
			return;
		}
		if (isValidated) {
			setEmailValidationMessage('ok');
			return;
		} else {
			setEmailValidationMessage('メールアドレスの形式が正しくありません');
			return;
		}
	};

	const validatePassword = () => {
		const isValidated = checkPasswordPattern(password);
		if (password === '') {
			setPasswordValidationMessage('');
			return;
		}
		if (isValidated) {
			setPasswordValidationMessage('ok');
			return;
		} else {
			setPasswordValidationMessage('半角英数字を含む6文字以上にしてください');
			return;
		}
	};

	const validate = (inputedPlace: string) => {
		if (inputedPlace === 'email') {
			validateEmail();
		}
		if (inputedPlace === 'password') {
			validatePassword();
		}
	};

	const login = () => {
		setCanSignin(false);
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.catch(function (error) {
				console.log(error.code);
				console.log(error.message);
				return error;
			})
			.then((result) => {
				setSigninErrorText(signinErrorTextInputFirebase(result.code, result.messasge));

				if (result.user) {
					if (result.user.emailVerified == true) {
						props.globalState.login(result.user.uid);
					} else if (result.user.emailVerified == false) {
						setSigninErrorText(signinErrorTextInputFirebase('authentication mail-did not check', ''));
					}
				} else {
					console.log('loginScreen result.userがない');
				}
				setCanSignin(true);
			});
	};
	return (
		<KeyboardAwareScrollView style={styles.keyboardScrollView}>
			<View style={styles.container}>
				<View>
					<Text style={styles.logo}>TomoSume</Text>
				</View>

				<Input
					containerStyle={{ width: '80%', marginBottom: 10 }}
					placeholder="メールアドレス"
					leftIcon={{ type: 'ant-design', name: 'mail' }}
					leftIconContainerStyle={{ width: 24, marginRight: 10 }}
					onChangeText={setEmail}
					value={email}
				/>
				<View>
					<Text
						style={
							emailValidationMessage === 'ok' ? styles.inputNotErrorMessage : styles.inputErrorMessage
						}>
						{emailValidationMessage}
					</Text>
				</View>
				<Input
					containerStyle={{ width: '80%', marginTop: 20, marginBottom: 10 }}
					placeholder="パスワード"
					value={password}
					leftIcon={{ type: 'ant-design', name: 'lock' }}
					leftIconContainerStyle={{ width: 24, marginRight: 10 }}
					onChangeText={setPassword}
					autoCapitalize="none"
					secureTextEntry={true}
				/>
				<View>
					<Text
						style={
							passwordValidationMessage === 'ok' ? styles.inputNotErrorMessage : styles.inputErrorMessage
						}>
						{passwordValidationMessage}
					</Text>
				</View>
				<TouchableOpacity
					onPress={() => {
						props.navigation.navigate('ResetPassword');
					}}>
					<Text style={styles.forgotText}>パスワードをお忘れの方はこちら</Text>
				</TouchableOpacity>
				<View>
					<Text style={styles.aboveButtonMessage}>{signinErrorText}</Text>
				</View>

				<View style={{ width: '80%' }}>
					<Button disabled={!canSignin} onPress={login}>
						ログイン
					</Button>
				</View>
				<TouchableOpacity
					onPress={() => {
						props.navigation.navigate('CreateAccount');
					}}>
					<Text style={styles.createAccountText}> 新しいアカウントを作成 </Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						props.navigation.navigate('ResendEmail');
					}}></TouchableOpacity>
			</View>
		</KeyboardAwareScrollView>
	);
};

type LoginScreenNavigationProps = StackNavigationProp<NavUnloginParamList, 'LoginScreen'>;

type NavigationProps = {
	navigation: LoginScreenNavigationProps;
};

export const LoginScreenWrapper: React.FC<NavigationProps> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{(globalState: GlobalContainer) => (
				<LoginScreen globalState={globalState} navigation={navigation} />
			)}
		</Subscribe>
	);
};
