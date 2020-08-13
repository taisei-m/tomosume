import React, {useState, useEffect} from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Avatar,  } from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalContainer from '../../store/GlobalState';
import FollowButton from '../../components/FollowButton';
import {TopStackNavProps, UserDescriptionsType} from '../../types/types';
import { styles } from './style';
import { ContainerProps } from '../../types/types';
import { fetchFollowerIds, fetchFriendFollowerDescriptions, checkFollowExchange } from './index';

const FriendFollowerList:React.FC<TopStackNavProps<'friendFollowerList'> & ContainerProps> = (props) => {
	const [_followerList, setFollowerList] = useState<UserDescriptionsType>();

	useEffect(() => {
		(async () => {
			const followerIds = await fetchFollowerIds(props.globalState.state.friendId);
			const friendFollowerDescriptions = await fetchFriendFollowerDescriptions(followerIds);
			const checkedFriendFollowerDescriptions =  await checkFollowExchange(props.globalState.state.uid, friendFollowerDescriptions);
			setFollowerList(checkedFriendFollowerDescriptions);
		})();
	}, []);

	const toProfileDetailPage = (id: string) => {
		props.globalState.setFriendId(id);
		props.navigation.navigate('friendProfile');
	};
	return(
		<FlatList
			style={styles.container}
			data={_followerList}
			keyExtractor={item => item.uid}
			renderItem={({item}) =>
				<View style={styles.cell}>
					<TouchableOpacity onPress={() => {toProfileDetailPage(item.uid);}}>
						<Avatar
							rounded
							containerStyle={{marginLeft: 20, marginTop: 9}}
							source={{ uri: item.iconURL }}
						/>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {toProfileDetailPage(item.uid);}}>
						<View style={{marginRight: '45%'}}>
							<Text style={styles.text}　numberOfLines={1} ellipsizeMode="tail">{item.userName}</Text>
						</View>
					</TouchableOpacity>
					<FollowButton
						id={item.uid}
						isFollowExchange={item.followExchange}
						userId = {props.globalState.state.uid}
					/>
				</View>
			}
		/>
	);
};

export const FriendFollowerListWrapper:React.FC<TopStackNavProps<'friendFollowerList'>> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{
				(globalState:GlobalContainer) => <FriendFollowerList globalState={globalState} navigation = {navigation} />
			}
		</Subscribe>
	);
};



