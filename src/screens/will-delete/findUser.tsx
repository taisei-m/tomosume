import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SearchBar, Avatar } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { useDebounce } from 'use-debounce';
import { db } from '../../firebaseConfig';
import FollowButton from '../components/FollowButton';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../store/GlobalState';
import { userProfileDataType } from '../types/types';
import { candidateUesrsDataListType } from '../types/types';
import { StackProps } from '../types/types';

const FindUser = (props: StackProps) => {
	const [_searchedUserName, setSearchedUserName] = useState<string>('');
	// _searchUserNameの値が確定してから1秒後にvalueに_searchedUserNameを代入する
	const [value] = useDebounce(_searchedUserName, 800);
	const [_candidateUsersList, setCandidateUsersList] = useState<candidateUesrsDataListType>();

	//async-awaitに書き換える
	useEffect(() => {
		const candidateUsersIdList: string[] = [];
		let candidateUesrsDataList: candidateUesrsDataListType = [];
		db
			.collection('userList')
			.where('userName', '==', value)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					candidateUsersIdList.push(doc.id);
				});
			})
			.then(async () => {
				candidateUesrsDataList = await Promise.all(
					candidateUsersIdList.map(async (userId) => {
						let userProfileData;
						await db
							.collection('userList')
							.doc(userId)
							.get()
							.then((doc) => {
								userProfileData = doc.data() as userProfileDataType;
							});
						return userProfileData;
					}),
				);
			})
			.then(async () => {
				candidateUesrsDataList = await checkFollowExchange(candidateUesrsDataList);
			})
			.then(() => {
				setCandidateUsersList(candidateUesrsDataList);
			});
	}, [value]);
	// 検索結果のユーザをフォローしているかどうかの確認をする処理
	const checkFollowExchange = async (
		candidateUesrsDataList: candidateUesrsDataListType,
	): Promise<candidateUesrsDataListType> => {
		const userId = props.globalState.state.uid;
		const followeeUserIdList: string[] = [];
		const followeeList = await db.collection('userList').doc(userId).collection('followee').get();
		followeeList.forEach((data) => {
			followeeUserIdList.push(data.id);
		});
		//　自分のフォローリストと検索結果のユーザリストを比べる。　検索結果のユーザリストのユーザを一人一人取り出し、そのユーザが自分のフォローリストに含まれるかを検証する
		candidateUesrsDataList.forEach((doc) => {
			const candidateUserId = doc.uid;
			const isFollowExchange = followeeUserIdList.includes(candidateUserId);
			// フォローしている場合true, フォローしていない場合falseを代入
			isFollowExchange ? (doc.followExchange = true) : (doc.followExchange = false);
		});
		return candidateUesrsDataList;
	};

	const searchUsers = (userName: string) => {
		setSearchedUserName(userName);
	};
	const toUserDetailPage = (id) => {
		props.globalState.setFriendId(id);
		props.navigation.navigate('friendProfile');
	};

	return (
		<>
			<SearchBar
				placeholder="ユーザ名を入力してください"
				onChangeText={searchUsers}
				value={_searchedUserName}
				placeholderTextColor="grey"
				lightTheme
				containerStyle={{ backgroundColor: 'white' }}
				inputContainerStyle={{ backgroundColor: 'white' }}
				searchIcon={<Icon name="search" color="#fbd01d" />}
			/>
			<View>
				<FlatList
					style={styles.container}
					data={_candidateUsersList}
					keyExtractor={(item) => item.uid}
					renderItem={({ item }) => (
						<View style={styles.cell}>
							<TouchableOpacity
								onPress={() => {
									toUserDetailPage(item.uid);
								}}>
								<Avatar
									rounded
									containerStyle={{ marginLeft: 20, marginTop: 9 }}
									source={{ uri: item.iconURL }}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									toUserDetailPage(item.uid);
								}}>
								<View style={{ marginRight: '45%' }}>
									<Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
										{item.userName}
									</Text>
								</View>
							</TouchableOpacity>
							<FollowButton
								id={item.uid}
								isFollowExchange={item.followExchange}
								userId={props.globalState.state.uid}
							/>
						</View>
					)}
				/>
			</View>
		</>
	);
};

const FindUserWrapper = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalStateContainer]}>
			{(globalState) => <FindUser globalState={globalState} navigation={navigation} />}
		</Subscribe>
	);
};

export default FindUserWrapper;

const styles = StyleSheet.create({
	container: {
		marginTop: 0,
		backgroundColor: 'white',
	},
	cell: {
		flexDirection: 'row',
		borderStyle: 'solid',
		borderWidth: 0.5,
		borderColor: '#f5f5f5',
		height: 50,
	},
	text: {
		fontSize: 18,
		marginLeft: 15,
		marginTop: 15,
	},
});
