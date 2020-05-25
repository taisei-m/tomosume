import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Dimensions,FlatList, Text, TouchableOpacity } from 'react-native';
import { Avatar,  } from 'react-native-elements'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
//@ts-ignore
import firebase from '../../firebaseConfig'
const FirstRoute = () => {
    let userId = firebase.auth().currentUser.uid;
    const [followeeArray, setFolloweeArray] = useState<string[]>();
    const [followStatus, changeStatus] = useState('follow')
    const [pressStatus, changePress] = useState(false)
    useEffect(() => {
        console.log('========')
        let tmpArray: string[] = []
        let followeeIdArray: string[] = []
        let db = firebase.firestore().collection('userList').doc(userId)
        db.collection('followee')
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                followeeIdArray.push(doc.id)
            })
            console.log(followeeIdArray)   
            var val = "first"
            var idx = followeeIdArray.indexOf(val);
            if(idx >= 0){
                followeeIdArray.splice(idx, 1); 
            }   
            console.log(followeeIdArray)      
        })
        .then(function() {
            followeeIdArray.forEach(function( value ) {
                console.log( value );
                firebase.firestore().collection('userList').doc(value)
                .get()
                .then(function(doc) {
                    let tmp = doc.data()
                    tmp.id = doc.id
                    tmpArray.push(tmp)
                })
                setFolloweeArray(tmpArray)
            });
        })
    }, [])
    const follow = () => {
        changePress(!pressStatus)
        if(followStatus == 'follow') {
            changeStatus('unfollow')
        } else {
            changeStatus('follow')
        }
    }
    return (
        <View style={styles.container}>
            <FlatList
                style={{ marginTop: 10}}
                data={followeeArray}
                renderItem={({item}) => 
                <View style={styles.listItem}>
                    <Avatar 
                        size="medium"
                        rounded 
                        icon={{ name: item.iconURL }}
                    />
                    <Text style={styles.item}>
                        {item.userName}
                    </Text>
                    <TouchableOpacity
                        style={
                        pressStatus
                        ? styles.followButton
                        : styles.unFollowButton
                        }
                        onPress={follow}
                    >
                        <Text 
                        style={
                            pressStatus
                            ? styles.followButtonText
                            : styles.unfollowButtonText
                            }>
                        {followStatus}
                        </Text>
                    </TouchableOpacity>
                </View>
                }
            />
        </View>
    );
}

const SecondRoute = () => {
    const [followStatus, changeStatus] = useState('follow')
    const [pressStatus, changePress] = useState(false)
    const follow = () => {
        changePress(!pressStatus)
        if(followStatus == 'follow') {
            changeStatus('unfollow')
        } else {
            changeStatus('follow')
        }
    }
    return (
        <View style={styles.container}>
            <FlatList
                style={{ marginTop: 10}}
                data={[
                    {key: 'Devin'},
                    {key: 'Dan'},
                    {key: 'Dominic'},
                    {key: 'Jackson'},
                    {key: 'James'},
                    {key: 'Joel'},
                    {key: 'John'},
                    {key: 'Jillian'},
                    {key: 'Jimmy'},
                    {key: 'Julie'},
                ]}
                renderItem={({item}) => 
                <View style={styles.listItem}>
                    <Avatar 
                        size="medium"
                        rounded 
                        icon={{ name: 'home' }}
                    />
                    <Text style={styles.item}>
                        {item.key}
                    </Text>
                    <TouchableOpacity
                        style={
                        pressStatus
                        ? styles.followButton
                        : styles.unFollowButton
                        }
                        onPress={follow}
                    >
                        <Text 
                        style={
                            pressStatus
                            ? styles.followButtonText
                            : styles.unfollowButtonText
                            }>
                        {followStatus}
                        </Text>
                    </TouchableOpacity>
                </View>
                }
            />
        </View>
    );
}

const initialLayout = { 
    width: Dimensions.get('window').width,
};

export default function TabViewExample() {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'フォロー'},
        { key: 'second', title: 'フォロワー' },
    ]);
    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });
    return (
        <TabView
            renderTabBar={props => 
            <TabBar  
                {...props}
                indicatorStyle={{backgroundColor: 'white'}}
                tabStyle={styles.bubble}
                activeColor={'#5E9CFE'}
                inactiveColor={"#aaaaaa"}
            />
            }
            navigationState={{ index, routes, }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
        />
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: 20,
    },
    listItem: {
        flexDirection: 'row',
        margin: 10
    },
    avatar: {
        paddingTop: 10
    },
    item: {
        padding: 10,
        paddingLeft: 20,
        fontSize: 25,
        height: 44,
    },
    followButton: {
        width:"30%",
        backgroundColor:"white",
        borderRadius:25,
        height:25,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 20,
        borderColor: '#5E9CFE',
        borderWidth: 1,
        position: 'absolute',
        top: -5,
        right: 10
    },
    unFollowButton: {
        width:"30%",
        backgroundColor:"#5E9CFE",
        borderRadius:25,
        height:25,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 20,
        borderColor: '#5E9CFE',
        borderWidth: 1,
        position: 'absolute',
        top: -5,
        right: 10
    },
    followButtonText: {
        color: '#5E9CFE'
    },
    unfollowButtonText: {
        color: 'white'
    },
    bubble: {
        backgroundColor: 'white',
        paddingHorizontal: 18,
        paddingVertical: 12,
        paddingTop: 50
    },
    
});