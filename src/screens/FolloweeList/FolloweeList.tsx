import React, {useState, useEffect} from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Subscribe } from 'unstated';
import FollowButton from '../../components/FollowButton';
import { ContainerProps, followeesType, ProfileStackNavProps } from '../../types/types';
import { fetchFollowees, getFolloweeDescriptions } from './index';
import { styles } from './style';
import GlobalContainer from '../../store/GlobalState';

const FolloweeList:React.FC<ProfileStackNavProps<'followeeList'> & ContainerProps> = (props) => {
	const [_followeeList, setFolloweeList] = useState<followeesType>();

	useEffect(() => {
		(async () => {
			const followeeIds = await fetchFollowees(props.globalState.state.uid);
			// フォローしているユーザのデータをオブジェクトの配列として返す
			const followeeDescriptions = await getFolloweeDescriptions(followeeIds);
			setFolloweeList(followeeDescriptions);
		})();
	}, []);
	const toProfileDetailPage = (id: string):void => {
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
							source={{ uri: item.iconURL }}/>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {toProfileDetailPage(item.uid);}}>
						<View style={{marginRight: '45%'}}>
							<Text style={styles.text}　numberOfLines={1} ellipsizeMode="tail">{item.userName}</Text>
						</View>
					</TouchableOpacity>
					<FollowButton
						id={item.uid}
						//自分がフォローしているので必ずtrueとして渡す
						isFollowExchange={true}
						userId = {props.globalState.state.uid}
					/>
				</View>
			}
		/>
	);
};

export const FolloweeListWrapper:React.FC<ProfileStackNavProps<'followeeList'>> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{
				(globalState: GlobalContainer) => <FolloweeList globalState={globalState} navigation = {navigation} />
			}
		</Subscribe>
	);
};

