import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Avatar, Card, Icon } from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import GlobalContainer from '../../store/GlobalState';
import { Subscribe } from 'unstated';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { styles } from './style';
import {
	ContainerProps,
	SearchStackNavProps,
	Region,
	ShopDocResponse,
	Reviews,
	ShopDescription,
	Review,
} from '../../types/types';
import {
	fetchFolloweeIds,
	convertArrayToReference,
	fetchReviews,
	fetchShopDescription,
	fetchShopsDescriptionByFollowees,
	fetchReviewsByFollowees,
} from './index';
import  Pindescription  from '../../components/Pindescription'

const Search: React.FC<SearchStackNavProps<'search'> & ContainerProps> = (props) => {
	const [allShopsDescription, setAllShopsDescription] = useState<ShopDocResponse[]>([]);
	const [_allReviews, setAllReviews] = useState<Reviews>([]);
	const [_refresh, setRefresh] = useState<boolean>(false);
	const [region, setRegion] = useState<Region>(null!);
	const refRBSheet = useRef<RBSheet>(null!);
	const [_windowHeight, setWindowHeight] = useState<number>(0);
	const [_windowWidth, setWindowWidth] = useState<number>(0);
	const [_openedPinId, setOpenedPinId ] = useState<string>('');

	const setPinId = (isOpen: string) => {
		setOpenedPinId(isOpen);
	};

	useEffect(() => {
		setWindowHeight(Dimensions.get('window').height);
		setWindowWidth(Dimensions.get('window').width);
	}, []);

	const executeSetRegion = (latitude: number, longitude: number) => {
		setRegion({
			latitude,
			longitude,
			latitudeDelta: 0.05,
			longitudeDelta: 0.05,
		});
	};

	useEffect(() => {
		(async () => {
			const { status } = await Permissions.askAsync(Permissions.LOCATION);
			if (status == 'granted') {
				const location = await Location.getCurrentPositionAsync({});
				executeSetRegion(location.coords.latitude, location.coords.longitude);
			} else {
				executeSetRegion(35.67832667, 139.77044378);
			}
		})();
	}, []);
	//投稿されているお店の位置情報・店名を取得する
	useEffect(() => {
		(async () => {
			const followeeIds = await fetchFolloweeIds(props.globalState.state.uid);
			followeeIds.push(props.globalState.state.uid);
			const FolloweeReferences = await convertArrayToReference(followeeIds);
			const shopsDescriptionByFollowees = await fetchShopsDescriptionByFollowees(FolloweeReferences);
			const shopsDescriptionByFolloweesDocs = shopsDescriptionByFollowees.docs;
			const shopDescriptions = await fetchShopDescription(shopsDescriptionByFolloweesDocs);
			setAllShopsDescription(shopDescriptions);
		})();
	}, [_refresh]);

	// 選択したお店の全レビューを取得する
	const getAllReviews = async (description: ShopDescription): Promise<Reviews> => {
		executeSetRegion(description.latitude, description.longitude);
		const followeeIds = await fetchFolloweeIds(props.globalState.state.uid);
		followeeIds.push(props.globalState.state.uid);
		const followeeReferences = await convertArrayToReference(followeeIds);
		const reviewsByFollowees = await fetchReviewsByFollowees(description.id, followeeReferences);
		const queryDocsSnapshot = reviewsByFollowees.docs as firebase.firestore.QueryDocumentSnapshot<
			Review
		>[];
		const reviews = await fetchReviews(queryDocsSnapshot);
		console.log(reviews);
		return reviews;
	};
	// ログインユーザのフォローしているユーザのuidを取得する
	// whereの条件で使う時にrefernce型が必要になるからstring型からreference型に変換する処理
	const showShopReviews = async (id: string, latitude: number, longitude: number) => {
		refRBSheet.current.open();
		const _reviews = await getAllReviews({ id: id, latitude: latitude, longitude: longitude });
		setAllReviews(_reviews);
		// setDescriptionVisible('flex');
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
				provider={PROVIDER_GOOGLE}
			>
				{allShopsDescription.map((description) => (
					<Marker
						key={description.id}
						coordinate={{
							latitude: description.latitude,
							longitude: description.longitude,
						}}
					>
						<Pindescription shopDoc={description} showShopReviews={showShopReviews} openedPinId={_openedPinId} setPinId={setPinId}/>
					</Marker>
				))}
			</MapView>
			<View style={{ position: 'absolute', right: '7%', top: '5%' }}>
				<Icon size={30} name="refresh" type="font-awesome" color="black" onPress={reGetShopReviews} />
			</View>
				<RBSheet
					ref={refRBSheet}
					animationType={'slide'}
					height={_windowHeight*0.3}
					closeOnDragDown={true}
					closeOnPressMask={true}
					onClose={()=> setOpenedPinId('')}
					customStyles={{
						wrapper: {
							backgroundColor: 'transparent',
						},
						container: {
							width: _windowWidth,
							borderRadius: 20,
						},
						draggableIcon: {
							marginTop: '6%'
						}
					}}>
					<View style={{ paddingBottom: 50 }}>
						<FlatList
							data={_allReviews}
							renderItem={({ item }) => (
								<View>
									<TouchableOpacity>
										<Card containerStyle={{ borderRadius: 25 }}>
											<TouchableOpacity onPress={() => toProfilePage(item.userId)}>
												<View style={styles.userInfomation}>
													<Avatar rounded source={{ uri: item.iconURL }} />
													<Text style={styles.userName}>{item.userName}</Text>
												</View>
											</TouchableOpacity>
											<View>
												<View style={{ flexDirection: 'row' }}>
													<View style={styles.favorite}>
														<Text style={styles.itemName}>おすすめのメニュー</Text>
														<Text style={styles.menuName}>{item.favoriteMenu}</Text>
													</View>
												</View>
											</View>
											<View style={{ flexDirection: 'row', marginTop: 10 }}>
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
							)}
							keyExtractor={(item) => item.key}
						/>
					</View>
				</RBSheet>
		</View>
	);
};

export const SearchWrapper: React.FC<SearchStackNavProps<'search'>> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{(globalState: GlobalContainer) => <Search globalState={globalState} navigation={navigation} />}
		</Subscribe>
	);
};
