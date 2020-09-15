import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import { db } from '../../firebaseConfig';
import { followButtonProps } from '../types/types';

const FollowButton = (props: followButtonProps) => {
	// フォロー中であるかいないかを定義する変数
	const [_hasFollowd, setHasFollowed] = useState<boolean>(true);
	// 友達のフォロー・フォロワーリストに自分が含まれている時、自分をフォローできないようにする
	const [isYourId, setIsYourId] = useState<boolean>(true);

	useEffect(() => {
		if (props.isFollowExchange == true) {
			setHasFollowed(true);
		} else {
			setHasFollowed(false);
		}
	}, []);
	useEffect(() => {
		props.id == props.userId ? setIsYourId(true) : setIsYourId(false);
	}, []);

	const pressFollowButton = (id: string) => {
		// フォロー中であるかないかで場合分け
		if (_hasFollowd) {
			db.collection('userList').doc(props.userId).collection('followee').doc(id).delete();
			db.collection('userList').doc(id).collection('follower').doc(props.userId).delete();
		} else {
			db.collection('userList').doc(props.userId).collection('followee').doc(id).set({});
			db.collection('userList').doc(id).collection('follower').doc(props.userId).set({});
		}
		// ボタンの色を変更する
		setHasFollowed(!_hasFollowd);
	};

	return (
		<TouchableOpacity
			style={_hasFollowd ? styles.followButton : styles.notFollowButton}
			onPress={() => {
				pressFollowButton(props.id);
			}}
			disabled={isYourId}>
			{_hasFollowd ? (
				<Text style={{ color: 'white' }}>フォロー中</Text>
			) : (
				<Text style={{ color: 'white' }}>フォロー</Text>
			)}
		</TouchableOpacity>
	);
};

export default FollowButton;

const styles = StyleSheet.create({
	followButton: {
		width: 100,
		backgroundColor: '#d3d3d3',
		borderRadius: 15,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: '#d3d3d3',
		borderWidth: 1,
		position: 'absolute',
		top: 10,
		right: 10,
	},
	notFollowButton: {
		width: 100,
		backgroundColor: '#fbd01d',
		borderRadius: 15,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: '#fbd01d',
		borderWidth: 1,
		position: 'absolute',
		top: 10,
		right: 10,
	},
});
