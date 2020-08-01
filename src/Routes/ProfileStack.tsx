import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../screens/Profile';
import followeeList from '../screens/followeeList';
import followerList from '../screens/followerList'
import Setting from '../screens/Setting'
import findUser from '../screens/findUser'
import friendProfile from '../screens/friendProfile'
import friendFollowerList from '../screens/friendFollowerList';
import friendFolloweeList from '../screens/friendFolloweeList'
import changeUserName from '../screens/changeUserName'

type ProfileStackParamList = {
    ProfileTop: undefined
    followerList: undefined
    followeeList: undefined
    toSettingPage: undefined
    findUser: undefined
    friendProfile: undefined
    friendFolloweeList: undefined
    friendFollowerList: undefined
    changeUserName: undefined
}
const ProfileNavStack = createStackNavigator<ProfileStackParamList>();

export const ProfileStack:React.FC = () => {
    return (
    <ProfileNavStack.Navigator>
        <ProfileNavStack.Screen
            name="ProfileTop"
            component={Profile}
            options={{
                headerShown: false,
                title: 'プロフィール',
            }}
        />
        <ProfileNavStack.Screen
            name="followerList"
            component={followerList}
            options={{
                headerShown: true,
                title: 'フォロワーリスト'
            }}
        />
        <ProfileNavStack.Screen
            name="followeeList"
            component={followeeList}
            options={{
                headerShown: true,
                title: 'フォローリスト'
            }}
        />
        <ProfileNavStack.Screen
            name="toSettingPage"
            component={Setting}
            options={{
                headerShown: true,
                title: '設定'
            }}
        />
        <ProfileNavStack.Screen
            name="findUser"
            component={findUser}
            options={{
                headerShown: true,
                title: 'ユーザー検索'
            }}
        />
        <ProfileNavStack.Screen
            name="friendProfile"
            component={friendProfile}
            options={{
                headerShown: true,
                title: 'プロフィール',
            }}
        />
        <ProfileNavStack.Screen
            name="friendFolloweeList"
            component={friendFolloweeList}
            options={{
                headerShown: true,
                title: 'フォローリスト',
            }}
        />
        <ProfileNavStack.Screen
        name="friendFollowerList"
        component={friendFollowerList}
        options={{
            headerShown: true,
            title: 'フォロワーリスト',
        }}
        />
        <ProfileNavStack.Screen
            name="changeUserName"
            component={changeUserName}
            options={{
                headerShown: true,
                title: 'ユーザー名変更',
            }}
        />
    </ProfileNavStack.Navigator>
    )
};