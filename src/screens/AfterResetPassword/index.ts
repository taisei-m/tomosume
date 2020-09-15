export const titleTextInput = (textType: string, passedEmail: string, _email: string): string => {
    let titleText = '';
    if (textType == '初期表示') {
        titleText = passedEmail + '\nへパスワード再設定メールを送信しました';
    } else if (textType == '再送信') {
        titleText = _email + '\nへメールを再送信しました';
    }
    return titleText;
};