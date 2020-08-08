import React, { useState, useEffect, useRef }from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Text, View,　FlatList, TouchableOpacity} from 'react-native';
import { Avatar, Card, Icon } from 'react-native-elements'
import RBSheet from "react-native-raw-bottom-sheet";
import GlobalContainer from '../../store/GlobalState';
import { Subscribe } from 'unstated';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions'
import { styles } from './style'
import { ContainerProps, SearchStackNavProps, regionType, ReviewsDocResponse } from '../../types/types'
import { fetchFolloweeIds, convertToReferenceType, fetchReviews, fetchShopDescription } from './index';
import {db} from '../../../firebaseConfig'

// TODO:フォローしているユーザを判別する関数は独立させたい
// TODO:新しく投稿したお店が自動で更新されるようにしたい

const Search:React.FC<SearchStackNavProps<'search'> & ContainerProps> = (props) => {
	const [allShopsData, setAllShopsData] = useState<any>([])
	const [_allReviews, setAllReviews] = useState<any>([]);
	const [_refresh, setRefresh] = useState<boolean>(false);
	const [region, setRegion] = useState<regionType>({
		latitude: 10,
		longitude: 90,
		latitudeDelta: 0.05,
		longitudeDelta: 0.05,})
	const refRBSheet = useRef();
	useEffect(() => {
        (async() => {
			let {status} = await Permissions.askAsync(Permissions.LOCATION);
            if(status == 'granted') {
				const location = await Location.getCurrentPositionAsync({});
				setRegion({
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					latitudeDelta: 0.05,
					longitudeDelta: 0.05
				})
            } else {
				setRegion({
					latitude: 35.67832667,
					longitude: 139.77044378,
					latitudeDelta: 0.08,
					longitudeDelta: 0.08
				})
			}
        })()
	}, [])
	//投稿されているお店の位置情報・店名を取得する
	useEffect(() => {
		(async() => {
			const followeeIds = await fetchFolloweeIds(props.globalState.state.uid)
			followeeIds.push(props.globalState.state.uid)
			const convertedFollowees = await convertToReferenceType(followeeIds)
			const shopReviewdByFollower = await db.collectionGroup('reviews').where('user', 'in', convertedFollowees).orderBy('createdAt', 'desc').get()
            const shopReviewdByFollowerDocs = shopReviewdByFollower.docs
			const shopDescriptions =  await fetchShopDescription(shopReviewdByFollowerDocs)
			setAllShopsData(shopDescriptions)
		})()
    },[_refresh])

	// 選択したお店の全レビューを取得する
	const getAllReviews = async(id: string, latitude: number, longitude: number): Promise<ReviewsDocResponse> => {
		setRegion({
			latitude: latitude,
			longitude: longitude,
			latitudeDelta: 0.05,
			longitudeDelta: 0.05
		})
		const followeeIds = await fetchFolloweeIds(props.globalState.state.uid)
		followeeIds.push(props.globalState.state.uid)
		const convertedFollowees = await convertToReferenceType(followeeIds)
		const querySnapshot = await db.collectionGroup('reviews').where('shopId', '==', id).where('user', 'in', convertedFollowees).orderBy('createdAt', 'desc').get()
        const queryDocsSnapshot = querySnapshot.docs
        const reviews = await fetchReviews(queryDocsSnapshot)
        return reviews
	}
	//ログインユーザのフォローしているユーザのuidを取得する
    //　whereの条件で使う時にrefernce型が必要になるからstring型からreference型に変換する処理
	const showShopReviews = async (id: string, latitude: number, longitude: number) => {
		refRBSheet.current.open()
		const _reviews = await getAllReviews(id, latitude, longitude)
		setAllReviews(_reviews)
	}
	const toProfilePage = (id: string) => {
		props.globalState.setFriendId(id)
		refRBSheet.current.close()
		props.navigation.navigate('friendProfile')
	}
	const reGetShopReviews = () => {
		setRefresh(!_refresh)
	}
	return (
		<View style={styles.container}>
			<MapView
				style={styles.mapStyle}
				region={region}
				>
				{allShopsData.map((location) =>
					<Marker
						key={location.id}
						title={location.shopName}
						description={location.address}
						onPress={() => showShopReviews(location.id, location.latitude, location.longitude)}
						coordinate={
							{
								latitude: location.latitude,
								longitude: location.longitude
							}
						}
					/>
				)}
			</MapView>
			<View style={{position : 'absolute', right : '7%', top: '5%'}}>
					<Icon
						size={30}
						name='refresh'
						type='font-awesome'
						color='black'
						onPress={reGetShopReviews}
					/>
				</View>
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#000"
				}}
			>
				<RBSheet
					style={{borderRadius: 20}}
					ref={refRBSheet}
					animationType={"slide"}
					height={300}
					closeOnDragDown={true}
					closeOnPressMask={true}
					customStyles={{
						wrapper: {
							backgroundColor: "transparent"
						},
					}}
				>
					<View style={{paddingBottom: 50}}>
						<FlatList
							data={_allReviews}
							renderItem={
								({ item }) =>
									<View>
										<TouchableOpacity>
										<Card containerStyle={{borderRadius: 25}}>
											<TouchableOpacity  onPress={() => toProfilePage(item.userId)}>
												<View style={styles.userInfomation}>
													<Avatar rounded source={{ uri: item.iconURL }}/>
													<Text style={styles.userName}>{item.userName}</Text>
												</View>
											</TouchableOpacity>
											<View>
													<View style={{flexDirection: 'row',}}>
														<View style={styles.favorite}>
															<Text style={styles.itemName}>おすすめのメニュー</Text>
															<Text style={styles.menuName}>{item.favoriteMenu}</Text>
														</View>
													</View>
												</View>
											<View style={{flexDirection: 'row', marginTop: 10}}>
												<View style={styles.price}>
													<Text style={styles.itemName}>値段</Text>
													<Text style={styles.menuName}>{item.price}</Text>
												</View>
												<View style={styles.category}>
													<Text style={styles.itemName}>カテゴリー</Text>
													<Text style={styles.categoryName}>{item.category}</Text>
												</View>
											</View>
										</Card>
										</TouchableOpacity>
									</View>
							}
							keyExtractor={item => item.key}
							/>
							</View>
				</RBSheet>
			</View>
		</View>
	);
}

export const SearchWrapper:React.FC<SearchStackNavProps<'search'>> = ({ navigation }) => {
	return (
			<Subscribe to={[GlobalContainer]}>
				{
					(globalState:GlobalContainer) => <Search globalState={globalState} navigation = {navigation} />
				}
			</Subscribe>
	);
	}



