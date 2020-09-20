import { db } from '../../../firebaseConfig';
import { ErorrMessageInput } from '@/types/types';

// ユーザー名のvalidation
export const checkIsUserNameValid = (userName: string): boolean => {
	if (userName.length == 0) {
		return false;
	} else if (userName.length > 13) {
		return false;
	} else {
		return true;
	}
};

export const changeUserNameErrorMessage = (passedErrorMessageType: string): ErorrMessageInput => {
	const allowText = 'ok ✓';
	const denyText = '*13文字以内で入力してください';
	const fillblankText = '*ユーザーネームは必須です';
	let errorMessage = '';
	let errorMessageColorIsRed = true;
	switch (passedErrorMessageType) {
		case 'valid':
		errorMessage = allowText;
		errorMessageColorIsRed = false;
		break;
	case 'invalid':
		errorMessage = denyText;
		errorMessageColorIsRed = true;
		break;
	case 'blank':
		errorMessage = '';
		errorMessageColorIsRed = true;
		break;
	case 'fillBlank':
		errorMessage = fillblankText;
		break;
	}

	let errorMessageInfo: ErorrMessageInput = {
		errorMessage: errorMessage,
		errorMessageColorIsRed: errorMessageColorIsRed,
	};

	return errorMessageInfo;
};

export const changeEmailErrorMessage = (passedErrorMessageType: string): ErorrMessageInput => {
	const allowText = 'ok ✓';
	const denyText = '*メールアドレスの形式が正しくありません';
	const fillblankText = '*メールアドレスは必須です';
	let errorMessage = '';
	let errorMessageColorIsRed = true;
	switch (passedErrorMessageType) {
		case 'valid':
			errorMessage = allowText;
			errorMessageColorIsRed = false;
			break;
		case 'invalid':
			errorMessage = denyText;
			errorMessageColorIsRed = true;
			break;
		case 'blank':
			errorMessage = '';
			errorMessageColorIsRed = true;
			break;
		case 'fillBlank':
			errorMessage = fillblankText;
			break;
	}

	let errorMessageInfo: ErorrMessageInput = {
		errorMessage: errorMessage,
		errorMessageColorIsRed: errorMessageColorIsRed,
	};

	return errorMessageInfo;
};

export const passwordErrorMessageInput = (passedErrorMessageType: string): ErorrMessageInput => {
	const allowText = 'ok ✓';
	const denyText = '*半角英数字を含む6文字以上にしてください';
	const fillblankText = '*パスワードは必須です';
	let errorMessage = '';
	let errorMessageColorIsRed = true;
	switch (passedErrorMessageType) {
		case 'valid':
			errorMessage = allowText;
			errorMessageColorIsRed = false;
			break;
		case 'invalid':
			errorMessage = denyText;
			errorMessageColorIsRed = true;
			break;
		case 'blank':
			errorMessage = '';
			errorMessageColorIsRed = true;
			break;
		case 'fillBlank':
			errorMessage = fillblankText;
			break;
	}

	let errorMessageInfo: ErorrMessageInput = {
		errorMessage: errorMessage,
		errorMessageColorIsRed: errorMessageColorIsRed,
	};

	return errorMessageInfo;
};

//Signupボタンを押した時に表示されるエラーメッセージの内容
export const getSignupErrorMessage = (errorCode: string, errorMessage: string): string => {
	let errorText = '';
	switch (errorCode) {
		case 'auth/email-already-in-use':
			//Thrown if there already exists an account with the given email address.
			errorText = 'このメールアドレスは既に使用されています';
			break;
		case 'auth/invalid-email':
			//Thrown if the email address is not valid.
			errorText = '有効なメールアドレスを入力してください';
			break;
		case 'auth/operation-not-allowed':
			//Thrown if email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.
			errorText = 'メールアドレスとパスワードによるログインが無効になっています';
			break;
		case 'auth/weak-password':
			//Thrown if the password is not strong enough.
			errorText = '脆弱性が高いためパスワードを再度設定してください';
			break;
		case 'auth/network-request-failed':
			//default firebase error message: ' A network error (such as timeout, interrupted connection or unreachable host) has occurred.'
			errorText = 'ネットワークエラー：インターネットに接続されていません';
			break;
		case 'refresh':
			errorText = '';
			break;
		default:
			errorText = errorMessage;
			break;
	}
	return errorText;
};

// 入力値が未入力がどうかチェックする
export const checkIsEmpty = (text: string): boolean => {
	if (text == '') {
		return true;
	} else {
		return false;
	}
};

export const changeValidationMessageType = (isValid: boolean, isEmpty: boolean): string => {
	if (isValid) {
		return 'valid';
	} else if (isEmpty) {
		return 'blank';
	} else {
		return 'invalid';
	}
};

export const checkCanSignup = (isValid: {
	userName: boolean;
	email: boolean;
	password: boolean;
}): boolean => {
	if (isValid.userName && isValid.email && isValid.password) {
		return false;
	} else {
		return true;
	}
};

export const setUser = (userName: string, iconUrl: string, uid: string) => {
	db.collection('userList').doc(uid).set({
		userName: userName,
		iconURL: iconUrl,
		uid: uid,
	});
	db.collection('follower').doc('first').set({});
	db.collection('followee').doc('first').set({});
};
