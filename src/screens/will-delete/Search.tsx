import React, { useState, useEffect, useRef }from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View,　FlatList, TouchableOpacity} from 'react-native';
import { Avatar, Card, Icon } from 'react-native-elements';
import firebase from 'firebase/app';
import {db} from '../../firebaseConfig';
import RBSheet from 'react-native-raw-bottom-sheet';
import GlobalStateContainer from '../store/GlobalState';
import { Subscribe } from 'unstated';
import {ReviewDocResponse} from '../types/types';
import {ShopDocResponse} from '../types/types';
import {ReviewsDocResponse} from '../types/types';
import {ShopsArrayType} from '../types/types';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {regionType} from '../types/types';
import {StackProps} from '../types/types';

// TODO:フォローしているユーザを判別する関数は独立させたい
// TODO:新しく投稿したお店が自動で更新されるようにしたい

const Search = (props:StackProps) => {
	const [allShopsData, setAllShopsData] = useState<ShopsArrayType>([]);
	const [_allReviews, setAllReviews] = useState<ReviewsDocResponse>([]);
	const [_refresh, setRefresh] = useState<boolean>(false);
	const [region, setRegion] = useState<regionType>({
		latitude: 10,
		longitude: 90,
		latitudeDelta: 0.05,
		longitudeDelta: 0.05,});
	const refRBSheet = useRef();
	useEffect(() => {
		(async() => {
			const {status} = await Permissions.askAsync(Permissions.LOCATION);
			if(status == 'granted') {
				const location = await Location.getCurrentPositionAsync({});
				setRegion({
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					latitudeDelta: 0.05,
					longitudeDelta: 0.05
				});
			} else {
				setRegion({
					latitude: 35.67832667,
					longitude: 139.77044378,
					latitudeDelta: 0.08,
					longitudeDelta: 0.08
				});
			}
		})();
	}, []);
	//投稿されているお店の位置情報・店名を取得する
	useEffect(() => {
		(async() => {
			let shopDataArray: ShopsArrayType = [];
			const followrIdList = await getFollowingUid();
			followrIdList.push(props.globalState.state.uid);
			const convertedFolloerUidList = await convertTypeToReference(followrIdList);
			const shopReviewdByFollower = await db.collectionGroup('reviews').where('user', 'in', convertedFolloerUidList).orderBy('createdAt', 'desc').get();
			const shopReviewdByFollowerDocs = shopReviewdByFollower.docs;
			shopDataArray = await Promise.all(shopReviewdByFollowerDocs.map(async (item) => {
				const shopId = item.data().shopId;
				return db.collection('shops').doc(shopId).get().then((doc) => {
					const shopData = doc.data() as ShopDocResponse;
					shopData.id = doc.id;
					return shopData;
				});
			}));
			setAllShopsData(shopDataArray);
		})();
	},[_refresh]);
	// 選択したお店の全レビューを取得する
	const getAllReviews = async(id: string, latitude: number, longitude: number): Promise<ReviewsDocResponse> => {
		setRegion({
			latitude: latitude,
			longitude: longitude,
			latitudeDelta: 0.05,
			longitudeDelta: 0.05
		});
		let reviews: ReviewsDocResponse = [];
		const followrIdList = await getFollowingUid();
		followrIdList.push(props.globalState.state.uid);
		const convertedFolloerUidList = await convertTypeToReference(followrIdList);
		const querySnapshot = await db.collectionGroup('reviews').where('shopId', '==', id).where('user', 'in', convertedFolloerUidList).orderBy('createdAt', 'desc').get();
		const queryDocsSnapshot = querySnapshot.docs;
		reviews = await Promise.all(queryDocsSnapshot.map(async (item) => {
			const reviewData = item.data() as ReviewDocResponse;
			reviewData.key = item.id;
			const profile = await (reviewData.user).get();
			reviewData.userName = profile.get('userName');
			reviewData.iconURL = profile.get('iconURL');
			reviewData.userId = profile.id;
			return reviewData;
		}));
		return reviews;
	};
	//ログインユーザのフォローしているユーザのuidを取得する
	const getFollowingUid = async():Promise<string[]> => {
		let followingUidList: string[] = [];
		// この書き方がsubcollectionの展開の仕方のはず
		const querySnapshot = await db.collection('userList').doc(props.globalState.state.uid).collection('followee').get();
		followingUidList =  querySnapshot.docs.map((doc) => {
			return doc.id;
		});
		return followingUidList;
	};
	//　whereの条件で使う時にrefernce型が必要になるからstring型からreference型に変換する処理
	const convertTypeToReference = (array: string[]):Promise<firebase.firestore.DocumentReference[]> => {
		let reference: firebase.firestore.DocumentReference;
		// 文字列firstを削除する
		array = array.filter(n => n !== 'first');
		const convertedArray = array.map((uid) => {
			reference = db.collection('userList').doc(uid);
			return reference;
		});
		return convertedArray;
	};
	const showShopReviews = async (id: string, latitude: number, longitude: number) => {
		refRBSheet.current.open();
		const _reviews = await getAllReviews(id, latitude, longitude);
		setAllReviews(_reviews);
	};
	const toProfilePage = (id: string) => {
		props.globalState.setFriendId(id);
		refRBSheet.current.close();
		props.navigation.navigate('friendProfile');
	};
	const reGetShopReviews = () => {
		setRefresh(!_refresh);
	};
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
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: '#000'
				}}
			>
				<RBSheet
					style={{borderRadius: 20}}
					ref={refRBSheet}
					animationType={'slide'}
					height={300}
					closeOnDragDown={true}
					closeOnPressMask={true}
					customStyles={{
						wrapper: {
							backgroundColor: 'transparent'
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
};

const SearchWrapper = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalStateContainer]}>
			{
				globalState => <Search globalState={globalState} navigation = {navigation} />
			}
		</Subscribe>
	);
};

export default SearchWrapper;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	mapStyle: {
		...StyleSheet.absoluteFillObject,
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

