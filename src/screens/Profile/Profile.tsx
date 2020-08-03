import React, { useState, useEffect } from 'react'
import { StyleSheet,Text, Image, View, TouchableOpacity, SafeAreaView, FlatList, ScrollView, RefreshControl } from 'react-native';
import { Icon } from 'react-native-elements'
import ProfileNumber from '../../components/ProfileNumber';
import ProfileReviews from '../../components/ProfileReviews';
import { fetchAllUserReviews, fetchUserIconImage, fetchUserName, fetchFollowers, fetchFollowees, setIconUrlOnFirestore, changeIconUrl } from '../../screens/Profile/index'
import GlobalStateContainer from '../../store/GlobalState';
import { Subscribe } from 'unstated';
//@ts-ignore
import { ProgressDialog } from 'react-native-simple-dialogs';

const Profile = (props) => {
    const [_userName, setUserName] = useState<string>()
	const [_followee, setFollowee] = useState<number>(0)
	const [_follower, setFollower] = useState<number>(0)
	const [_postNumber, setPostNumber] = useState<number>(0)
    const [_allReviews, setAllReviews] = useState<userReviewsType>([])
    //TODO: string | booleanのところの型宣言を考える
	const [_userIcon, setUserIcon] = useState<string | boolean>();
	const [progressVisible , setProgressVisible] = useState<boolean>(false)
	const [userDataUpdate, setUserDataUpdate] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false)

    useEffect(() => {
        fetchAllUserReviews(props.globalState.state.uid)
		}, [refresh])
	// ユーザーのアイコン画像を取得
	useEffect(() => {
        fetchUserIconImage(props.globalState.state.uid)
	}, [])
	// ユーザの名前を取得
	useEffect(() => {
        fetchUserName(props.globalState.state.uid)
	},[])
	// ユーザのfollowerを取得
	useEffect(() => {
        fetchFollowers(props.globalState.state.uid)
	},[refresh])
	// ユーザのfolloweeを取得
	useEffect(() => {
        fetchFollowees(props.globalState.state.uid)
    },[])
    const updateProfileInfo = () => {
		setUserDataUpdate(true)
		setRefresh(!refresh)
		setUserDataUpdate(false)
    }

	const changeIcon = async() => {
		try {
			setProgressVisible(true)
            const iconUrl = await changeIconUrl(props.globalState.state.uid)
            if (iconUrl == false) {
                setProgressVisible(iconUrl)
            } else {
                await setIconUrlOnFirestore(props.globalState.state.uid, iconUrl);
                setUserIcon(iconUrl);
                setProgressVisible(false)
            }
		} catch(error) {
			console.log(error)
		}
    }
    return (
		<View style={styles.container}>
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={userDataUpdate}
						onRefresh={() => updateProfileInfo()}
				/>
				}
			>
			<View>
			<ProgressDialog
				visible={progressVisible}
				title="アイコン画像を変更しています"
				message="しばらくお待ちください"
			/>
			</View>
			<View style={{flexDirection: 'column', marginRight: 'auto', marginLeft: 'auto'}}>
				<View style={{ flexDirection: 'row', justifyContent: "flex-start", marginTop: 50}}>
					<View>
						<View style={{alignItems: 'center'}}>
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
								flexDirection: 'row'
							}}
						>
							<ProfileNumber
								number={_postNumber}
								itemName='投稿'
							/>
							<ProfileNumber
								number={_follower}
								itemName="フォロワー"
								press={props.navigation.navigate('followerList')}
								centerClass={{width: 60, height: 50, marginHorizontal: 30}}
							/>
							<ProfileNumber
								number={_followee}
								itemName="フォロー"
								press={props.navigation.navigate('followeeList')}
							/>
						</View>
						<View style={{ alignItems: 'center', marginTop: 5, flexDirection: 'row'}}>
							<TouchableOpacity
							style={styles.editButton}
							onPress={props.navigation.navigate('findUser')}
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
								onPress={props.navigation.navigate('toSettingPage')}
							/>
						</View>
					</View>
				</View>
				<View style={{marginTop: 5, marginLeft: 4, flexDirection: 'row', justifyContent: "flex-start"}}>
					<Text style={styles.userName}>{_userName}</Text>
				</View>
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
				/>
			</SafeAreaView>
			</ScrollView>
		</View>
	);
}
export const ProfileWrapper = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalStateContainer]}>
			{
				globalState => <Profile globalState={globalState} navigation = {navigation} />
			}
		</Subscribe>
	);
	}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1
	},
	userName: {
		color: 'black',
		fontSize: 13,
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
		marginBottom: 10
	},
})