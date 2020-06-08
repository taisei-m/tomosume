import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity, SafeAreaView, FlatList,} from 'react-native';
import { Icon } from 'react-native-elements'
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
//@ts-ignore
import { ProgressDialog } from 'react-native-simple-dialogs';

//TODO: 初期のアイコン画像を設定する

const Profile = (props: any) => {
	const [_userName, setUserName] = useState<string>()
	const [_followee, setFollowee] = useState<number>(0)
	const [_follower, setFollower] = useState<number>(0)
	const [_postNumber, setPostNumber] = useState<number>(0)
	const [_allReviews, setAllReviews] = useState<userReviewsType>([])
	const [_userIcon, setUserIcon] = useState<string>();
	const [isRefreshed, setIsRefreshed] = useState<boolean>(false)
	const [refreshing, setRefreshing] = useState<boolean>(false)
	const [progressVisible , setProgressVisible] = useState<boolean>(false)
  // ユーザが投稿したレビューの一覧と投稿数を取得
	useEffect(() => {
		const userId = props.globalState.state.uid
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
				setRefreshing(false)
			})
		}, [isRefreshed])
	// ユーザーのアイコン画像を取得
	useEffect(() => {
		(async () => {
		const userId = props.globalState.state.uid
		const userProfileDocument = await db.collection('userList').doc(userId)
		.get().then(function(doc) {
			let userProfileData = doc.data() as userDataDocResponse
			return userProfileData
		})
		userProfileDocument.iconURL != 'test-url' ? setUserIcon(userProfileDocument.iconURL) : setUserIcon('../../assets/okuse_yuya.jpg')
		})();
	}, [])
	// ユーザの名前を取得
	useEffect(() => {
		const userId = props.globalState.state.uid
		const unsubscribe = firebase.firestore().collection('userList').doc(userId)
		.onSnapshot(function(doc) {
		let userProfileData = doc.data() as userDataDocResponse
		setUserName(userProfileData.userName)
		})
		return () => {
			unsubscribe();
		};
	},[])
	// ユーザのフォロワーを取得
	useEffect(() => {
		const userId = props.globalState.state.uid
		let followeeArray:string[] = []
		db.collection('userList').doc(userId).collection('followee')
		.get().then(function(querySnapshot) {
		// followeeArrayの配列をこのタイミングでゼロにしないとフォロー数が変動するたびに累積されて出力される
		followeeArray = []
		querySnapshot.forEach(function(doc) {
			followeeArray.push(doc.id)
		})
		let followeeNumber: number = followeeArray.length-1
		setFollowee(followeeNumber)
	})
	},[])
	// ユーザのフォローしている人を取得
	useEffect(() => {
		const userId = props.globalState.state.uid
		let followerArray:string[] = []
		const unsubscribe = db.collection('userList').doc(userId).collection('follower')
		.onSnapshot(function(querySnapshot) {
		// followerArrayの配列をこのタイミングでゼロにしないとフォロー数が変動するたびに累積されて出力される
		followerArray = []
		querySnapshot.forEach(function(doc) {
			followerArray.push(doc.id)
		})
		let followerNumber: number = followerArray.length-1
		setFollower(followerNumber)
	})
	return () => {
		unsubscribe();
	};
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
	const tofindUser = () => {
		props.navigation.navigate('findUser')
	}
	const imageInput = (url: string) =>{
		setUserIcon(url);
	}
	const changeIcon = async() => {
		try {
			setProgressVisible(true)
			const iconUrl = await changeIconUrl()
			await setIconToFirestore(iconUrl);
			imageInput(iconUrl);
			setProgressVisible(false)
		} catch(error) {
			console.log(error)
		}
	}
	const changeIconUrl = async():Promise<string> => {
		let result = await selectIconPicture() as pickerResult
		if (!result.cancelled) {
			let data = ''
			data = await uploadResult(result.uri, props.globalState.state.uid)
			return data
		} else {
		// 画像の変更をキャンセルした際にダイアログの表示を消す
			setProgressVisible(false)
		}
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
		const userId = props.globalState.state.uid
		return db.collection('userList').doc(userId)
		.set({
		iconURL: url
		}, {merge: true})
	}
	const handleRefresh = () => {
		setIsRefreshed(!isRefreshed)
		setRefreshing(true)
    }

	return (
		<View style={styles.container}>
			<View>
			<ProgressDialog
				visible={progressVisible}
				title="アイコン画像を変更しています"
				message="しばらくお待ちください"
			/>
			</View>
			<View style={{flexDirection: 'row', justifyContent: 'center',}}>
				<View>
					<View style={{alignItems: 'center', marginTop: 60}}>
						<TouchableOpacity
							onPress={changeIcon}
						>
							<Image
								source={{ uri: _userIcon }}
								style = {styles.userIcon}
							/>
						</TouchableOpacity>
					</View>
				</View>
				<View style={{marginLeft: 30}}>
					<View
						style={{
							justifyContent: 'center',
							flexDirection: 'row',
							marginTop: 60,
						}}
					>
						<ProfileNumber
							number={_postNumber}
							itemName='投稿'
						/>
						<ProfileNumber
							number={_follower}
							itemName="フォロー"
							press={toFollowerList}
							centerClass={{width: 50, height: 50, marginHorizontal: 30}}
						/>
						<ProfileNumber
							number={_followee}
							itemName="フォロワー"
							press={toFolloweeList}
						/>
					</View>
					<View style={{ alignItems: 'center', marginTop: 5, flexDirection: 'row'}}>
						<TouchableOpacity
						style={styles.editButton}
						onPress={tofindUser}
						>
						<Text
							style={styles.editText}>
							{'ユーザー検索'}
						</Text>
						</TouchableOpacity>
						<Icon
							size={20}
							name='cog'
							type='font-awesome'
							color='black'
							onPress={setting}
						/>
					</View>
				</View>
			</View>
			<View style={{marginTop: 15}}>
				<Text style={styles.userName}>{_userName}</Text>
			</View>
			<SafeAreaView style={styles.list}>
				<FlatList
				data={_allReviews}
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
				refreshing={refreshing}
				onRefresh={handleRefresh}
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
		backgroundColor: '#fff',
		flex: 1
	},
	userName: {
		color: 'black',
		fontSize: 13,
		fontWeight: '700',
		marginLeft: '14%',
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
		width: 160,
		backgroundColor:"white",
		borderRadius:15,
		height:35,
		alignItems:"center",
		justifyContent:"center",
		borderColor: '#818181',
		borderWidth: 1,
		marginRight: 10
	},
	editText: {
		color: 'black',
		fontWeight: '500',
	},
	list: {
		marginTop: 20,
		paddingBottom: 190
	},
	})
