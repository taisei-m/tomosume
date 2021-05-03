import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Subscribe } from 'unstated';
import firebase from '../../../firebaseConfig';
import GlobalContainer from '../../store/GlobalState';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signinErrorTextInputFirebase, checkEmailPattern, checkPasswordPattern } from './index';
import { styles } from './style';
import { NavUnloginParamList, ContainerProps } from '../../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '../../components/molecules/Button';
import { Text } from '../../components/atoms/Text';
import { Input } from 'react-native-elements';
import { validateAuth } from '../../utils/validateAuthInfo';

const Login: React.FC<NavigationProps & ContainerProps> = (props) => {
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

	const validate = (inputedPlace: string) => {
		if (inputedPlace === 'email') {
			const validationMessage = validateAuth(email, 'email');
			if (validationMessage) {
				setEmailValidationMessage(validationMessage);
			} else {
				setEmailValidationMessage('');
			}
		}
		if (inputedPlace === 'password') {
			const validationMessage = validateAuth(password, 'password');
			if (validationMessage) {
				setPasswordValidationMessage(validationMessage);
			} else {
				setPasswordValidationMessage('');
			}
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
				<View style={styles.logoArea}>
					<Text size={50} weight="700">
						TomoSume
					</Text>
				</View>

				<Input
					containerStyle={{ width: '80%', marginBottom: 10 }}
					placeholder="メールアドレス"
					leftIcon={{ type: 'ant-design', name: 'mail' }}
					leftIconContainerStyle={{ width: 24, marginRight: 10 }}
					onChangeText={setEmail}
					value={email}
				/>
				<Text color={emailValidationMessage === 'ok' ? '#48D1CC' : 'red'} size={16} textAlign="center">
					{emailValidationMessage}
				</Text>
				<Input
					containerStyle={{ width: '80%', marginTop: 20, marginBottom: 10 }}
					placeholder="パスワード"
					value={password}
					leftIcon={{ type: 'ant-design', name: 'lock' }}
					leftIconContainerStyle={{ width: 24, marginRight: 10 }}
					onChangeText={setPassword}
					secureTextEntry={true}
				/>
				<View>
					<Text color={emailValidationMessage === 'ok' ? '#48D1CC' : 'red'} size={16} textAlign="center">
						{passwordValidationMessage}
					</Text>
				</View>

				<View>
					<Text>{signinErrorText}</Text>
				</View>

				<View style={{ width: '80%', marginTop: 10 }}>
					<Button disabled={!canSignin} onPress={login}>
						ログイン
					</Button>
				</View>
				<View style={styles.fogetPasswordButtonArea}>
					<TouchableOpacity
						onPress={() => {
							props.navigation.navigate('ResetPassword');
						}}>
						<Text size={16} decorationLine="underline" color="grey">
							パスワードをお忘れの方はこちら
						</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.newAccountButtonArea}>
					<TouchableOpacity
						onPress={() => {
							props.navigation.navigate('CreateAccount');
						}}>
						<Text size={16} decorationLine="underline" color="grey">
							新しいアカウントを作成
						</Text>
					</TouchableOpacity>
				</View>
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
			{(globalState: GlobalContainer) => <Login globalState={globalState} navigation={navigation} />}
		</Subscribe>
	);
};
