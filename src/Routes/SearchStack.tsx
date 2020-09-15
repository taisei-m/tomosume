import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SearchWrapper } from '../screens/Search/Search';
import { FriendProfileWrapper } from '../screens/FriendProfile/FriendProfile';
import { FriendFolloweeListWrapper } from '../screens/FriendFolloweeList/FriendFolloweeList';
import { FriendFollowerListWrapper } from '../screens/FriendFollowerList/FriendFollowerList';
import { SearchStackParamList } from '../types/types';

const SearchNavStack = createStackNavigator<SearchStackParamList>();

export const SearchStack: React.FC = () => {
	return (
		<SearchNavStack.Navigator>
			<SearchNavStack.Screen
				name="search"
				component={SearchWrapper}
				options={{
					headerShown: false,
					title: '検索',
				}}
			/>
			<SearchNavStack.Screen
				name="friendProfile"
				component={FriendProfileWrapper}
				options={{
					headerShown: true,
					title: 'プロフィール',
				}}
			/>
			<SearchNavStack.Screen
				name="friendFollowerList"
				component={FriendFollowerListWrapper}
				options={{
					headerShown: true,
					title: 'フォローリスト',
				}}
			/>
			<SearchNavStack.Screen
				name="friendFolloweeList"
				component={FriendFolloweeListWrapper}
				options={{
					headerShown: true,
					title: 'フォロワーリスト',
				}}
			/>
		</SearchNavStack.Navigator>
	);
};
