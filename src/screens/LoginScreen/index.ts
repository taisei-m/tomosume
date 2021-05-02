// メールアドレスの正規表現
const emailPattern = new RegExp(
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
);

// パスワードの正規表現
const passwordPattern = new RegExp(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{6,}$/, 'i');

export const checkEmailPattern = (email: string): boolean => {
	return emailPattern.test(email);
};

export const checkPasswordPattern = (password: string): boolean => {
	return passwordPattern.test(password);
};

// ログインボタンの上のエラーメッセージの表示
export const signinErrorTextInputFirebase = (errorCode: string, errorMessage: string): string => {
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
	return outputErrorText;
};
