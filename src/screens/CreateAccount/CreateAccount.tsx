import React, { useEffect } from "react";
import { useState } from "react";
import { View, TouchableOpacity, Linking } from "react-native";
import { Input } from "react-native-elements";
import firebase from "../../../firebaseConfig";
import { Subscribe } from "unstated";
import GlobalContainer from "../../store/GlobalState";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "./style";
import { NavUnloginParamList, ContainerProps } from "@/types/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { validate } from "../../utils/validateAuthInfo";
import { Text } from "../../components/atoms/Text";
import { Button } from "../../components/molecules/Button";

const CreateAccount: React.FC<NavigationProps & ContainerProps> = (props) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailValidationMessage, setEmailValidationMessage] = useState<string>(
    ""
  );
  const [passwordValidationMessage, setPasswordValidationMessage] = useState<
    string
  >("");
  const [canSignup, setCanSignup] = useState<boolean>(false);
  const [_defaultIconUrl, setDefaultIconUrl] = useState<string>("");

  // firebase storageから画像のurlを取得する処理
  useEffect(() => {
    (async () => {
      const storageRef = firebase
        .storage()
        .ref("user/default/" + "user-icon.png");
      const url = await storageRef.getDownloadURL();
      setDefaultIconUrl(url);
    })();
  }, []);

  useEffect(() => {
    if (
      username &&
      emailValidationMessage === "ok" &&
      passwordValidationMessage === "ok"
    ) {
      setCanSignup(true);
    }
  }, [username, emailValidationMessage, passwordValidationMessage]);

  useEffect(() => {
    const validationMessage = validate(email, "email");
    if (validationMessage) {
      setEmailValidationMessage(validationMessage);
    } else {
      setEmailValidationMessage("");
    }
  }, [email]);

  useEffect(() => {
    const validationMessage = validate(password, "password");
    if (validationMessage) {
      setPasswordValidationMessage(validationMessage);
    } else {
      setPasswordValidationMessage("");
    }
  }, [password]);

  const signup = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function (error) {
        console.log("errorCode: " + error.code);
        console.log("errorMessage: " + error.message);
        return error;
      })
      .then(async (result) => {
        if (result.user) {
          const user = result.user;
          props.globalState.setCreateAccountEmail(user.email);

          const db = firebase.firestore().collection("userList").doc(user.uid);
          db.set({
            userName: username,
            iconURL: _defaultIconUrl,
            uid: user.uid
          });
          db.collection("follower").doc("first").set({});
          db.collection("followee").doc("first").set({});
          firebase.auth().languageCode = "ja";
          //なんでかわからんけどsendEmailVerificationメソッドこのファイルやとエラーでやんけどresendEmailで使うと[Error: We have blocked all requests from this device due to unusual activity. Try again later.]のエラーcatchする。
          await user
            .sendEmailVerification()
            .then(function () {
              props.navigation.navigate("ResendEmail");
            })
            .catch(function () {});
        } else {
          console.log("予期せぬエラーが発生しました CreateAccount.tsx");
        }
      });
  };

  return (
    <KeyboardAwareScrollView style={styles.keyboardScrollView}>
      <View style={styles.container}>
        <Input
          containerStyle={{ width: "80%", marginBottom: 10 }}
          placeholder="メールアドレス"
          leftIcon={{ type: "ant-design", name: "mail" }}
          leftIconContainerStyle={{ width: 24, marginRight: 10 }}
          onChangeText={setEmail}
          value={email}
        />
        <Text
          color={emailValidationMessage === "ok" ? "#48D1CC" : "red"}
          size={16}
          textAlign="center"
        >
          {emailValidationMessage}
        </Text>
        <Input
          containerStyle={{ width: "80%", marginTop: 20, marginBottom: 10 }}
          placeholder="パスワード"
          value={password}
          leftIcon={{ type: "ant-design", name: "lock" }}
          leftIconContainerStyle={{ width: 24, marginRight: 10 }}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <View>
          <Text
            color={passwordValidationMessage === "ok" ? "#48D1CC" : "red"}
            size={16}
            textAlign="center"
          >
            {passwordValidationMessage}
          </Text>
        </View>
        <Input
          containerStyle={{ width: "80%", marginTop: 20, marginBottom: 10 }}
          placeholder="ユーザ名（アプリ内変更可能）"
          value={username}
          leftIcon={{ type: "feather", name: "user" }}
          leftIconContainerStyle={{ width: 24, marginRight: 10 }}
          onChangeText={setUsername}
        />
        <View style={{ width: "80%", marginTop: 20 }}>
          <Button
            disabled={!canSignup}
            onPress={signup}
            color={!canSignup ? "lightgrey" : "#fbd01d"}
          >
            新規登録
          </Button>
        </View>
        <View style={styles.alreadyHaveAccountBtnArea}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("LoginScreen")}
          >
            <Text size={16} decorationLine="underline" color="grey">
              {" "}
              既にアカウントをお持ちの方はこちら{" "}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: "65%", marginTop: 40 }}>
          <Text size={16} color="grey">
            登録することで、
            <Text
              size={16}
              onPress={() =>
                Linking.openURL("https://tomosume.flycricket.io/privacy.html")
              }
              decorationLine="underline"
              color="#5E9CFE"
            >
              プライバシーポリシー
            </Text>
            に同意したことになります。
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

type CreateAccountNavigationProps = StackNavigationProp<
  NavUnloginParamList,
  "CreateAccount"
>;

type NavigationProps = {
  navigation: CreateAccountNavigationProps;
};

export const CreateAccountWrapper: React.FC<NavigationProps> = ({
  navigation
}) => {
  return (
    <Subscribe to={[GlobalContainer]}>
      {(globalState: GlobalContainer) => (
        <CreateAccount globalState={globalState} navigation={navigation} />
      )}
    </Subscribe>
  );
};
