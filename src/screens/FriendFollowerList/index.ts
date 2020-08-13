import { db } from '../../../firebaseConfig';
import { userDescriptionType, UserDescriptionsType } from '../../types/types';

export const fetchFollowerIds = async(friendId: string):Promise<string[]> => {
	let followerIds: string[] = [];
	const querySnapshot = await db.collection('userList').doc(friendId).collection('follower').get();
	querySnapshot.forEach(doc => {
		followerIds.push(doc.id);
	});
	followerIds = followerIds.filter(id => id != 'first');
	return followerIds;
};

export const fetchFriendFollowerDescriptions = async(followerIds:string[]):Promise<UserDescriptionsType> => {
	let userDescription: userDescriptionType;
	const friendFollowerDescriptions = await Promise.all(followerIds.map(async (docId) => {
		await db.collection('userList').doc(docId).get()
			.then(doc => {
				userDescription = doc.data() as userDescriptionType;
			});
		return userDescription;
	}));
	return friendFollowerDescriptions;
};

export const checkFollowExchange = async(uid: string, followerDescriptions: UserDescriptionsType):Promise<UserDescriptionsType> => {
	let myFolloweeIds: string[] = [];
	const followees = await db.collection('userList').doc(uid).collection('followee').get();
	followees.forEach(user => {
		myFolloweeIds.push(user.id);
	});
	myFolloweeIds = myFolloweeIds.filter( id => id != 'first');
	followerDescriptions.forEach(user => {
		let followeeId = user.uid;
		let isFollowExchange = myFolloweeIds.includes(followeeId);
		isFollowExchange ? user.followExchange = true : user.followExchange = false;
	});
	return followerDescriptions;
};