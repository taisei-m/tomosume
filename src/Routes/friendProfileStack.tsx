import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import friendProfile from '../screens/friendProfile';
import friendFolloweeList from '../screens/friendFolloweeList';
import friendFollowerList from '../screens/friendFollowerList'
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';

const FriendProfileNavStack = createStackNavigator();

const FriendProfileStack = (props) => {
    let navigation = props.navigation;
    React.useEffect(( ) => {
        const unsubscribe = navigation.addListener('tabPress', e => {
            navigation.navigate('friendProfile')
        });
        return unsubscribe;
    }, [navigation]);

    return (
    <FriendProfileNavStack.Navigator>
        <FriendProfileNavStack.Screen
            name="friendProfile"
            component={friendProfile}
            options={{
                headerShown: false,
            }}
        />
        <FriendProfileNavStack.Screen
            name="friendFollowerList"
            component={friendFollowerList}
            options={{ headerShown: true }}
        />
        <FriendProfileNavStack.Screen
            name="friendFolloweeList"
            component={friendFolloweeList}
            options={{ headerShown: true }}
        />
    </FriendProfileNavStack.Navigator>
    )
};

const ProfileStackWrapper = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalStateContainer]}>
            {
                globalState => <FriendProfileStack globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}

export default ProfileStackWrapper;
