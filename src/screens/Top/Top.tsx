import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, ScrollView, RefreshControl } from 'react-native';
import ListItem from '../../components/ListItem';
import { Subscribe } from 'unstated';
import GlobalContainer from '../../store/GlobalState';
import * as Permissions from 'expo-permissions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ContainerProps, TopStackNavProps, ReviewDocResponse } from '../../types/types';
import { styles } from './style';
import { fetchFolloweeIds, convertToReference, fetchReviews, fetchQuerySnapshot } from './index';

const Top: React.FC<TopStackNavProps<'Top'> & ContainerProps> = (props) => {
	const [allReviews, setAllReviews] = useState<ReviewDocResponse[]>([]);
	const [isRefreshed, setIsRefreshed] = useState<boolean>(false);
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [isReview, setIsReview] = useState<boolean>(true);
	const userId = props.globalState.state.uid;

	useEffect(() => {
		(async () => {
			Permissions.askAsync(Permissions.LOCATION);
		})();
	});
	// fetch all reviews from firestore and show them
	useEffect(() => {
		void (async () => {
			const followeeIds = await fetchFolloweeIds(userId);
			// 自分の投稿も表示されるように自分のuidを追加する
			followeeIds.push(userId);
			const userReferences = await convertToReference(followeeIds);
			const querySnapshot = await fetchQuerySnapshot(userReferences);
			const reviews = await fetchReviews(querySnapshot.docs);
			if (reviews.length == 0) {
				setIsReview(false);
			} else {
				setIsReview(true);
			}
			setAllReviews(reviews);
			setRefreshing(false);
		})();
	}, [isRefreshed]);

	// 友達のプロフィール欄に遷移する
	const toFriendProfile = (id: string): void => {
		props.globalState.setFriendId(id);
		props.navigation.navigate('friendProfile');
	};
	const handleRefresh = () => {
		setIsRefreshed(!isRefreshed);
		setRefreshing(true);
	};
	const updateReview = () => {
		setIsRefreshed(!isRefreshed);
		setRefreshing(true);
	};

	return (
		<View style={styles.container}>
			{isReview ? (
				<FlatList
					data={allReviews}
					renderItem={({ item }) => (
						<ListItem
							id={item.shopId}
							title={item.shopName}
							category={item.category}
							address={item.shopAddress}
							price={item.price}
							favorite={item.favoriteMenu}
							userName={item.userName}
							iconURL={item.iconURL}
							userId={item.userId}
							pressMethod={toFriendProfile}
						/>
					)}
					refreshing={refreshing}
					onRefresh={handleRefresh}
				/>
			) : (
				<View>
					<ScrollView
						refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => updateReview()} />}>
						<View style={styles.descriptionPosition}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									flex: 1,
									justifyContent: 'center',
								}}>
								<Icon name="hand-o-up" color="#fbd01d" size={40} />
								<Icon
									name="arrow-down"
									color="black"
									size={25}
									style={{
										marginTop: 10,
										marginLeft: 5,
									}}
								/>
							</View>
							<Text style={styles.description}>
								{
									'ここには投稿されたレビューが表示されます。画面上部を引くことで、最新の投稿を確認することができます。'
								}
							</Text>
						</View>
					</ScrollView>
				</View>
			)}
		</View>
	);
};

export const TopWrapper: React.FC<TopStackNavProps<'Top'>> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{(globalState: GlobalContainer) => <Top globalState={globalState} navigation={navigation} />}
		</Subscribe>
	);
};
