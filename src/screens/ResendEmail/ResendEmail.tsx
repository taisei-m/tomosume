import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Button as ButtonElem } from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalContainer from '../../store/GlobalState';
import firebase from '../../../firebaseConfig';
import { styles } from './style';
import { titleTextInput, contentTextInput } from './index';
import { NavUnloginParamList, ContainerProps } from '@/types/types';
import { StackNavigationProp } from '@react-navigation/stack';

const ResendEmail: React.FC<NavigationProps & ContainerProps> = (props) => {
	const [_navigation] = useState(props.navigation);
	const [_email, setEmail] = useState<string>('');
	const [_titleText, setTitleText] = useState<string>('');
	const [_contentText, setContentText] = useState<string>('');
	const [_resendButtonIsloading, setResendButtonIsloading] = useState<boolean>(false);

	const emailInput = (text: string) => {
		setEmail(text);
	};
	const resendButtonIsloadingInput = (result: boolean) => {
		setResendButtonIsloading(result);
	};

	useEffect(() => {
		const email: string = props.globalState.state.createAccountEmail;
		emailInput(email);
		const textType = '初期表示';
		setTitleText(titleTextInput(textType, email, _email));
		setContentText(contentTextInput(textType));
	}, []);

	const DoResendEmail = async () => {
		resendButtonIsloadingInput(true);
		/*[改善の余地あり]
        サインインした後やとuserでメールアドレス取れるから再送信用のメールアドレス入力欄は作らんだ。
        本登録する前にアプリ再起動したら仮認証状態無くなってuserでメアド取れやんくなる。
        やから、仮登録して、本登録前にアプリ一回終了して、かつメアド見れやん状態の人やったらそのメアドでは
        誰も登録できやんくなる。
        仮登録期間が一定数あってそれが過ぎると仮登録情報消されるとかあるんかな？
        */
		/*[改善の余地あり]
            ＜sendEmailVerificationの後にthenとcatchに同じ処理が書いてある理由＞
            CraateAccount.jsxの方にも同じようなこと書いたけど
            存在しないメアドでsendEmailVerificationを使った時にcreateaccountのほうはエラーでやんくて
            resendEmailの方はエラー出るっていうよくわからんことなっとるから
            存在しないメアドの場合でもユーザーにはそのメアドに「送信しました」って映るようにした。
            やから両方に同じ処理書いた。今後わかったら改善してくれ。
        */
		const user = firebase.auth().currentUser;
		let textType = '';
		let email = '';
		if (user) {
			user.reload();
			const emailVerified: boolean = user.emailVerified;
			if (emailVerified == true) {
				textType = '本人確認済';
				email = '';
				setTitleText(titleTextInput(textType, email, _email));
				setContentText(contentTextInput(textType));
			} else if (emailVerified == false) {
				user
					.sendEmailVerification()
					.then(function () {
						// Email sent.
						textType = '再送信';
						email = '';
						setTitleText(titleTextInput(textType, email, _email));
						setContentText(contentTextInput(textType));
					})
					.catch(function (error: any): void {
						// An error happened.
						console.log('再送信失敗', error);
						textType = '再送信失敗';
						email = '';
						setTitleText(titleTextInput(textType, email, _email));
						setContentText(contentTextInput(textType));
					});
			}
		} else {
			alert('不正な処理が行われました。新しいメールアドレスで登録し直してください。');
			console.log('ResendEmail.tsx  userが取得できませんでした');
		}
		resendButtonIsloadingInput(false);
	};

	return (
		<View style={styles.container}>
			<View style={{ marginLeft: 30, marginRight: 25 }}>
				<Text style={styles.titleText}>{_titleText}</Text>
			</View>
			<View>
				<Text style={styles.contentText}>{_contentText}</Text>
			</View>
			<View style={{ width: '80%' }}>
				<ButtonElem
					title="メールを再送信する"
					type="solid"
					buttonStyle={styles.button}
					onPress={DoResendEmail}
					loading={_resendButtonIsloading}
				/>
			</View>
			<TouchableOpacity
				onPress={() => {
					_navigation.navigate('LoginScreen');
				}}>
				<Text style={styles.ToLoginText}> ログイン画面へ </Text>
			</TouchableOpacity>
		</View>
	);
};

type ResendEmailNavigationProps = StackNavigationProp<NavUnloginParamList, 'ResendEmail'>;

type NavigationProps = {
	navigation: ResendEmailNavigationProps;
};

export const ResendEmailWrapper: React.FC<NavigationProps> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{(globalState: GlobalContainer) => (
				<ResendEmail globalState={globalState} navigation={navigation} />
			)}
		</Subscribe>
	);
};
