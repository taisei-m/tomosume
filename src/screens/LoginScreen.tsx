import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { Text, Button as ButtonElem } from 'react-native-elements';
import { Subscribe } from 'unstated';
import firebase from '../../firebaseConfig';
import GlobalStateContainer from '../store/GlobalState';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const LoginScreen = (props: any) => {
	const [emailAsRendered, setEmailAsRendered] = useState('');
	const [passwordAsRendered, setPasswordAsRendered] = useState('');
	const [validateTextEmail, setValidateTextEmail] = useState('');
	const [validateTextPassword, setValidateTextPassword] = useState('');
	const [signinErrorText, setSigninErrorText] = useState('');
	const [emailErrorIsRed, setEmailErrorIsRed] = useState<boolean>();
	const [passwordErrorIsRed, setPasswordErrorIsRed] = useState<boolean>();
	const [signinButtonDisabled, setSingnBunttonDisabled] = useState<boolean>(true);
	const [signinButtonIsloading, setSigninButtonIsloading] = useState<boolean>(false);
	const [_isDisabledInitialState, setIsDisabledInitialState] = useState<boolean>(true);
	const emailAsRenderedInput = (text: string) => {
		setEmailAsRendered(text);
	};
	const passwordAsRenderedInput = (pass: string) => {
		setPasswordAsRendered(pass);
	};
	const emailErrorIsRedInput = (result: boolean) => {
		setEmailErrorIsRed(result);
	};
	const passwordErrorIsRedInput = (result: boolean) => {
		setPasswordErrorIsRed(result);
	};
	const signinButtonDisabledInput = (result: boolean) => {
		setSingnBunttonDisabled(result);
	};
	const signinButtonIsloadingInput = (result: boolean) => {
		setSigninButtonIsloading(result);
	};
	const isDisabledInitialStateInput = (result: boolean) => {
		setIsDisabledInitialState(result);
	};

	//CreateAccount.tsxの方が綺麗に書いてある
	const validateTextEmailInput = (textType: string) => {
		const allowText = 'ok ✓';
		const denyText = '*メールアドレスの形式が正しくありません';
		const blankText = '';
		const fillblankText = '*メールアドレスは必須です';

		switch (textType) {
			case 'allow':
				setValidateTextEmail(allowText);
				break;
			case 'deny':
				setValidateTextEmail(denyText);
				break;
			case 'blank':
				setValidateTextEmail(blankText);
				break;
			case 'fillBlank':
				setValidateTextEmail(fillblankText);
		}
	};
	//CreateAccount.tsxの方が綺麗に書いてある
	const validateTextPasswordInput = (textType: string) => {
		const allowText = 'ok ✓';
		const denyText = '*半角英数字を含む6文字以上にしてください';
		const blankText = '';
		const fillblankText = '*パスワードは必須です';

		switch (textType) {
			case 'allow':
				setValidateTextPassword(allowText);
				break;
			case 'deny':
				setValidateTextPassword(denyText);
				break;
			case 'blank':
				setValidateTextPassword(blankText);
				break;
			case 'fillBlank':
				setValidateTextPassword(fillblankText);
		}
	};

	const signinErrorTextInputFirebase = (errorCode: string, errorMessage: string) => {
		let outputErrorText = '';
		switch (errorCode) {
			case 'auth/wrong-password':
				//default firebase error message: 'The password is invalid or the user does not have a password'
				outputErrorText = 'パスワードが違います。もしくは設定されていません。';
				break;
			case 'auth/user-not-found':
				//default firebase error message: 'There is no user record corresponding to this identifier. The user may have been deleted.'
				outputErrorText = 'メールアドレスまたはパスワードが間違っています';
				break;
			case 'auth/network-request-failed':
				//default firebase error message: ' A network error (such as timeout, interrupted connection or unreachable host) has occurred.'
				outputErrorText = 'ネットワークエラー：インターネットに接続されていません';
				break;
			case 'auth/user-disabled':
				outputErrorText = errorMessage; //翻訳できやんだ
				break;
			case 'authentication mail-did not check':
				outputErrorText = 'アカウント作成時に送信された認証メールを確認してくだい';
				break;
			case 'refresh':
				outputErrorText = '';
				break;
			default:
				outputErrorText = errorMessage;
				break;
		}
		setSigninErrorText(outputErrorText);
	};

	////入力されたのがemailかpasswordかどっちか判別してログイン関数を呼ぶ
	const inputedEmail = (textInputed: string) => {
		emailAsRenderedInput(textInputed);
		const inputedPlace = 'email';
		doValidate(textInputed, inputedPlace);
	};
	const inputedPassword = (textInputed: string) => {
		passwordAsRenderedInput(textInputed);
		const inputedPlace = 'password';
		doValidate(textInputed, inputedPlace);
	};

	const doValidate = (textInputed: string, inputedPlace: string) => {
		//signinボタンの上のエラーメッセージを非表示にする
		signinErrorTextInputFirebase('refrech', '');

		let email = '';
		let password = '';

		if (inputedPlace == 'email') {
			//メールアドレスの欄ににゅうりょくされた場合
			email = textInputed;
			password = passwordAsRendered;
		} else if (inputedPlace == 'password') {
			//パスワードの欄に入力された場合
			email = emailAsRendered;
			password = textInputed;
		}

		const emailPattern = new RegExp(
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
		);
		const passwordPattern = new RegExp(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{6,}$/, 'i');

		const approveEmailValidation = emailPattern.test(email);
		const approvePasswordValidation = passwordPattern.test(password);
		let isEmailBlank = true;
		let isPasswordBlank = true;
		//////入力欄の値に応じて入力方法のメッセージ(変更内容)を表示する

		////フォームに値があるかどうかの判別
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
		////フォーム(validate)の下に表示されるメッセージ
		//メールアドレス
		if (approveEmailValidation) {
			validateTextEmailInput('allow');
			emailErrorIsRedInput(false);
		} else if (!approveEmailValidation) {
			if (isEmailBlank) {
				validateTextEmailInput('blank');
				emailErrorIsRedInput(true);
			} else if (!isEmailBlank) {
				validateTextEmailInput('deny');
				emailErrorIsRedInput(true);
			}
		}
		//パスワード
		if (approvePasswordValidation) {
			validateTextPasswordInput('allow');
			passwordErrorIsRedInput(false);
		} else if (!approvePasswordValidation) {
			if (isPasswordBlank) {
				validateTextPasswordInput('blank');
				passwordErrorIsRedInput(true);
			} else if (!isPasswordBlank) {
				validateTextPasswordInput('deny');
				passwordErrorIsRedInput(true);
			}
		}
		//signinボタンを表示するかどうか
		if (approveEmailValidation == true && approvePasswordValidation == true) {
			if (isEmailBlank == false && isPasswordBlank == false) {
				signinButtonDisabledInput(false);
			}
		} else {
			signinButtonDisabledInput(true);
		}
	};

	const pushLogin = () => {
		signinButtonIsloadingInput(true);
		isDisabledInitialStateInput(false);
		signinButtonDisabledInput(true);

		firebase
			.auth()
			.signInWithEmailAndPassword(emailAsRendered, passwordAsRendered)
			.catch(function (error) {
				console.log(error.code);
				console.log(error.message);
				return error;
			})
			.then((result) => {
				//fiebaseと通信の上でのsigninエラーを表示する: signinボタンの上に表示
				signinErrorTextInputFirebase(result.code, result.messasge);

				//firebaseに認可されたらログイン処理(ユーザー情報の取得)
				if (result.user) {
					if (result.user.emailVerified == true) {
						//////メール認証ができている場合
						props.globalState.login(result.user.uid);
					} else if (result.user.emailVerified == false) {
						//////メールを登録したけどメール認証していない場合
						signinErrorTextInputFirebase('authentication mail-did not check', '');
						//認証メールを送る画面に飛ばす処理、ボタンの出現とか書くならここ
					}
				} else {
					console.log('loginScreen result.userがない');
				}
				signinButtonIsloadingInput(false);
				isDisabledInitialStateInput(true);
				signinButtonDisabledInput(false);
			});
	};
	return (
		<KeyboardAwareScrollView style={styles.keyboardScrollView}>
			<View style={styles.container}>
				{/* <View>
                <Text style={styles.logo}>TomoSume</Text>
            </View> */}
				{/* Emailの入力フォーム */}
				<View style={styles.inputView}>
					<TextInput
						style={styles.inputText}
						placeholder="メールアドレス"
						placeholderTextColor="#818181"
						value={emailAsRendered}
						onChangeText={inputedEmail}
					/>
				</View>
				<View>
					<Text style={emailErrorIsRed ? styles.inputErrorMessage : styles.inputNotErrorMessage}>
						{validateTextEmail}
					</Text>
				</View>
				{/* Passwordの入力フォーム */}
				<View style={styles.inputView}>
					<TextInput
						style={styles.inputText}
						placeholder="パスワード"
						secureTextEntry={true}
						placeholderTextColor="#818181"
						value={passwordAsRendered}
						onChangeText={inputedPassword}
						autoCapitalize="none"
					/>
				</View>
				<View>
					<Text style={passwordErrorIsRed ? styles.inputErrorMessage : styles.inputNotErrorMessage}>
						{validateTextPassword}
					</Text>
				</View>
				{/* パスワード忘れたボタン */}
				<TouchableOpacity
					onPress={() => {
						props.navigation.navigate('ResetPassword');
					}}>
					<Text style={styles.forgotText}>パスワードをお忘れの方はこちら</Text>
				</TouchableOpacity>
				{/* ボタンの上のエラーメッセージ */}
				<View>
					<Text style={styles.aboveButtonMessage}>{signinErrorText}</Text>
				</View>

				<View style={{ width: '80%' }}>
					<ButtonElem
						title="ログイン"
						type="solid"
						buttonStyle={styles.button}
						onPress={pushLogin}
						disabled={signinButtonDisabled}
						disabledStyle={
							_isDisabledInitialState
								? null
								: {
										backgroundColor: '5E9CFE',
								  }
						}
						loading={signinButtonIsloading}
					/>
				</View>
				{/* アカウント作成画面へ　ボタン */}
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

const LoginScreenWrapper = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalStateContainer]}>
			{(globalState) => <LoginScreen globalState={globalState} navigation={navigation} />}
		</Subscribe>
	);
};

