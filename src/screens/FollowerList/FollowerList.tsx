import React, {useState, useEffect} from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalContainer from '../../store/GlobalState';
import FollowButton from '../../components/FollowButton';
import { styles } from './style';
import { fetchFollowers, getFollowerDescriptions } from './index';
import { ContainerProps, followersType, ProfileStackNavProps } from '../../types/types';
import { checkFollowExchange } from './index';

const FollowerList:React.FC<ProfileStackNavProps<'followerList'> & ContainerProps> = (props) => {
	const [_followerList, setFollowerList] = useState<followersType>();

	useEffect(() => {
		(async () => {
			const followerIds = await fetchFollowers(props.globalState.state.uid);
			// フォローしているユーザのデータをオブジェクトの配列として返す
			const followerDescriptions = await getFollowerDescriptions(followerIds);
			const checkedFollowers = await checkFollowExchange(followerDescriptions, props.globalState.state.uid);
			setFollowerList(checkedFollowers);
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
							source={{ uri: item.iconURL }}/>
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

export const FollowerListWrapper:React.FC<ProfileStackNavProps<'followerList'>> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{
				(globalState: GlobalContainer) => <FollowerList globalState={globalState} navigation = {navigation} />
			}
		</Subscribe>
	);
};

