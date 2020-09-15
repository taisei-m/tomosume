import { db } from '../../../firebaseConfig';
import { userDescriptionType, UserDescriptionsType } from '../../types/types';

export const fetchFolloweeIds = async (friendId: string): Promise<string[]> => {
	let followeeIds: string[] = [];
	const querySnapshot = await db.collection('userList').doc(friendId).collection('followee').get();
	querySnapshot.forEach((doc) => {
		followeeIds.push(doc.id);
	});
	followeeIds = followeeIds.filter((id) => id != 'first');
	return followeeIds;
};

export const fetchFriendFolloweeDescriptions = async (
	followeeIds: string[],
): Promise<UserDescriptionsType> => {
	let userDescription: userDescriptionType;
	const friendFolloweeDescriptions = await Promise.all(
		followeeIds.map(async (docId) => {
			await db
				.collection('userList')
				.doc(docId)
				.get()
				.then((doc) => {
					userDescription = doc.data() as userDescriptionType;
				});
			return userDescription;
		}),
	);
	return friendFolloweeDescriptions;
};

export const checkFollowExchange = async (
	uid: string,
	followeeDescriptions: UserDescriptionsType,
): Promise<UserDescriptionsType> => {
	let myFolloweeIds: string[] = [];
	const followees = await db.collection('userList').doc(uid).collection('followee').get();
	followees.forEach((user) => {
		myFolloweeIds.push(user.id);
	});
	myFolloweeIds = myFolloweeIds.filter((id) => id != 'first');
	followeeDescriptions.forEach((user) => {
		let followeeId = user.uid;
		let isFollowExchange = myFolloweeIds.includes(followeeId);
		isFollowExchange ? (user.followExchange = true) : (user.followExchange = false);
	});
	return followeeDescriptions;
};
