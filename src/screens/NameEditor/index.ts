import { userDescriptionType } from '../../types/types';
import {db} from '../../../firebaseConfig';

export const fetchUserDescription = async(uid: string):Promise<userDescriptionType> => {
	let userDescription!: userDescriptionType;
	await db.collection('userList').doc(uid).get()
		.then(doc => {
			userDescription = doc.data() as userDescriptionType;
		});
	return userDescription;
};

export const updateUserName = (uid: string, updatedName: string) => {
	db.collection('userList').doc(uid).update({
		userName: updatedName
	});
};