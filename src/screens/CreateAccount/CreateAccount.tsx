import React, { useEffect } from 'react';
import { useState } from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';
import { Text, Input, Icon, Button as ButtonElem } from 'react-native-elements';
import firebase from '../../../firebaseConfig';
import { Subscribe } from 'unstated';
import GlobalContainer from '../../store/GlobalState';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { testEmailPattern, testPasswordPattern } from '../LoginScreen/index';
import { usernameErrorMessageInput, emailErrorMessageInput, passwordErrorMessageInput,
		 signupErrorTextInput, testUsernamePattern,  
} from './index'
import { styles } from './style'
import { NavUnloginParamList } from '@/types/types';
import { StackNavigationProp } from '@react-navigation/stack';


const CreateAccount = (props: any) => {
	const [_globalState, setGlobalState] = useState(props.globalState);
	const [_navigation, setNavigation] = useState(props.navigation);
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

	//input関数
	const usernameInput = (passedUsername: string) => {
		setUsername(passedUsername);
	};
	const emailInput = (passedEmail: string) => {
		setEmail(passedEmail);
	};
	const passwordInput = (passedPassword: string) => {
		setPassword(passedPassword);
	};
	const signupButtonDisabledInput = (result: boolean) => {
		setSignupButtonDisabled(result);
	};
	////アイコンが押されたら、パスワードの表示 / 非表示を切り替える
	const isUnvisiblePasswordInput = () => {
		setIsUnvisiblePassword(!_isUnvisiblePassword);
	};
	const signupButtonIsloadingInput = (passed: boolean) => {
		setSignupButtonIsloading(passed);
	};
	const signupButtonDisabledInitialStateInput = (result: boolean) => {
		setSignupButtonDisabledInitialState(result);
	};

	//パスワードの表示/非表示に合わせてアイコンの切り替え
	useEffect(() => {
		const visibleIconName = 'ios-eye';
		const unVisibleIconName = 'ios-eye-off';
		const unVisible: boolean = _isUnvisiblePassword;
		let iconName: string;
		if (unVisible) {
			iconName = unVisibleIconName;
		} else {
			iconName = visibleIconName;
		}
		setPasswordIconTypeVisible(iconName);
	}, [_isUnvisiblePassword]);

	//フォームの入力を監視、入力に応じてvalidate関数を呼ぶ
	const inputUsername = (inputedUsername: string) => {
		usernameInput(inputedUsername);
		autoValidation(inputedUsername, 'username');
	};
	const inputEmail = (inputedEmail: string) => {
		emailInput(inputedEmail);
		autoValidation(inputedEmail, 'email');
	};
	const inutPassword = (inputedPassword: string) => {
		passwordInput(inputedPassword);
		autoValidation(inputedPassword, 'password');
	};

	const autoValidation = (inputedText: string, inputedForm: string) => {
		// 新規作成ボタンの上のエラーメッセージを非表示にする
		let outputErrorText: string = signupErrorTextInput('refresh', '');
		setSignupErrorMessage(outputErrorText);

		let username = '';
		let email = '';
		let password = '';

		if (inputedForm == 'username') {
			username = inputedText;
			email = _email;
			password = _password;
		} else if (inputedForm == 'email') {
			username = _username;
			email = inputedText;
			password = _password;
		} else if (inputedForm == 'password') {
			username = _username;
			email = _email;
			password = inputedText;
		}
		//validation
		////※名詞＋形容詞の場合。名詞のこぶが一つなら前置修飾、二つ以上なら後置修飾or後置で統一？
		const isUsernameValid: boolean = testUsernamePattern(username);
		const isEmailValid: boolean = testEmailPattern(email);
		const isPasswordValid: boolean = testPasswordPattern(password);
		let isUsernameBlank = true;
		let isEmailBlank = true;
		let isPasswordBlank = true;

		//各入力欄が未入力かどうか確かめる
		if (username == '') {
			isUsernameBlank = true;
		} else {
			isUsernameBlank = false;
		}
		if (email == '') {
			isEmailBlank = true;
		} else {
			isEmailBlank = false;
		}
		if (password == '') {
			isPasswordBlank = true;
		} else {
			isPasswordBlank = false;
		}

		// 各入力欄のエラーの内容と色を切り替え
		//// ユーザー名
		let usernameValidationErrorMessageType = '';
		if (isUsernameValid) {
			usernameValidationErrorMessageType = 'valid';
		} else if (!isUsernameValid) {
			if (isUsernameBlank) {
				usernameValidationErrorMessageType = 'blank';
			} else {
				usernameValidationErrorMessageType = 'invalid';
			}
		}
		let usernameErrorMessageInfo = usernameErrorMessageInput(usernameValidationErrorMessageType);
		setUsernameErrorMessage(usernameErrorMessageInfo.errorMessage);
		setUsernameErrorMessageIsRed(usernameErrorMessageInfo.errorMessageColorIsRed);
		
		//// メールアドレス
		let emailValidationErrorMessageType = '';
		if (isEmailValid) {
			emailValidationErrorMessageType = 'valid';
		} else if (!isEmailValid) {
			if (isEmailBlank) {
				emailValidationErrorMessageType = 'blank';
			} else if (!isEmailBlank) {
				emailValidationErrorMessageType = 'invalid';
			}
		}
		let emailErrorMessageInfo = emailErrorMessageInput(emailValidationErrorMessageType);
		setEmailErrorMessage(emailErrorMessageInfo.errorMessage);
    	setEmailErrorMessageIsRed(emailErrorMessageInfo.errorMessageColorIsRed);

		//// パスワード
		let passwordValidationErrorMessageType = '';
		if (isPasswordValid) {
			passwordValidationErrorMessageType = 'valid';
		} else if (!isPasswordValid) {
			if (isPasswordBlank) {
				passwordValidationErrorMessageType = 'blank';
			} else if (!isPasswordBlank) {
				passwordValidationErrorMessageType = 'invalid';
			}
		}
		let passwordErrorMessageInfo = passwordErrorMessageInput(passwordValidationErrorMessageType);
		setPasswordErrorMessage(passwordErrorMessageInfo.errorMessage);
		setPasswordErrorMessageIsRed(passwordErrorMessageInfo.errorMessageColorIsRed);

		// 新規登録ボタンの表示/非表示の切り替え
		let signupButtonDisabled = true;
		if (isUsernameValid && isEmailValid && isPasswordValid) {
			signupButtonDisabled = false;
		} else {
			signupButtonDisabled = true;
		}
		signupButtonDisabledInput(signupButtonDisabled);
	};

	const pushSignup = () => {
		signupButtonIsloadingInput(true);
		signupButtonDisabledInitialStateInput(false);
		signupButtonDisabledInput(true);

		firebase
			.auth()
			.createUserWithEmailAndPassword(_email, _password)
			.catch(function (error) {
				console.log('errorCode: ' + error.code);
				console.log('errorMessage: ' + error.message);
				return error;
			})
			.then(async (result) => {
				//fiebaseと通信の上での新規作成時のエラーを表示する: 新規作成ボタンの上に表示
				let outputErrorText: string = signupErrorTextInput(result.code, result.messasge);
				setSignupErrorMessage(outputErrorText);


				if (result.user) {
					const user = result.user;
					_globalState.setCreateAccountEmail(user.email);

					const db = firebase.firestore().collection('userList').doc(user.uid);
					db.set({
						userName: _username,
						iconURL: _defaultIconUrl,
						uid: user.uid,
					});
					db.collection('follower').doc('first').set({});
					db.collection('followee').doc('first').set({});
					firebase.auth().languageCode = 'ja';
					let sentEmail: boolean | undefined;
					//なんでかわからんけどsendEmailVerificationメソッドこのファイルやとエラーでやんけどresendEmailで使うと[Error: We have blocked all requests from this device due to unusual activity. Try again later.]のエラーcatchする。
					await user
						.sendEmailVerification()
						.then(function () {
							//※errorがある場合でもthenの中身も実行される?
							sentEmail = true;
						})
						.catch(function () {
							sentEmail = false;
						});
					if (sentEmail == true) {
						_navigation.navigate('ResendEmail');
					}
				} else {
					console.log('予期せぬエラーが発生しました CreateAccount.tsx');
				}
				signupButtonIsloadingInput(false);
				signupButtonDisabledInitialStateInput(true);
				signupButtonDisabledInput(false);
			});
	};

	return (
		<KeyboardAwareScrollView style={styles.keyboardScrollView}>
			<View style={styles.container}>
				{/* <View>

            <Text style={styles.logo}>アカウント新規作成</Text>

        </View> */}
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
									isUnvisiblePasswordInput();
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
						onPress={pushSignup}
						disabled={_signupButtonDisabled}
						disabledStyle={
							_signupButtonDisabledInitialState
								? null
								: {
										backgroundColor: '5E9CFE',
								  }
						}
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

type CreateAccountNavigationProps = StackNavigationProp<NavUnloginParamList, 'CreateAccount'>

type NavigationProps = {
	navigation: CreateAccountNavigationProps;
}

export const CreateAccountWrapper: React.FC<NavigationProps> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{(globalState: GlobalContainer) => <CreateAccount globalState={globalState} navigation={navigation} />}
		</Subscribe>
	);
};

