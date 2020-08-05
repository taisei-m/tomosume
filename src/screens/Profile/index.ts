import firebase from '../../../firebaseConfig';
import {db} from '../../../firebaseConfig'
import * as ImagePicker from 'expo-image-picker';
import { userDataDocResponse, userReviewDocResponse, userReviewsType, pickerResult } from '../../types/types';

// ユーザが投稿したレビューの一覧と投稿数を取得
export const fetchAllUserReviews = async(uid: string):Promise<userReviewsType> => {
    const userFirestoreDocument = db.collection('userList').doc(uid)
    let userReviews: userReviewsType = []
    await db.collectionGroup('reviews').where('user', '==', userFirestoreDocument).orderBy('createdAt', 'desc').get()
    .then(querySnapshot => {
        querySnapshot.forEach(doc => {
            let userReview = doc.data() as userReviewDocResponse
            userReviews.push(userReview)
        })
    })
    return userReviews
}

// ユーザーのアイコン画像を取得
export const fetchUserIconImage = async(uid: string):Promise<userDataDocResponse> => {
    return await db.collection('userList').doc(uid).get().then(doc => {
        const userProfileData = doc.data() as userDataDocResponse
        return userProfileData
    })
}

export const fetchFollowers = async(uid: string): Promise<number> => {
    let followers: string[] = []
    let followerNumber = 0
    //ここでawaitをしないとreturnにで返される値はforEachが実行される前のものとなるので0となる.
    await db.collection('userList').doc(uid).collection('follower').get().then(querySnapshot => {
        // followeeArrayの配列をこのタイミングでゼロにしないとフォロー数が変動するたびに累積されて出力される
        followers = []
        querySnapshot.forEach(doc => {
            followers.push(doc.id)
        })
    followerNumber = followers.length - 1
    })
    return followerNumber
}

export const changeIconUrl = async(uid: string):Promise<string> => {
    const selectedIcon = await selectIcon() as pickerResult
	if (!selectedIcon.cancelled) {
		let data = ''
		data = await fetchIconUrl(selectedIcon.uri, uid)
		return data
	} else {
        // 画像の変更をキャンセルした際にダイアログの表示を消す
        return 'cancel'
	}
}

export const selectIcon = async(): Promise<ImagePicker.ImagePickerResult> => {
	const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
	mediaTypes: ImagePicker.MediaTypeOptions.All,
	allowsEditing: true,
	aspect: [4, 3],
	quality: 1,
	})
	return result
}

export const fetchIconUrl = async(uri:string, imageName:string): Promise<string> => {
	const storageRef = firebase.storage().ref('user/icon/' + imageName);
	const response = await fetch(uri);
	const blob = await response.blob();
	await storageRef.put(blob)
	const url = await storageRef.getDownloadURL()
	return url
}

export const setIconUrlOnFirestore = (uid: string, url:string | boolean):Promise<void> => {
	return db.collection('userList').doc(uid)
	.set({
	iconURL: url
	}, {merge: true})
}