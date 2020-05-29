import React, { useState, useEffect, useRef }from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View,　FlatList, TouchableOpacity} from 'react-native';
import { Avatar, Card, } from 'react-native-elements'

import firebase from 'firebase/app'
import {db} from '../../firebaseConfig'
import RBSheet from "react-native-raw-bottom-sheet";


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
	userId?: string
}

type ShopData = {
	address: string
	latitude: number
	longitude: number
	shopName: string
	reviews: firebase.firestore.CollectionReference
	id: string
}

type ReviewsDocResponse = ReviewDocResponse[]
type ShopsArrayType= ShopDocResponse[]

const Search = () => {
	const [locationData, changeLocationData] = useState<ShopsData>([])
	const [latitude, changeLatitude] = useState<number>(34.7201152);
	const [longitude, changeLongitude] = useState<number>(137.7394095);
	const [reviews, setReviews] = useState<ReviewsDocResponse>([])
	const refRBSheet = useRef();

	useEffect(() => {
		let dataArray: ShopsData = []
		db.collection('shops')
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
						let tmp = doc.data() as ShopData
						tmp.id = doc.id
						dataArray.push(tmp)
				})
				changeLocationData(dataArray)
		})
	},[])

	const getAllReviews = async(id: string): Promise<ReviewsDocResponse> => {
		let reviewssss: ReviewsDocResponse = []
		const querySnapshot = await db.collectionGroup('reviews').where('shopId', '==', id).orderBy('createdAt', 'desc').get()
				const queryDocsSnapshot = querySnapshot.docs
				reviewssss = await Promise.all(queryDocsSnapshot.map(async (item) => {
					let data = item.data()
					data.key = item.id
					const profile = await (data.user).get()
					data.userName = profile.get('userName')
					data.iconURL = profile.get('iconURL')
					data.userId = profile.id
					//// ここは削除する
					delete data.user
					return data
				}))
		return reviewssss
	}
	const handlePress = async (id: string) => {
		refRBSheet.current.open()
		const _reviews = await getAllReviews(id)
		console.log(_reviews)
		setReviews(_reviews)
	}
	return (
		<View style={styles.container}>
			<MapView style={styles.mapStyle}
				initialRegion={{
					latitude: latitude,
					longitude: longitude,
					latitudeDelta: 0.02,
					longitudeDelta: 0.02,
				}}>
				{locationData.map((location) =>
					<Marker
						key={location.id}
						title={location.shopName}
						description={location.address}
						onPress={() => handlePress(location.id)}
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
					height={270}
					closeOnDragDown={true}
					closeOnPressMask={true}
					customStyles={{
						wrapper: {
							backgroundColor: "transparent"
						},
					}}
				>
					<View>
						<FlatList
							style={{marginBottom: 30}}
							data={reviews}
							renderItem={
								({ item }) =>
									<View>
										<Card containerStyle={{borderRadius: 25}}>
											<TouchableOpacity  onPress={() => alert(item.userId)}>
												<View style={styles.userInfomation}>
													<Avatar rounded source={{ uri: item.iconURL }}/>
													<Text style={styles.userName}>{item.userName}</Text>
												</View>
											</TouchableOpacity>
											<View style={{flexDirection: 'row'}}>
												<View>
													<View style={{flexDirection: 'row', marginTop: 10,}}>
														<View style={styles.favorite}>
															<Text style={styles.itemName}>Favorite Menu</Text>
															<Text style={styles.menuName}>{item.favoriteMenu}</Text>
														</View>
														<View style={styles.price}>
															<Text style={styles.itemName}>Price</Text>
															<Text style={styles.menuName}>{item.price}</Text>
														</View>
														<View style={styles.category}>
															<Text style={styles.itemName}>Category</Text>
															<Text style={styles.categoryName}>{item.category}</Text>
														</View>
													</View>
												</View>
											</View>
										</Card>
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

export default Search;

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
			borderRightWidth: 1,
			borderRightColor: 'grey',
			paddingRight: 40,
			marginLeft: 5
	},
	price: {
			borderRightWidth: 1,
			borderRightColor: 'grey',
			paddingRight: 40,
			marginLeft: 10
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

