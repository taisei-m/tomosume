export const titleTextInput = (textType: string, passedEmail: string, _email: string): string => {
    let titleText = '';
    if (textType == '初期表示') {
        titleText = passedEmail + '\nへメールを送信しました';
    } else if (textType == '再送信') {
        titleText = _email + '\nへメールを再送信しました';
    } else if (textType == '再送信失敗') {
        titleText = _email + '\nへメールを再送信できませんでした';
    } else if (textType == '本人確認済') {
        titleText = _email + 'で登録されたアカウントは既に本人確認済です';
    }
    return titleText;
};

export const contentTextInput = (textType: string): string => {
    let contentText = '';
    const textSentEmailSuccesfully = 'メールを確認して本人確認をしてください。';
    const textSentEmailFailed = '30秒～1分後に再送信し直してください。';
    const textNotVertified = 'ログイン画面からログインしてください。';
    if (textType == '初期表示') {
        contentText = textSentEmailSuccesfully;
    } else if (textType == '再送信') {
        contentText = textSentEmailSuccesfully;
    }
    if (textType == '再送信失敗') {
        contentText = textSentEmailFailed;
    }
    if (textType == '本人確認済') {
        contentText = textNotVertified;
    }
    return contentText;
};