import firebase from '../../../firebaseConfig';
import {db} from '../../../firebaseConfig'
import * as ImagePicker from 'expo-image-picker';
import { userDataDocResponse, userReviewDocResponse, userReviewsType, pickerResult } from '../../types/types';
  // ユーザが投稿したレビューの一覧と投稿数を取得
export const fetchAllUserReviews = (uid: string) => {
    const userFirestoreDocument = db.collection('userList').doc(uid)
    let userReviews: userReviewsType = []
    db.collectionGroup('reviews').where('user', '==', userFirestoreDocument).orderBy('createdAt', 'desc').get()
    .then(querySnapshot => {
        querySnapshot.forEach(doc => {
            let userReview = doc.data() as userReviewDocResponse
            userReviews.push(userReview)
        })
        let reviewNumber: number = userReviews.length
        setPostNumber(reviewNumber)
        setAllReviews(userReviews)
    })
}
    // ユーザーのアイコン画像を取得
    export const fetchUserIconImage = async(uid: string) => {
        const userProfileDocument = await db.collection('userList').doc(uid).get().then(doc => {
            let userProfileData = doc.data() as userDataDocResponse
            return userProfileData
        })
        userProfileDocument.iconURL != 'test-url' ? setUserIcon(userProfileDocument.iconURL) : setUserIcon('../assets/icon.png')
    }
    export const fetchUserName = (uid: string) => {
        const unsubscribe = db.collection('userList').doc(uid).onSnapshot(doc => {
            let userProfileData = doc.data() as userDataDocResponse
            setUserName(userProfileData.userName)
        })
        return () => {
            unsubscribe()
        }
    }
    export const fetchFollowers = (uid: string) => {
        let followers: string[] = []
        db.collection('userList').doc(uid).collection('follower').get().then(querySnapshot => {
            // followeeArrayの配列をこのタイミングでゼロにしないとフォロー数が変動するたびに累積されて出力される
            followers = []
            querySnapshot.forEach(doc => {
                followers.push(doc.id)
            })
            let followerNumber: number = followers.length - 1
            setFollower(followerNumber)
        })
    }
    export const fetchFollowees = (uid: string) => {
        let followees: string[] = []
        const unsubscribe = db.collection('userList').doc(uid).collection('followee').onSnapshot(querySnapshot => {
            followees = []
            querySnapshot.forEach(doc => {
                followees.push(doc.id)
            })
            let followeeNumber: number = followees.length - 1
            setFolowee(followeeNumber)
        })
        return () => {
            unsubscribe();
        }
    }
	// const setting = () => {
	// 	props.navigation.navigate('toSettingPage')
	// }
	// const toFolloweeList = () => {
	// 	props.navigation.navigate('followeeList')
	// }
	// const toFollowerList = () => {
	// 	props.navigation.navigate('followerList')
	// }
	// const tofindUser = () => {
	// 	props.navigation.navigate('findUser')
	// }
	export const changeIconUrl = async(uid: string):Promise<string | boolean> => {
		let selectedIcon = await selectIcon() as pickerResult
		if (!selectedIcon.cancelled) {
			let data = ''
			data = await fetchIconUrl(selectedIcon.uri, uid)
			return data
		} else {
        // 画像の変更をキャンセルした際にダイアログの表示を消す
            return false
		}
    }
	export const selectIcon = async(): Promise<ImagePicker.ImagePickerResult> => {
		let result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
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