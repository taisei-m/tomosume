import { db } from '../../../firebaseConfig';
import firebase from '../../../firebaseConfig';
import { ReviewDocResponse, ReviewsDocResponse, User } from '../../types/types';

export const fetchFolloweeIds = async (uid: string): Promise<string[]> => {
	const querySnapshot = await db.collection('userList').doc(uid).collection('followee').get();
	const followeeIds = querySnapshot.docs.map((doc) => {
		return doc.id;
	});
	return followeeIds;
};

export const convertToReference = async (
	followeeIds: string[],
): Promise<firebase.firestore.DocumentReference<User>[]> => {
	followeeIds = followeeIds.filter((n) => n != 'first');
	const convertedFollowees = followeeIds.map((uid) => {
		let reference = db.collection('userList').doc(uid) as firebase.firestore.DocumentReference<User>;
		return reference;
	});
	return convertedFollowees;
};

export const fetchReviews = async (
	queryDocsSnapshot: firebase.firestore.QueryDocumentSnapshot[],
): Promise<ReviewsDocResponse> => {
	const reviews: ReviewsDocResponse = await Promise.all(
		queryDocsSnapshot.map(async (item) => {
			const review = item.data() as ReviewDocResponse;
			console.log(review.shopAddress);
			review.key = item.id;
			const userProfile = await review.user.get();
			review.userName = userProfile.get('userName');
			review.iconURL = userProfile.get('iconURL');
			review.userId = userProfile.id;
			return review;
		}),
	);
	return reviews;
};
