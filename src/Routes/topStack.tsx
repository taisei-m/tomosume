import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {TopWrapper} from '../screens/Top/Top';
import {FriendProfileWrapper} from '../screens/FriendProfile/FriendProfile';
import {FriendFolloweeListWrapper} from '../screens/FriendFolloweeList/FriendFolloweeList';
import {FriendFollowerListWrapper} from '../screens/FriendFollowerList/FriendFollowerList';
import {TopStackParamList} from '../types/types';

const TopNavStack = createStackNavigator<TopStackParamList>();

export const TopStack: React.FC = () => {
	return (
		<TopNavStack.Navigator>
			<TopNavStack.Screen
				name="Top"
				component={TopWrapper}
				options={{
					headerShown: false,
					title: 'トップ'
				}}
			/>
			<TopNavStack.Screen
				name="friendProfile"
				component={FriendProfileWrapper}
				options={{
					headerShown: true,
					title: 'プロフィール'
				}}
			/>
			<TopNavStack.Screen
				name="friendFollowerList"
				component={FriendFollowerListWrapper}
				options={{
					headerShown: true,
					title: 'フォロワーリスト'
				}}
			/>
			<TopNavStack.Screen
				name="friendFolloweeList"
				component={FriendFolloweeListWrapper}
				options={{
					headerShown: true,
					title: 'フォローリスト'
				}}
			/>
		</TopNavStack.Navigator>
	);
};
