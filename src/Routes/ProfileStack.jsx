import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../screens/Profile';
import followerList from '../screens/followerList';
import followeeList from '../screens/followeeList'
import Setting from '../screens/Setting'
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';


const ProfileNavStack = createStackNavigator();

const ProfileStack = (props) => {
    let navigation = props.navigation;
    React.useEffect(( ) => {
        const unsubscribe = navigation.addListener('tabPress', e => {
            navigation.navigate('ProfileTop')
        });
        return unsubscribe;
    }, [navigation]);

    return (
    <ProfileNavStack.Navigator>
        <ProfileNavStack.Screen
                name="ProfileTop"
                component={Profile}
                options={{
                    headerShown: false,
                }}
        />
        <ProfileNavStack.Screen
            name="followerList"
            component={followerList}
            options={{ headerShown: true }}
        />
        <ProfileNavStack.Screen
            name="followeeList"
            component={followeeList}
            options={{ headerShown: true }}
        />
        <ProfileNavStack.Screen
            name="toSettingPage"
            component={Setting}
            options={{ headerShown: true }}
        />
    </ProfileNavStack.Navigator>
    )
};

const ProfileStackWrapper = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalStateContainer]}>
            {
                globalState => <ProfileStack globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}

export default ProfileStackWrapper;
