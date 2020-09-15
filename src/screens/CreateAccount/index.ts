import { ErorrMessageInput } from '@/types/types';

// ユーザー名のvalidation
export const testUsernamePattern = (username: string): boolean => {
    if (username.length == 0) {
        return false;
    } else if (username.length > 13) {
        return false;
    } else {
        return true;
    }
};

export const usernameErrorMessageInput = (passedErrorMessageType: string): ErorrMessageInput => {
    const allowText = 'ok ✓';
    const denyText = '*13文字以内で入力してください';
    const blankText = '';
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
            errorMessage = blankText;
            errorMessageColorIsRed = true;
            break;
        case 'fillBlank':
            errorMessage = fillblankText;
            break;
    }

    let errorMessageInfo: ErorrMessageInput = {
        errorMessage: errorMessage,
        errorMessageColorIsRed: errorMessageColorIsRed,
    }

    return errorMessageInfo;
};

export const emailErrorMessageInput = (passedErrorMessageType: string):ErorrMessageInput => {
    const allowText = 'ok ✓';
    const denyText = '*メールアドレスの形式が正しくありません';
    const blankText = '';
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
            errorMessage = blankText;
            errorMessageColorIsRed = true;
            break;
        case 'fillBlank':
            errorMessage = fillblankText;
            break;
    }

    let errorMessageInfo : ErorrMessageInput = {
        errorMessage: errorMessage,
        errorMessageColorIsRed: errorMessageColorIsRed
    }

    return errorMessageInfo;
};

export const passwordErrorMessageInput = (passedErrorMessageType: string):ErorrMessageInput => {
    const allowText = 'ok ✓';
    const denyText = '*半角英数字を含む6文字以上にしてください';
    const blankText = '';
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
            errorMessage = blankText;
            errorMessageColorIsRed = true;
            break;
        case 'fillBlank':
            errorMessage = fillblankText;
            break;
    }

    let errorMessageInfo: ErorrMessageInput = {
        errorMessage: errorMessage,
        errorMessageColorIsRed: errorMessageColorIsRed
    };
    
    return errorMessageInfo;
};

//Signupボタンを押した時に表示されるエラーメッセージの内容
export const signupErrorTextInput = (errorCode: string, errorMessage: string): string => {
    let outputErrorText = '';
    switch (errorCode) {
        case 'auth/email-already-in-use':
            //Thrown if there already exists an account with the given email address.
            outputErrorText = 'このメールアドレスは既に使用されています';
            break;
        case 'auth/invalid-email':
            //Thrown if the email address is not valid.
            outputErrorText = '有効なメールアドレスを入力してください';
            break;
        case 'auth/operation-not-allowed':
            //Thrown if email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.
            outputErrorText = 'メールアドレスとパスワードによるログインが無効になっています';
            break;
        case 'auth/weak-password':
            //Thrown if the password is not strong enough.
            outputErrorText = '脆弱性が高いためパスワードを再度設定してください';
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