export default LoginScreenWrapper;

const styles = StyleSheet.create({
	keyboardScrollView: {
		flex: 1,
		backgroundColor: 'white',
	},
	sigininButton: {
		width: '80%',
	},
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		// justifyContent: 'center',
		paddingTop: '30%',
	},
	logo: {
		fontWeight: 'bold',
		fontSize: 50,
		color: 'black',
		marginTop: '20%',
		marginBottom: '10%',
	},
	inputView: {
		width: '80%',
		borderRadius: 25,
		borderColor: 'black',
		borderWidth: 1,
		height: 50,
		justifyContent: 'center',
		paddingLeft: '5%',
		paddingRight: '5%',
	},
	inputText: {
		height: 50,
		color: 'black',
	},
	inputErrorMessage: {
		marginBottom: '3%',
		color: 'red',
	},
	inputNotErrorMessage: {
		marginBottom: '3%',
		color: '#48D1CC',
	},
	forgotText: {
		color: 'black',
		textDecorationLine: 'underline',
		// marginBottom: "13%",
	},
	createAccountText: {
		// color: '#818181',
		color: 'black',
		textDecorationLine: 'underline',
		marginTop: '5%',
	},
	aboveButtonMessage: {
		marginTop: '3%',
		marginBottom: '4%',
		color: 'red',
	},
	button: {
		backgroundColor: '#5E9CFE',
		borderRadius: 25,
		borderColor: 'black',
		height: 50,
	},
	icon: {
		marginRight: 10,
	},
});
