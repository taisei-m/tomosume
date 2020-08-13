import {db} from '../../../firebaseConfig';
import { UserDescriptionsType, userDescriptionType } from '../../types/types';

export const checkFollowExchange = async(uid: string, candidateUesrsDataList: UserDescriptionsType): Promise<UserDescriptionsType> => {
	const followeeUserIdList: string[] = [];
	const followeeList = await db.collection('userList').doc(uid).collection('followee').get();
	followeeList.forEach((data) => {
		followeeUserIdList.push(data.id);
	});
	//　自分のフォローリストと検索結果のユーザリストを比べる。　検索結果のユーザリストのユーザを一人一人取り出し、そのユーザが自分のフォローリストに含まれるかを検証する
	candidateUesrsDataList.forEach((doc) => {
		let candidateUserId = doc.uid;
		let isFollowExchange = followeeUserIdList.includes(candidateUserId);
		// フォローしている場合true, フォローしていない場合falseを代入
		isFollowExchange ? doc.followExchange = true : doc.followExchange = false;
	});
	return candidateUesrsDataList;
};

export const showFrinedCandidates = async(inputedName: string): Promise<UserDescriptionsType> => {
	let candidateFriendIds: string[] = [];
	let candidateFriendsDescriptions: UserDescriptionsType = [];
	await db.collection('userList').where('userName', '==', inputedName).get()
		.then(querySnapshot => {
			querySnapshot.forEach(doc => {
				candidateFriendIds.push(doc.id);
			});
		});
	candidateFriendsDescriptions = await Promise.all(candidateFriendIds.map(async(uid) => {
		let userDescription = {};
		await db.collection('userList').doc(uid).get()
			.then(doc => {
				userDescription = doc.data() as userDescriptionType;
			});
		return userDescription as userDescriptionType;
	}));
	return candidateFriendsDescriptions;
};