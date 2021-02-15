/* eslint-disable indent */
import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import { Subscribe } from 'unstated';
import firebase from '../../../firebaseConfig';
import GlobalContainer from '../../store/GlobalState';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signinErrorTextInputFirebase, testEmailPattern, testPasswordPattern } from './index';
import { styles } from './style';
import { NavUnloginParamList, ContainerProps } from '../../types/types';
import { StackNavigationProp } from '@react-navigation/stack';

import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';

const LoginScreen: React.FC<NavigationProps & ContainerProps> = (props) => {
	//TODO: useCallback使うべきところは使うようにする．
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
	const [isValidPassword, setIsValidPassword] = useState<boolean>(false);
	const [validatedEmailMessage, setValidatedEmailMessage] = useState<string>('');
	const [validatedPasswordMessage, setValidatedPasswordMessage] = useState<string>('');
	const [signinErrorText, setSigninErrorText] = useState<string>('');
	const [isErrorEmail, setIsErrorEmail] = useState<boolean>();
	const [isErroPassword, setIsErrorPassword] = useState<boolean>();
	const [canPressButton, setCanPressButton] = useState<boolean>(true);
	const [isloading, setIsloading] = useState<boolean>(false);
	const [show, setShow] = React.useState(false);

	const handleClick = () => setShow(!show);

	const inputEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		validate(e.target.value, 'email');
	};
	const inputPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		validate(e.target.value, 'password');
	};

	const validate = (textInputed: string, textType: 'email' | 'password') => {
		//signinボタンの上のエラーメッセージを非表示にする
		setSigninErrorText(signinErrorTextInputFirebase('refrech', ''));

		let isValidText = false;
		if (textType == 'email') {
			isValidText = testEmailPattern(textInputed);
		} else {
			isValidText = testPasswordPattern(textInputed);
		}

		let isBlank: boolean = false;
		if (textInputed == '') {
			isBlank = true;
		} else {
			isBlank = false;
		}

		if (textType == 'email') {
			if (isValidText) {
				setValidatedEmailMessage('ok');
				setIsErrorEmail(false);
				setIsValidEmail(true);
			} else if (isBlank) {
				setValidatedEmailMessage('*メールアドレスは必須です');
				setIsErrorEmail(true);
				setIsValidEmail(false);
			} else {
				setValidatedEmailMessage('メールアドレスの形式が正しくありません');
				setIsErrorEmail(true);
				setIsValidEmail(false);
			}
		} else {
			if (isValidText) {
				setValidatedPasswordMessage('ok');
				setIsErrorPassword(false);
				setIsValidPassword(true);
			} else if (isBlank) {
				setValidatedPasswordMessage('パスワードは必須です．');
				setIsErrorPassword(true);
				setIsValidPassword(false);
			} else {
				setValidatedPasswordMessage('*半角英数字を含む6文字以上にしてください');
				setIsErrorPassword(true);
				setIsValidPassword(false);
			}
		}
		// ボタンを押せるかどうかの判定
		switch (textType) {
			case 'email':
				if (isValidText && isValidPassword) {
					setCanPressButton(false);
				} else {
					setCanPressButton(true);
				}
				break;
			case 'password':
				if (isValidText && isValidEmail) {
					setCanPressButton(false);
				} else {
					setCanPressButton(true);
				}
				break;
		}
	};

	const login = () => {
		setIsloading(true);
		setCanPressButton(true);

		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.catch(function (error) {
				return error;
			})
			.then((result) => {
				//fiebaseと通信の上でのsigninエラーを表示する: signinボタンの上に表示
				setSigninErrorText(signinErrorTextInputFirebase(result.code, result.messasge));

				//firebaseに認可されたらログイン処理(ユーザー情報の取得)
				if (result.user) {
					if (result.user.emailVerified == true) {
						//メール認証ができている場合
						props.globalState.login(result.user.uid);
					} else if (result.user.emailVerified == false) {
						//メールを登録したけどメール認証していない場合
						setSigninErrorText(
							signinErrorTextInputFirebase('authentication mail-did not check', ''),
						);
						//認証メールを送る画面に飛ばす処理、ボタンの出現とか書くならここ
					}
				} else {
					console.log('loginScreen result.userがない');
				}
				setIsloading(false);
			});
	};

	return (
		<KeyboardAwareScrollView style={styles.keyboardScrollView}>
			<View style={styles.container}>
				<Text> test01 </Text>
				<Input placeholder="メールアドレス" value={email} onChange={inputEmail} maxWidth={300} />
				<View>
					<Text style={isErrorEmail ? styles.inputErrorMessage : styles.inputNotErrorMessage}>
						{validatedEmailMessage}
					</Text>
				</View>
				<InputGroup size="md" maxWidth={300} mt={5}>
					<Input
						pr="4.5rem"
						type={show ? 'text' : 'password'}
						placeholder="パスワード"
						value={password}
						onChange={inputPassword}
					/>
					<InputRightElement width="4.5rem">
						<Button h="1.75rem" size="sm" onClick={handleClick}>
							{show ? '非表示' : '表示'}
						</Button>
					</InputRightElement>
				</InputGroup>
				<View>
					<Text style={isErroPassword ? styles.inputErrorMessage : styles.inputNotErrorMessage}>
						{validatedPasswordMessage}
					</Text>
				</View>

				<View>
					<Text style={styles.aboveButtonMessage}>{signinErrorText}</Text>
				</View>

				<Button
					colorScheme="blue"
					onClick={login}
					disabled={canPressButton}
					isLoading={isloading}
					mt={5}>
					ログイン
				</Button>
				<>
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
				</>
				<TouchableOpacity
					onPress={() => {
						props.navigation.navigate('ResetPassword');
					}}>
					<Text style={styles.forgotText}>パスワードをお忘れの方はこちら</Text>
				</TouchableOpacity>
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
