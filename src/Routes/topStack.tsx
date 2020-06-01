import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Top from '../screens/Top';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';
import friendProfile from '../screens/friendProfile';
import friendFollowerList from '../screens/friendFollowerList';
import friendFolloweeList from '../screens/friendFolloweeList'

const TopNavStack = createStackNavigator();

const TopStack = (props) => {
    let navigation = props.navigation;
    React.useEffect(( ) => {
        const unsubscribe = navigation.addListener('tabPress', e => {
            navigation.navigate('Top')
        });
        return unsubscribe;
    }, [navigation]);

    return (
    <TopNavStack.Navigator>
        <TopNavStack.Screen
            name="Top"
            component={Top}
            options={{
                headerShown: false,
            }}
        />
        <TopNavStack.Screen
            name="friendProfile"
            component={friendProfile}
            options={{
                headerShown: true,
            }}
        />
        <TopNavStack.Screen
            name="friendFollowerList"
            component={friendFollowerList}
            options={{ headerShown: true }}
        />
        <TopNavStack.Screen
            name="friendFolloweeList"
            component={friendFolloweeList}
            options={{ headerShown: true }}
        />
    </TopNavStack.Navigator>
    )
};

const topStackWrapper = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalStateContainer]}>
            {
                globalState => <TopStack globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}

export default topStackWrapper
