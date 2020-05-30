import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Top from '../screens/Top';
import { Ionicons } from '@expo/vector-icons';
import { Subscribe } from 'unstated';
import friendProfile from '../screens/friendProfile'
//@ts-ignore
import GlobalStateContainer from '../containers/GlobalState';

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
                    headerLeft: () => (
                        <Ionicons
                            name={'md-menu'}
                            size={30}
                            style={{ marginLeft: 10 }}
                            onPress={() => {
                                console.log("sss");
                                props.navigation.navigate('idealDrawer')
                            }}
                        />
                    )
                }}
        />
        <TopNavStack.Screen
            name="friendProfile"
            component={friendProfile}
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
