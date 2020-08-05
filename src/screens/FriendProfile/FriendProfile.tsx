import React, { useState, useEffect } from 'react';
import { Text, Image, View, TouchableOpacity, SafeAreaView, FlatList, ScrollView, RefreshControl} from 'react-native';
import { Subscribe } from 'unstated';
import {db} from '../../../firebaseConfig'
import GlobalContainer from '../../store/GlobalState';
import ProfileNumber from '../../components/ProfileNumber';
import ProfileReviews from '../../components/ProfileReviews';
import { styles } from './style'
import { ContainerProps, TopStackNavProps, friendReviewsType } from 'src/types/types';
import { fetchFolloweeIds, fetchFriendDescription, fetchReviews, pressFollowButton } from './index'

const FriendProfile:React.FC<TopStackNavProps<'friendProfile'> & ContainerProps> = (props) => {
    const uid: string = (props.globalState.state.uid)
    const friendId: string = (props.globalState.state.friendId)
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
	},[friendId])

	const checkCanPressFollowButton = () => {
		if(uid == friendId) {
			setCanPressFollowButton(true)
		} else {
			setCanPressFollowButton(false)
		}
	}
	useEffect(() => {
		checkFollowExchange()
	},[friendId])
	// ユーザをフォローしているかを確認する処理
	const checkFollowExchange = async() => {
        const followeeIds = await fetchFolloweeIds(uid)
		if (followeeIds.includes(friendId)) {
			setIsFollow(true)
		} else {
			setIsFollow(false)
		}
	}
	// 投稿されたレビューを取得する
	useEffect(() => {
        (async() => {
            const reviews = await fetchReviews(friendId)
            setPostNumber(reviews.length)
            setAllReviews(reviews)
            setRefreshing(false)
        })()
	}, [isRefreshed, friendId])
	// ユーザの名前とアイコン画像を取得する
	useEffect(() => {
        (async() => {
            const friendDescription = await fetchFriendDescription(friendId)
            setFriendName(friendDescription.userName)
            setFriendIconUrl(friendDescription.iconURL)
        })
    },[friendId])

	// フォロワーの数を取得する
	useEffect(() => {
		const friendId = props.globalState.state.friendId
		let followers:string[] = []
		const unsubscribe = db.collection('userList').doc(friendId).collection('follower')
		.onSnapshot(function(querySnapshot) {
			followers = []
			querySnapshot.forEach(function(doc) {
			followers.push(doc.id)
			})
		let followerNumber: number = followers.length-1
		setFollower(followerNumber)
	})
	return () => {
		unsubscribe();
	};
	},[friendId])
	//フォローの数を取得する
	useEffect(() => {
		let followees:string[] = []
		const unsubscribe = db.collection('userList').doc(friendId).collection('followee')
		.onSnapshot(function(querySnapshot:any) {
			followees = []
			querySnapshot.forEach(function(doc:any) {
			followees.push(doc.id)
			})
			let followeeNumber: number = followees.length-1
			setFollowee(followeeNumber)
	})
	return () => {
		unsubscribe();
	};
    },[friendId])

	//　フォロー状態を解除する
	const handlePress = (uid: string, friendId:string, isFollow:boolean) => {
        setIsFollow(pressFollowButton(uid, friendId, isFollow))
    }

	const handleRefresh = () => {
		setIsRefreshed(!isRefreshed)
		setRefreshing(true)
    }

	return (
	<View style={styles.container}>
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={handleRefresh}
				/>
			}
		>
		<View style={{flexDirection: 'column', marginRight: 'auto', marginLeft: 'auto'}}>
		<View style={{ flexDirection: 'row', justifyContent: "flex-start", marginTop: 20}}>
			<View>
				<View style={{alignItems: 'center'}}>
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
				}}
				>
				<ProfileNumber
					number={postNumber}
					itemName='投稿'
				/>
				<ProfileNumber
					number={follower}
					itemName="フォロワー"
					centerClass={{width: 60, height: 50, marginHorizontal: 30}}
					press={() => props.navigation.navigate('friendFolloweeList')}
				/>
				<ProfileNumber
					number={followee}
					itemName="フォロー"
					press={() => props.navigation.navigate('friendFollowerList')}
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
							onPress={()=> {handlePress(uid, friendId, isFollow)}}
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
		</ScrollView>
	</View>
	);
            }

export const FriendProfileWrapper:React.FC<TopStackNavProps<'friendProfile'>> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{
				(globalState:GlobalContainer) => <FriendProfile globalState={globalState} navigation = {navigation} />
			}
		</Subscribe>
	);
}


