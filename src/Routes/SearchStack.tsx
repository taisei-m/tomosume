import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import search from '../screens/Search'
import friendProfile from '../screens/friendProfile'
import friendFollowerList from '../screens/friendFolloweeList';
import friendFolloweeList from '../screens/friendFollowerList'

type SearchStackParamList = {
    search: {
        headerShown: boolean
        title: string
    }
    friendProfile: undefined
    friendFollowerList: undefined
    friendFolloweeList: undefined
}

const SearchNavStack = createStackNavigator<SearchStackParamList>();

export const SearchStack: React.FC = () => {
    return (
    <SearchNavStack.Navigator>
        <SearchNavStack.Screen
            name="search"
            component={search}
            options={{
                headerShown: false,
                title: '検索'
            }}
        />
        <SearchNavStack.Screen
            name="friendProfile"
            component={friendProfile}
            options={{
                headerShown: true,
                title: 'プロフィール'
            }}
        />
        <SearchNavStack.Screen
            name="friendFollowerList"
            component={friendFollowerList}
            options={{
                headerShown: true,
                title: 'フォローリスト',
            }}
        />
        <SearchNavStack.Screen
            name="friendFolloweeList"
            component={friendFolloweeList}
            options={{
                headerShown: true,
                title: 'フォロワーリスト'
            }}
        />
    </SearchNavStack.Navigator>
    )
};


