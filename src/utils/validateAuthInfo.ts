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

const validateEmail = (inputedText: string) => {
	const isValidated = checkEmailPattern(inputedText);
	if (inputedText === '') {
		return '';
	}
	if (isValidated) {
		return 'ok';
	} else {
		return 'メールアドレスの形式が正しくありません';
	}
};

const validatePassword = (inputedText: string) => {
	const isValidated = checkPasswordPattern(inputedText);
	if (inputedText === '') {
		return '';
	}
	if (isValidated) {
		return 'ok';
	} else {
		return '半角英数字を含む6文字以上にしてください';
	}
};

export const validateAuth = (inputedText: string, inputedPlace: string) => {
	if (inputedPlace === 'email') {
		const validationMessage = validateEmail(inputedText);
		return validationMessage;
	}
	if (inputedPlace === 'password') {
		const validationMessage = validatePassword(inputedText);
		return validationMessage;
	}
};
