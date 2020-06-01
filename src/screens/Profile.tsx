import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity, SafeAreaView, FlatList,} from 'react-native';
import { Subscribe } from 'unstated';
import firebase from '../../firebaseConfig';
import {db} from '../../firebaseConfig'
import * as ImagePicker from 'expo-image-picker';
import GlobalStateContainer from '../containers/GlobalState';
import ProfileNumber from '../components/ProfileNumber';
import ProfileReviews from '../components/ProfileReviews';
import {pickerResult} from '../types/types'
import {userReviewDocResponse} from '../types/types'
import {userDataDocResponse} from '../types/types'
import {userReviewsType} from '../types/types'

const Profile = (props: any) => {
	const [userName, setUserName] = useState<string>()
	const [followee, setFollowee] = useState<number>(0)
	const [follower, setFollower] = useState<number>(0)
	const [postNumber, setPostNumber] = useState<number>(0)
	const [allReviews, setAllReviews] = useState<userReviewsType>([])
	const [userIcon, setUserIcon] = useState<string>();

	useEffect(() => {
		const userId = props.globalState.state.userData.uid
		console.log(props.globalState.state.userData.uid, 'uid')
		const userFirestoreDocument = firebase.firestore().collection('userList').doc(userId)
		let userReviews: userReviewsType = []
		db.collectionGroup('reviews').where('user', '==', userFirestoreDocument).orderBy('createdAt', 'desc').get()
			.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				let userReview = doc.data() as userReviewDocResponse
				userReviews.push(userReview)
			})
			let reviewNumber: number = userReviews.length
			setPostNumber(reviewNumber)
			setAllReviews(userReviews)
			})
	}, [])
	useEffect(() => {
		(async () => {
			const userId = props.globalState.state.userData.uid
			const userProfileDocument = await db.collection('userList').doc(userId)
			.get().then(function(doc) {
			let userProfileData = doc.data() as userDataDocResponse
			return userProfileData
			})
			userProfileDocument.iconURL != 'test-url' ? setUserIcon(userProfileDocument.iconURL) : setUserIcon('file:///Users/oxyu8/Downloads/okuse_yuya.jpg')
		})();
	}, [])

	useEffect(() => {
		const userId = props.globalState.state.userData.uid
		firebase.firestore().collection('userList').doc(userId)
		.get().then(function(doc) {
			let userProfileData = doc.data() as userDataDocResponse
			setUserName(userProfileData.userName)
		})
	},[])

	useEffect(() => {
		const userId = props.globalState.state.userData.uid
		let followeeArray:string[] = []
		db.collection('userList').doc(userId).collection('followee')
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
			followeeArray.push(doc.id)
			})
			let followeeNumber: number = followeeArray.length-1
			setFollowee(followeeNumber)
	})
	//なんで俺any型使ってるの？？
	},[])
	useEffect(() => {
		const userId = props.globalState.state.userData.uid
		let followerArray:string[] = []
		db.collection('userList').doc(userId).collection('follower')
		.get()
		.then(function(querySnapshot:any) {
			querySnapshot.forEach(function(doc:any) {
			followerArray.push(doc.id)
			})
			let followerNumber: number = followerArray.length-1
			setFollower(followerNumber)
	})
	},[])
	const setting = () => {
		props.navigation.navigate('toSettingPage')
	}
	const toFolloweeList = () => {
		props.navigation.navigate('followeeList')
	}
	const toFollowerList = () => {
		props.navigation.navigate('followerList')
	}
	const imageInput = (gotresult: string) =>{
		setUserIcon(gotresult);
	}
	const changeIcon = async() => {
		const _result = await changeIconUrl()
		await setIconToFirestore(_result);
		imageInput(_result);
	}
	const changeIconUrl = async():Promise<string> => {
		let result = await selectIconPicture() as pickerResult
		let data = ''
		data = await uploadResult(result.uri, 'test-image7')
		return data
	}
	// 写真の変更をキャンセルした際の処理を書く必要あり
	const selectIconPicture = async(): Promise<ImagePicker.ImagePickerResult> => {
		let result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		})
		return result
	}
	const uploadResult = async (uri:string, imageName:string): Promise<string> => {
		const storageRef = firebase.storage().ref('user/icon/' + imageName);
		const response = await fetch(uri);
		const blob = await response.blob();
		await storageRef.put(blob)
		const url = await storageRef.getDownloadURL()
		return url
	}
	const setIconToFirestore = (url:string):Promise<void> => {
		console.log('3a')
		const userId = props.globalState.state.userData.uid
		return db.collection('userList').doc(userId)
		.set({
			iconURL: url
		}, {merge: true})
	}

	return (
		<View style={styles.container}>
			<View style={{flexDirection: 'row', justifyContent: 'center',}}>
			<View>
				<View style={{alignItems: 'center', marginTop: 50}}>
					<TouchableOpacity
					onPress={changeIcon}
					>
					<Image
						source={{ uri: userIcon }}
						style = {styles.userIcon}
					/>
					</TouchableOpacity>
				</View>
				<View style={{alignItems: 'center', marginTop: 10}}>
					<Text style={styles.userName}>{userName}</Text>
				</View>
			</View>
			<View style={{marginLeft: 30}}>
				<View
					style={{
					justifyContent: 'center',
					flexDirection: 'row',
					marginTop: 70,
					}}
				>
					<ProfileNumber
					number={postNumber}
					itemName='post'
					/>
					<ProfileNumber
					number={follower}
					itemName="フォロー"
					press={toFollowerList}
					centerClass={{width: 50, height: 50, marginHorizontal: 30}}
					/>
					<ProfileNumber
					number={followee}
					itemName="フォロワー"
					press={toFolloweeList}
					/>
				</View>
				<View style={{ alignItems: 'center', marginTop: 20, flexDirection: 'row'}}>
					<TouchableOpacity
					style={styles.editButton}
					onPress={setting}
					>
					<Text
						style={styles.editText}>
						{'編集'}
					</Text>
					</TouchableOpacity>
				</View>
			</View>
			</View>
			<SafeAreaView style={styles.list}>
			<FlatList
				data={allReviews}
				renderItem={
					({ item }) =>
					<ProfileReviews
						shopName={item.shopName}
						shopAddress={item.shopAddress}
						category={item.category}
						price={item.price}
						favorite={item.favoriteMenu}
					/>
				}
				keyExtractor={item => item.shopId}
			/>
			</SafeAreaView>
		</View>
	);
	}
	const ProfileWrapper = ({ navigation }) => {
	return (
			<Subscribe to={[GlobalStateContainer]}>
				{
					globalState => <Profile globalState={globalState} navigation = {navigation} />
				}
			</Subscribe>
	);
	}

	export default ProfileWrapper;

	const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff'
	},
	userName: {
		color: 'black',
		fontSize: 18,
		fontWeight: '700',
	},
	userIcon: {
		width: 90,
		height: 90,
		borderRadius: 90/ 2,
		borderColor: 'white',
		borderWidth: 2,
	},
	listItem: {
		margin: 15,
	},
	shopName: {
		fontSize: 25
	},
	favoriteMenu: {
		margin: 10
	},
	number: {
		fontSize: 28
	},
	numberKey: {
		fontSize: 12,
		textAlign: 'center',
		color: '#818181'
	},
	editButton: {
		width: 180,
		backgroundColor:"white",
		borderRadius:15,
		height:35,
		alignItems:"center",
		justifyContent:"center",
		borderColor: '#818181',
		borderWidth: 1,
	},
	editText: {
		color: 'black',
		fontWeight: '500'
	},
	list: {
		marginTop: 20,
		marginBottom: 350
	},
	})
