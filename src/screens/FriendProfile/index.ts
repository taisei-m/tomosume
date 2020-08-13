import { db } from '../../../firebaseConfig';
import {
	friendDataDocResponse,
	friendReviewDocResponse,
	friendReviewsType,
} from '../../types/types';

export const fetchFolloweeIds = async (uid: string): Promise<string[]> => {
	let followeeIds: string[] = [];
	const querySnapshot = await db.collection('userList').doc(uid).collection('followee').get();
	querySnapshot.forEach((doc) => {
		followeeIds.push(doc.id);
	});
	followeeIds = followeeIds.filter((n) => n !== 'first');
	return followeeIds;
};
type documentDataType = {
	iconURL: string;
	uid: string;
	userName: string;
	followee: firebase.firestore.DocumentData;
	follower: firebase.firestore.DocumentData;
};
//TODO:firebaseの型について調べる.
export const fetchReviews = async (friendId: string): Promise<friendReviewsType> => {
	const reviews: friendReviewsType = [];
	const ref = db.collection('userList').doc(friendId) as firebase.firestore.DocumentReference<
		documentDataType
	>;
	await db
		.collectionGroup('reviews')
		.where('user', '==', ref)
		.orderBy('createdAt', 'desc')
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				let review = doc.data() as friendReviewDocResponse;
				reviews.push(review);
			});
		});
	return reviews;
};

//TODO:初期化のチェックをスルーすることについて調べる.
export const fetchFriendDescription = async (friendId: string): Promise<friendDataDocResponse> => {
	let friendDescription!: friendDataDocResponse;
	await db
		.collection('userList')
		.doc(friendId)
		.get()
		.then((doc) => {
			friendDescription = doc.data() as friendDataDocResponse;
		});
	return friendDescription;
};

export const pressFollowButton = (uid: string, friendId: string, isFollow: boolean): boolean => {
	if (isFollow) {
		db.collection('userList').doc(uid).collection('followee').doc(friendId).delete();
		db.collection('userList').doc(friendId).collection('follower').doc(uid).delete();
		return false;
	} else {
		db.collection('userList').doc(uid).collection('followee').doc(friendId).set({});
		db.collection('userList').doc(friendId).collection('follower').doc(uid).set({});
		return true;
	}
};
