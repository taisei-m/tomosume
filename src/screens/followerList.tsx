import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Dimensions,FlatList, Text, TouchableOpacity } from 'react-native';
import { Avatar,  } from 'react-native-elements'
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';
import {db} from '../../firebaseConfig'


type userProfileType = {
    userName: string
    iconURL: string
    uid?: string
}

type followerListType = userProfileType[]

const FollowerList = (props) => {
    const [_followerList, setFollowerList] = useState<followerListType>();
    const [_hasFollowed, setHasFollowed] = useState<boolean>(false)
    useEffect(() => {
        (async () => {
            const userId = props.globalState.state.userData.uid
            let followerIdList: string[] = []
            let followerUserList: followerListType = []
            let userProfileData: userProfileType
            const querySnapshot = await db.collection('userList').doc(userId).collection('follower').get()
            querySnapshot.forEach((data) => {
                followerIdList.push(data.id)
            })
            //firstを削除しないとuidがundefinedというエラーが発生する
            followerIdList = followerIdList.filter(id => id != 'first')
            followerUserList = await Promise.all(followerIdList.map(async (item) => {
                //awaitしないと先にreturnが実行される
                await db.collection('userList').doc(item).get()
                .then(function(doc) {
                    userProfileData = doc.data() as userProfileType
                })
                return userProfileData;
            }))
            console.log(followerUserList, 'result')
            setFollowerList(followerUserList)
        })();
    }, [])
    const follow = (id: string) => {
        const userId = props.globalState.state.userData.uid
        db.collection('userList').doc(userId).collection('follower').doc(id).set({})
        db.collection('userList').doc(id).collection('followee').doc(userId).set({})
        changeButtonColor()
    }
    //ボタンごとで色を変更できるようにする
    const changeButtonColor = () => {
        setHasFollowed(!_hasFollowed)
    }
    return(
        <FlatList
            style={styles.container}
            data={_followerList}
            keyExtractor={item => item.uid}
            renderItem={({item}) =>
                <View style={styles.cell}>
                    <Avatar
                        rounded
                        containerStyle={{marginLeft: 20, marginTop: 9}}
                        source={{ uri: item.iconURL }}/>
                    <Text style={styles.text}>{item.userName}</Text>
                    <TouchableOpacity
                        style={
                            _hasFollowed
                            ?styles.followButton
                            :styles.notFollowButton
                        }
                        onPress={() => {follow(item.uid)}}
                        >
                        <Text style={{color: 'white'}}>フォロー</Text>
                    </TouchableOpacity>
                </View>
            }
        />
    )
}

const followerListWrapper = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalStateContainer]}>
            {
                globalState => <FollowerList globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}

export default followerListWrapper;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
        backgroundColor: 'white',
    },
    cell: {
        flexDirection: 'row',
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: '#f5f5f5',
        height: 50,
    },
    text: {
        fontSize: 18,
        marginLeft: 15,
        marginTop: 15
    },
    followButton: {
        width: 100,
        backgroundColor:"#5E9CFE",
        borderRadius:15,
        height:30,
        alignItems:"center",
        justifyContent:"center",
        borderColor: '#5E9CFE',
        borderWidth: 1,
        position: 'absolute',
        top: 10,
        right: 10
    },
    notFollowButton: {
        width: 100,
        backgroundColor:"grey",
        borderRadius:15,
        height:30,
        alignItems:"center",
        justifyContent:"center",
        borderColor: '#5E9CFE',
        borderWidth: 1,
        position: 'absolute',
        top: 10,
        right: 10
    }
});
