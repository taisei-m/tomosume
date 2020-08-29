//Signupボタンを押した時に表示されるエラーメッセージの内容
export const errorMessageAboveSubmitButtonInput = (
	errorCode: string,
	errorMessage: string,
): string => {
	let outputErrorText = '';
	switch (errorCode) {
	case 'email is blank':
		outputErrorText = 'メールアドレスが未入力です';
		break;
	case 'email did not match regular expression':
		outputErrorText = 'メールアドレスの形式が正しくありません';
		break;
	case 'auth/invalid-email':
		//Thrown if the email address is not valid.
		outputErrorText = '有効なメールアドレスを入力してください';
		break;
	case 'auth/missing-android-pkg-name':
		//An Android package name must be provided if the Android app is required to be installed.
		outputErrorText =
				'An Android package name must be provided if the Android app is required to be installed';
		break;
	case 'auth/missing-continue-uri':
		//An Android package name must be provided if the Android app is required to be installed.
		outputErrorText =
				'An Android package name must be provided if the Android app is required to be installed';
		break;
	case 'auth/missing-ios-bundle-id':
		//A continue URL must be provided in the request.
		outputErrorText = 'A continue URL must be provided in the request';
		break;
	case 'auth/invalid-continue-uri':
		//An iOS Bundle ID must be provided if an App Store ID is provided.
		outputErrorText = 'An iOS Bundle ID must be provided if an App Store ID is provided';
		break;
	case 'auth/unauthorized-continue-uri':
		//The continue URL provided in the request is invalid.
		outputErrorText = 'The continue URL provided in the request is invalid';
		break;
	case 'auth/user-not-found':
		//The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase console.
		outputErrorText = 'このメールアドレスは登録されていません';
		break;
	case 'auth/network-request-failed':
		//default firebase error message: ' A network error (such as timeout, interrupted connection or unreachable host) has occurred.'
		outputErrorText = 'ネットワークエラー：インターネットに接続されていません';
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
