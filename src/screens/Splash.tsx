import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import firebase from '../../firebaseConfig';
import { Subscribe } from 'unstated';
import GlobalContainer from '../store/GlobalState';
import { useEffect } from 'react';
import { ContainerProps } from '../types/types';

const Splash = (props: ContainerProps) => {
	//globalStateのisSplashをfalseにする関数
	const SplashFalse = () => {
		props.globalState.setSplashFalse();
	};
	//認証状態の取得、状態に応じて画面遷移
	const checkIsAuthed = async () => {
		firebase.auth().onAuthStateChanged(function (user) {
			let isnotAuthed;
			let emailVerified;
			if (user) {
				// User is signed in.
				// アカウント作成するとfirebaseに認可される。
				// resendEmailにnavigatorを使って遷移しようとするとnavigaotorの仕様上index.jsxから評価しなおす。
				// index.jsx → Splash.jsxが読まれここの部分が実行される。なのでここでメールを確認したかどうかを見てisSignoutに"true"を入れる。
				emailVerified = user.emailVerified;
				if (emailVerified == true) {
					props.globalState.setUid(user.uid);
					isnotAuthed = 'false';
				} else if (emailVerified == false) {
					isnotAuthed = 'true';
				}
			} else {
				// No user is signed in.
				isnotAuthed = 'true';
			}
			props.globalState.setSignout(isnotAuthed);
			return;
		});
	};

	useEffect(() => {
		(async () => {
			await checkIsAuthed(); //他にも欲しいデータあって通信したかったからpromiseAll使ったりして纏めて
			setTimeout(SplashFalse, 1000);
		})();
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.splashText}>Loading...</Text>
		</View>
	);
};

const SplashWrapper = () => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{(globalState: GlobalContainer) => <Splash globalState={globalState} />}
		</Subscribe>
	);
};

export default SplashWrapper;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},
	splashText: {
		fontSize: 24,
		color: 'black',
	},
});
