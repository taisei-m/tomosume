import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {ProfileWrapper} from '../screens/Profile/Profile';
import {FolloweeListWrapper} from '../screens/FolloweeList/FolloweeList';
import {FollowerListWrapper} from '../screens/FollowerList/FollowerList';
import {SettingWrapper} from '../screens/Setting/Setting';
import {UserSearchWrapper} from '../screens/UserSearch/UserSearch';
import {FriendProfileWrapper} from '../screens/FriendProfile/FriendProfile';
import {FriendFollowerListWrapper} from '../screens/FriendFollowerList/FriendFollowerList';
import {FriendFolloweeListWrapper} from '../screens/FriendFolloweeList/FriendFolloweeList';
import {NameEditorWrapper} from '../screens/NameEditor/NameEditor';
import {ProfileStackParamList} from '../types/types';

const ProfileNavStack = createStackNavigator<ProfileStackParamList>();

export const ProfileStack:React.FC = () => {
	return (
		<ProfileNavStack.Navigator>
			<ProfileNavStack.Screen
				name="ProfileWrapper"
				component={ProfileWrapper}
				options={{
					headerShown: false,
					title: 'プロフィール',
				}}
			/>
			<ProfileNavStack.Screen
				name="followerList"
				component={FollowerListWrapper}
				options={{
					headerShown: true,
					title: 'フォロワーリスト'
				}}
			/>
			<ProfileNavStack.Screen
				name="followeeList"
				component={FolloweeListWrapper}
				options={{
					headerShown: true,
					title: 'フォローリスト'
				}}
			/>
			<ProfileNavStack.Screen
				name="setting"
				component={SettingWrapper}
				options={{
					headerShown: true,
					title: '設定'
				}}
			/>
			<ProfileNavStack.Screen
				name="UserSearchWrapper"
				component={UserSearchWrapper}
				options={{
					headerShown: true,
					title: 'ユーザー検索'
				}}
			/>
			<ProfileNavStack.Screen
				name="friendProfile"
				component={FriendProfileWrapper}
				options={{
					headerShown: true,
					title: 'プロフィール',
				}}
			/>
			<ProfileNavStack.Screen
				name="friendFolloweeList"
				component={FriendFolloweeListWrapper}
				options={{
					headerShown: true,
					title: 'フォローリスト',
				}}
			/>
			<ProfileNavStack.Screen
				name="friendFollowerList"
				component={FriendFollowerListWrapper}
				options={{
					headerShown: true,
					title: 'フォロワーリスト',
				}}
			/>
			<ProfileNavStack.Screen
				name="nameEditor"
				component={NameEditorWrapper}
				options={{
					headerShown: true,
					title: 'ユーザー名変更',
				}}
			/>
		</ProfileNavStack.Navigator>
	);
};