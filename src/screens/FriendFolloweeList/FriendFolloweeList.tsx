import React, {useState, useEffect} from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Avatar,  } from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalContainer from '../../store/GlobalState';
import FollowButton from '../../components/FollowButton';
import { TopStackNavProps, ContainerProps, UserDescriptionsType } from '../../types/types';
import { styles } from './style';
import { fetchFolloweeIds, fetchFriendFolloweeDescriptions, checkFollowExchange } from './index';

const FriendFolloweeList:React.FC<TopStackNavProps<'friendFolloweeList'> & ContainerProps> = (props) => {
	const [_followeeList, setFolloweeList] = useState<UserDescriptionsType>();
	useEffect(() => {
		(async () => {
			const followeeIds = await fetchFolloweeIds(props.globalState.state.friendId);
			const friendFolloweeDescriptions = await fetchFriendFolloweeDescriptions(followeeIds);
			const checkedFriendFolloweeDescriptions =  await checkFollowExchange(props.globalState.state.uid, friendFolloweeDescriptions);
			setFolloweeList(checkedFriendFolloweeDescriptions);
		})();
	}, []);
	const toProfileDetailPage = (id: string) => {
		props.globalState.setFriendId(id);
		props.navigation.navigate('friendProfile');
	};
	return(
		<FlatList
			style={styles.container}
			data={_followeeList}
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

export const FriendFolloweeListWrapper:React.FC<TopStackNavProps<'friendFolloweeList'>> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{
				(globalState:GlobalContainer) => <FriendFolloweeList globalState={globalState} navigation = {navigation} />
			}
		</Subscribe>
	);
};

