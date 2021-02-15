import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import {
	Text,
	Image,
	View,
	TouchableOpacity,
	SafeAreaView,
	FlatList,
	ScrollView,
	RefreshControl,
} from 'react-native';
import { Icon } from 'react-native-elements';
import ProfileNumber from '../../components/ProfileNumber';
import ProfileReviews from '../../components/ProfileReviews';
import {
	fetchAllUserReviews,
	fetchUserIconImage,
	fetchFollowers,
	setIconUrlOnFirestore,
	changeIconUrl,
} from './index';
import GlobalContainer from '../../store/GlobalState';
import {
	ProfileStackNavProps,
	userDataDocResponse,
	userReviewsType,
	ContainerProps,
} from '../../types/types';
import { Subscribe } from 'unstated';
import { styles } from './style';
//@ts-ignore
import { Alert, AlertIcon } from '@chakra-ui/react';

const Profile: React.FC<ProfileStackNavProps<'ProfileWrapper'> & ContainerProps> = (props) => {
	const [_userName, setUserName] = useState<string>();
	const [_followee, setFollowee] = useState<number>(0);
	const [_follower, setFollower] = useState<number>(0);
	const [_postNumber, setPostNumber] = useState<number>(0);
	const [_allReviews, setAllReviews] = useState<userReviewsType>([]);
	const [_userIcon, setUserIcon] = useState<string>();
	const [isFinishedChangeIcon, setIsFinishedChangeIcon] = useState<boolean>(false);
	const [progressVisible, setProgressVisible] = useState<boolean>(false);
	const [userDataUpdate, setUserDataUpdate] = useState<boolean>(false);
	const [refresh, setRefresh] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const allUserReviews = await fetchAllUserReviews(props.globalState.state.uid);
			setAllReviews(allUserReviews);
			setPostNumber(allUserReviews.length);
		})();
	}, [refresh]);
	// ユーザーのアイコン画像を取得
	useEffect(() => {
		(async () => {
			const user = await fetchUserIconImage(props.globalState.state.uid);
			setUserIcon(user.iconURL);
		})();
	}, []);
	// ユーザの名前を取得
	useEffect(() => {
		// fetchUserName(props.globalState.state.uid)
		const unsubscribe = db
			.collection('userList')
			.doc(props.globalState.state.uid)
			.onSnapshot((doc) => {
				const userProfileData = doc.data() as userDataDocResponse;
				setUserName(userProfileData.userName);
			});
		return () => {
			unsubscribe();
		};
	}, []);
	// ユーザのfollowerを取得
	useEffect(() => {
		(async () => {
			const followerNumber = await fetchFollowers(props.globalState.state.uid);
			setFollower(followerNumber);
		})();
	}, [refresh]);
	// ユーザのfolloweeを取得
	useEffect(() => {
		// fetchFollowees(props.globalState.state.uid)
		let followees: string[] = [];
		const unsubscribe = db
			.collection('userList')
			.doc(props.globalState.state.uid)
			.collection('followee')
			.onSnapshot((querySnapshot) => {
				followees = [];
				querySnapshot.forEach((doc) => {
					followees.push(doc.id);
				});
				const followeeNumber: number = followees.length - 1;
				setFollowee(followeeNumber);
			});
		return () => {
			unsubscribe();
		};
	}, []);

	const updateProfileInfo = () => {
		setUserDataUpdate(true);
		setRefresh(!refresh);
		setUserDataUpdate(false);
	};

	const changeIcon = async () => {
		try {
			setProgressVisible(true);
			setIsFinishedChangeIcon(true);
			const iconUrl = await changeIconUrl(props.globalState.state.uid);
			if (iconUrl == 'cancel') {
				setProgressVisible(false);
				setIsFinishedChangeIcon(false);
			} else {
				await setIconUrlOnFirestore(props.globalState.state.uid, iconUrl);
				setUserIcon(iconUrl);
				setProgressVisible(false);
				setIsFinishedChangeIcon(false);
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<View style={styles.container}>
			{isFinishedChangeIcon == true && (
				<Alert status="warning">
					<AlertIcon />
					Seems your account is about expire, upgrade now
				</Alert>
			)}
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={userDataUpdate} onRefresh={() => updateProfileInfo()} />
				}>
				<View style={{ flexDirection: 'column', marginRight: 'auto', marginLeft: 'auto' }}>
					<View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 50 }}>
						<View>
							<View style={{ alignItems: 'center' }}>
								<TouchableOpacity onPress={changeIcon}>
									<Image source={{ uri: _userIcon }} style={styles.userIcon} />
								</TouchableOpacity>
							</View>
						</View>
						<View style={{ marginLeft: 30 }}>
							<View
								style={{
									justifyContent: 'center',
									flexDirection: 'row',
								}}>
								<ProfileNumber number={_postNumber} itemName="投稿" />
								<ProfileNumber
									number={_follower}
									itemName="フォロワー"
									press={() => props.navigation.navigate('followerList')}
									centerClass={{ width: 60, height: 50, marginHorizontal: 30 }}
								/>
								<ProfileNumber
									number={_followee}
									itemName="フォロー"
									press={() => props.navigation.navigate('followeeList')}
								/>
							</View>
							<View style={{ alignItems: 'center', marginTop: 5, flexDirection: 'row' }}>
								<TouchableOpacity
									style={styles.editButton}
									onPress={() => props.navigation.navigate('UserSearchWrapper')}>
									<Text style={styles.editText}>{'ユーザー検索'}</Text>
								</TouchableOpacity>
								<Icon
									size={20}
									name="cog"
									type="font-awesome"
									color="black"
									onPress={() => props.navigation.navigate('setting')}
								/>
							</View>
						</View>
					</View>
					<View
						style={{
							marginTop: 5,
							marginLeft: 4,
							flexDirection: 'row',
							justifyContent: 'flex-start',
						}}>
						<Text style={styles.userName}>{_userName}</Text>
					</View>
				</View>
				<SafeAreaView style={styles.list}>
					<FlatList
						data={_allReviews}
						renderItem={({ item }) => (
							<ProfileReviews
								shopName={item.shopName}
								shopAddress={item.shopAddress}
								category={item.category}
								price={item.price}
								favorite={item.favoriteMenu}
							/>
						)}
						keyExtractor={(item) => item.shopId}
					/>
				</SafeAreaView>
			</ScrollView>
		</View>
	);
};

export const ProfileWrapper: React.FC<ProfileStackNavProps<'ProfileWrapper'>> = ({
	navigation,
}) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{(globalState: GlobalContainer) => (
				<Profile globalState={globalState} navigation={navigation} />
			)}
		</Subscribe>
	);
};
