import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import search from '../screens/Search'
import friendProfile from '../screens/friendProfile'
import friendFollowerList from '../screens/friendFollowerList';
import friendFolloweeList from '../screens/friendFolloweeList'
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';

const SearchNavStack = createStackNavigator();

const SearchStack = (props) => {
    let navigation = props.navigation;
    // ページを移動してstackgがたまった状態でtabをタップするとsearchに遷移する
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', e => {
            navigation.navigate('seaerch')
        });
        return unsubscribe;
    }, [navigation]);

    return (
    <SearchNavStack.Navigator>
        <SearchNavStack.Screen
            name="seaerch"
            component={search}
            options={{
                headerShown: false,
            }}
        />
        <SearchNavStack.Screen
            name="friendProfile"
            component={friendProfile}
            options={{ headerShown: true }}
        />
        <SearchNavStack.Screen
            name="friendFollowerList"
            component={friendFollowerList}
            options={{ headerShown: true }}
        />
        <SearchNavStack.Screen
            name="friendFolloweeList"
            component={friendFolloweeList}
            options={{ headerShown: true }}
        />
    </SearchNavStack.Navigator>
    )
};

const ProfileStackWrapper = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalStateContainer]}>
            {
                globalState => <SearchStack globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}

export default ProfileStackWrapper;
