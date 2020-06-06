import React, { useState, useEffect, useRef }from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View,　FlatList, TouchableOpacity} from 'react-native';
import { Avatar, Card, } from 'react-native-elements'
import firebase from 'firebase/app'
import {db} from '../../firebaseConfig'
import RBSheet from "react-native-raw-bottom-sheet";
import GlobalStateContainer from '../containers/GlobalState';
import { Subscribe } from 'unstated';


type ReviewDocResponse = {
	category: string,
	createdAt: firebase.firestore.Timestamp,
	favoriteMenu: string,
	price: string,
	shopAddress: string,
	shopId: string,
	shopName: string
	user: firebase.firestore.DocumentReference
	userName?: string
	iconURL?: string
	key?: string
	userId: string
}

type ShopDocResponse = {
	address: string
	latitude: number
	longitude: number
	shopName: string
	reviews: firebase.firestore.CollectionReference
	id: string
}

type ReviewsDocResponse = ReviewDocResponse[]
type ShopsArrayType= ShopDocResponse[]

const Search = (props: any) => {
	const [allShopsData, setAllShopsData] = useState<ShopsArrayType>([])
	const [latitude, changeLatitude] = useState<number>(34.7201152);
	const [longitude, changeLongitude] = useState<number>(137.7394095);
	const [_allReviews, setAllReviews] = useState<ReviewsDocResponse>([])
	const [isShownSheet, setIsShownSheet] = useState<boolean>()
	const refRBSheet = useRef();

	//投稿されているお店の位置情報・店名を取得する
	useEffect(() => {
		let shopDataArray: ShopsArrayType = []
		const unsubscribe = db.collection('shops')
		.onSnapshot(function(querySnapshot) {
			shopDataArray = []
			querySnapshot.forEach(function(doc) {
					let shopDoc = doc.data() as ShopDocResponse
					shopDoc.id = doc.id
					shopDataArray.push(shopDoc)
			})
			setAllShopsData(shopDataArray)
		})
		return () => {
			unsubscribe();
		};
	},[])
	// 選択したお店の全レビューを取得する
	const getAllReviews = async(id: string): Promise<ReviewsDocResponse> => {
		let reviews: ReviewsDocResponse = []
		const querySnapshot = await db.collectionGroup('reviews').where('shopId', '==', id).orderBy('createdAt', 'desc').get()
		const queryDocsSnapshot = querySnapshot.docs
			reviews = await Promise.all(queryDocsSnapshot.map(async (item) => {
				let reviewData = item.data() as ReviewDocResponse
				reviewData.key = item.id
				const profile = await (reviewData.user).get()
				reviewData.userName = profile.get('userName')
				reviewData.iconURL = profile.get('iconURL')
				reviewData.userId = profile.id
				return reviewData
			}))
		return reviews
	}
	const showShopReviews = async (id: string) => {
		refRBSheet.current.open()
		const _reviews = await getAllReviews(id)
		setAllReviews(_reviews)
	}
	const toProfilePage = (id: string) => {
		props.globalState.setFriendId(id)
		refRBSheet.current.close()
		props.navigation.navigate('friendProfile')
	}
	return (
		<View style={styles.container}>
			<MapView style={styles.mapStyle}
				initialRegion={{
					latitude: latitude,
					longitude: longitude,
					latitudeDelta: 20,
					longitudeDelta: 20,
				}}>
				{allShopsData.map((location) =>
					<Marker
						key={location.id}
						title={location.shopName}
						description={location.address}
						onPress={() => showShopReviews(location.id)}
						coordinate={
							{
								latitude: location.latitude,
								longitude: location.longitude
							}
						}
					/>
				)}
			</MapView>
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

const SearchWrapper = ({ navigation }) => {
	return (
			<Subscribe to={[GlobalStateContainer]}>
				{
					globalState => <Search globalState={globalState} navigation = {navigation} />
				}
			</Subscribe>
	);
	}

export default SearchWrapper;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	mapStyle: {
		width: '100%',
		height: '100%',
		position: 'relative'
	},
	card: {
		borderRadius: 10
	},
	userInfomation: {
			flexDirection: 'row',
			marginBottom: 10
	},
	userName: {
			fontSize: 18,
			paddingTop: 5,
			paddingLeft: 10
	},
	favorite: {
			paddingRight: 40,
			marginLeft: 5,
	},
	price: {
			borderRightWidth: 1,
			borderRightColor: 'grey',
			paddingRight: 40,
			marginLeft: 5
	},
	category: {
			marginLeft: 10,
			marginRight: 5
	},
	itemName: {
			color: 'grey',
			fontWeight: '700'
	},
	categoryName: {
			marginTop: 5,
			fontWeight: '700'
	},
	menuName: {
			marginTop: 5,
			fontWeight: '700'
	},
	});

