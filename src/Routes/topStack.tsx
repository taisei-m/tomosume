import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Top from '../screens/Top';
import {FriendProfileWrapper} from '../screens/FriendProfile/FriendProfile';
import {FriendFolloweeListWrapper} from '../screens/FriendFolloweeList/FriendFolloweeList'
import friendFollowerList from '../screens/friendFollowerList'
import {TopStackParamList} from '../types/types'

const TopNavStack = createStackNavigator<TopStackParamList>();

export const TopStack: React.FC = () => {
    return (
    <TopNavStack.Navigator>
        <TopNavStack.Screen
            name="Top"
            component={Top}
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
            component={friendFollowerList}
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
    )
};
