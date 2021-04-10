// // メールアドレスの正規表現
// //TODO: メールアドレス.comがない状態でも送信できる
// const emailPattern = new RegExp(
// 	// /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
// 	/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
// );

// // パスワードの正規表現
// const passwordPattern = new RegExp(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{6,}$/, 'i');

// export const testEmailPattern = (email: string): boolean => {
// 	return emailPattern.test(email);
// };

// export const testPasswordPattern = (password: string): boolean => {
// 	return passwordPattern.test(password);
// };

// // ログインボタンの上のエラーメッセージの表示
// export const signinErrorTextInputFirebase = (errorCode: string, errorMessage: string): string => {
// 	let outputErrorText = '';
// 	switch (errorCode) {
// 		case 'auth/wrong-password':
// 			//default firebase error message: 'The password is invalid or the user does not have a password'
// 			outputErrorText = 'パスワードが違います。もしくは設定されていません。';
// 			break;
// 		case 'auth/user-not-found':
// 			//default firebase error message: 'There is no user record corresponding to this identifier. The user may have been deleted.'
// 			outputErrorText = 'メールアドレスまたはパスワードが間違っています';
// 			break;
// 		case 'auth/network-request-failed':
// 			//default firebase error message: ' A network error (such as timeout, interrupted connection or unreachable host) has occurred.'
// 			outputErrorText = 'ネットワークエラー：インターネットに接続されていません';
// 			break;
// 		case 'auth/user-disabled':
// 			outputErrorText = errorMessage; //翻訳できやんだ
// 			break;
// 		case 'authentication mail-did not check':
// 			outputErrorText = 'アカウント作成時に送信された認証メールを確認してくだい';
// 			break;
// 		case 'refresh':
// 			outputErrorText = '';
// 			break;
// 		default:
// 			outputErrorText = errorMessage;
// 			break;
// 	}
// 	return outputErrorText;
// };
// メールアドレスの正規表現
const emailPattern = new RegExp(
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
);

// パスワードの正規表現
const passwordPattern = new RegExp(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{6,}$/, 'i');

export const testEmailPattern = (email: string): boolean => {
	return emailPattern.test(email);
};

export const testPasswordPattern = (password: string): boolean => {
	return passwordPattern.test(password);
};

// メールアドレス入力欄の下のエラーメッセージの表示
export const validateTextEmailInput = (textType: string): string => {
	const allowText = 'ok ✓';
	const denyText = '*メールアドレスの形式が正しくありません';
	const blankText = '';
	const fillblankText = '*メールアドレスは必須です';

	switch (textType) {
		case 'allow':
			return allowText;
			break;
		case 'deny':
			return denyText;
			break;
		case 'blank':
			return blankText;
			break;
		case 'fillBlank':
			return fillblankText;
	}

	return '';
};

// パスワード入力欄の下のエラーメッセージの表示
export const validateTextPasswordInput = (textType: string): string => {
	const allowText = 'ok ✓';
	const denyText = '*半角英数字を含む6文字以上にしてください';
	const blankText = '';
	const fillblankText = '*パスワードは必須です';

	switch (textType) {
		case 'allow':
			return allowText;
			break;
		case 'deny':
			return denyText;
			break;
		case 'blank':
			return blankText;
			break;
		case 'fillBlank':
			return fillblankText;
	}

	return '';
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
