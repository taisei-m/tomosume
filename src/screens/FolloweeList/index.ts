import { db } from '../../../firebaseConfig';
import { userDescriptionType, followeesType } from '../../types/types';

export const fetchFollowees = async (uid: string): Promise<string[]> => {
	let followeeIds: string[] = [];
	await db
		.collection('userList')
		.doc(uid)
		.collection('followee')
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				followeeIds.push(doc.id);
			});
		});
	followeeIds = followeeIds.filter((id) => id != 'first');
	return followeeIds;
};

export const getFolloweeDescriptions = async (followeeIds: string[]): Promise<followeesType> => {
	let followeesDescription: followeesType = [];
	let userDescription: userDescriptionType;
	followeesDescription = await Promise.all(
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
	return followeesDescription;
};
