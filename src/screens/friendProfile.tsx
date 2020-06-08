import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity, SafeAreaView, FlatList} from 'react-native';
import { Subscribe } from 'unstated';
import firebase from '../../firebaseConfig';
import {db} from '../../firebaseConfig'
import GlobalStateContainer from '../containers/GlobalState';
import ProfileNumber from '../components/ProfileNumber';
import ProfileReviews from '../components/ProfileReviews';
import {friendReviewDocResponse} from '../types/types'
import {friendDataDocResponse} from '../types/types'
import {friendReviewsType} from '../types/types'

const FriendProfile = (props: any) => {
	const [friendName, setFriendName] = useState<string>()
	const [followee, setFollowee] = useState<number>(0)
	const [follower, setFollower] = useState<number>(0)
	const [postNumber, setPostNumber] = useState<number>(0)
	const [allReviews, setAllReviews] = useState<friendReviewsType>([])
	const [isFollow, setIsFollow] = useState(true)
	const [image, setFriendIconUrl] = useState<string>();
	const [canPressFollowButton, setCanPressFollowButton] = useState<boolean>(true)
	const [refreshing, setRefreshing] = useState<boolean>(false)
	const [isRefreshed, setIsRefreshed] = useState<boolean>(false)


	//自分のページを見ている場合、フォローボタンを押せないようにする
	useEffect(() => {
		checkCanPressFollowButton()
	},[])

	const checkCanPressFollowButton = () => {
		const friendId = props.globalState.state.friendId
		const userId = props.globalState.state.uid
		if(userId == friendId) {
			setCanPressFollowButton(true)
		} else {
			setCanPressFollowButton(false)
		}
	}
	useEffect(() => {
		checkFollowExchange()
	},[])
	// ユーザをフォローしているかを確認する処理
	const checkFollowExchange = async() => {
		const friendId = props.globalState.state.friendId
		const userId = props.globalState.state.uid
		let followerIdArray: string[] = []
		const querySnapshot = await db.collection('userList').doc(userId).collection('follower').get()
		querySnapshot.forEach((doc) => {
			followerIdArray.push(doc.id)
		})
		followerIdArray = followerIdArray.filter(n => n !== 'first')
		if (followerIdArray.includes(friendId)) {
			setIsFollow(true)
		} else {
			setIsFollow(false)
		}
	}
	// 投稿されたレビューを取得する
	useEffect(() => {
		const friendId = props.globalState.state.friendId
		const ref = db.collection('userList').doc(friendId)
		let friendReviews: friendReviewsType = []
		db.collectionGroup('reviews').where('user', '==', ref).orderBy('createdAt', 'desc').get()
        .then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				let userReview = doc.data() as friendReviewDocResponse
				friendReviews.push(userReview)
			})
        //投稿されたレビューの件数を取得
			let reviewNumber: number = friendReviews.length
			setPostNumber(reviewNumber)
			setAllReviews(friendReviews)
			setRefreshing(false)
    })
	}, [isRefreshed])
	// ユーザの名前とアイコン画像を取得する
	useEffect(() => {
		const friendId = props.globalState.state.friendId
		firebase.firestore().collection('userList').doc(friendId)
		.get().then(function(doc) {
			let friendProfileData = doc.data() as friendDataDocResponse
			setFriendName(friendProfileData.userName)
			setFriendIconUrl(friendProfileData.iconURL)
		})
	},[])
	// フォロワーの数を取得する
	useEffect(() => {
		const friendId = props.globalState.state.friendId
		let followeeArray:string[] = []
		const unsubscribe = db.collection('userList').doc(friendId).collection('followee')
		.onSnapshot(function(querySnapshot) {
			followeeArray = []
			querySnapshot.forEach(function(doc) {
			followeeArray.push(doc.id)
			})
		let followeeNumber: number = followeeArray.length-1
		setFollowee(followeeNumber)
	})
	return () => {
		unsubscribe();
	};
	},[])
	//フォローの数を取得する
	useEffect(() => {
		const friendId = props.globalState.state.friendId
		let followerArray:string[] = []
		const unsubscribe = db.collection('userList').doc(friendId).collection('follower')
		.onSnapshot(function(querySnapshot:any) {
			followerArray = []
			querySnapshot.forEach(function(doc:any) {
			followerArray.push(doc.id)
			})
			let followerNumber: number = followerArray.length-1
			setFollower(followerNumber)
	})
	return () => {
		unsubscribe();
	};
	},[])
	//　フォロー状態を解除する
	const pressFollowButton = () => {
		const userId = props.globalState.state.uid
		const friendId = props.globalState.state.friendId
		if (isFollow) {
			db.collection('userList').doc(userId).collection('follower').doc(friendId).delete()
			setIsFollow(false)
		} else {
			db.collection('userList').doc(userId).collection('follower').doc(friendId).set({})
			setIsFollow(true)
		}
	}

	const toFolloweeList = () => {
		props.navigation.navigate('friendFolloweeList')
	}
	const toFollowerList = () => {
		props.navigation.navigate('friendFollowerList')
	}
	const handleRefresh = () => {
		setIsRefreshed(!isRefreshed)
		setRefreshing(true)
    }

	return (
	<View style={styles.container}>
		<View style={{flexDirection: 'row', justifyContent: 'center',}}>
			<View>
				<View style={{alignItems: 'center', marginTop: 10}}>
				<Image
					source={{ uri: image }}
					style = {styles.userIcon}
				/>
				</View>
			</View>
			<View style={{marginLeft: 30}}>
				<View
				style={{
					justifyContent: 'center',
					flexDirection: 'row',
					marginTop: 20,
				}}
				>
				<ProfileNumber
					number={postNumber}
					itemName='post'
				/>
				<ProfileNumber
					number={follower}
					itemName="フォロー"
							centerClass={{width: 50, height: 50, marginHorizontal: 30}}
							press={toFollowerList}
				/>
				<ProfileNumber
					number={followee}
							itemName="フォロワー"
							press={toFolloweeList}
				/>
				</View>
				<View style={{ alignItems: 'center', marginTop: 5, flexDirection: 'row'}}>
				<TouchableOpacity
					disabled={canPressFollowButton}
					style={
						isFollow
						? styles.followButton
						: styles.unFollowButton
							}
							onPress={()=> {pressFollowButton()}}
				>
				{
				isFollow
				? <Text style={{color: 'white'}}>フォロー中</Text>
				: <Text style={{color: 'white'}}>フォロー</Text>
				}
				</TouchableOpacity>
            </View>
			</View>
		</View>
		<View style={{marginTop: 10}}>
					<Text style={styles.userName}>{friendName}</Text>
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
				refreshing={refreshing}
				onRefresh={handleRefresh}
				/>
			</SafeAreaView>
	</View>
	);
}
const FriendProfileWrapper = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalStateContainer]}>
			{
				globalState => <FriendProfile globalState={globalState} navigation = {navigation} />
			}
		</Subscribe>
	);
}

export default FriendProfileWrapper;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff'
	},
	userName: {
		color: 'black',
		fontSize: 13,
		fontWeight: '700',
		marginLeft: '14%'
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
	// メニューの長さが長い時にはみ出す可能性がある。cssで対策する必要あり
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
	followButton: {
		width: 180,
		backgroundColor:"#d3d3d3",
		borderRadius:15,
		height:35,
		alignItems:"center",
		justifyContent:"center",
		borderColor: '#d3d3d3',
		borderWidth: 1,
	},
	unFollowButton: {
		width: 180,
		backgroundColor:"#5E9CFE",
		borderRadius:15,
		height : 35,
		alignItems:"center",
		justifyContent:"center",
		borderColor: '#5E9CFE',
		borderWidth: 1,
	},
	followButtonText: {
		color: 'white'
	},
	unfollowButtonText: {
		color: 'white'
	},
	list: {
		marginTop: 20,
		marginBottom: 270
	},
})

