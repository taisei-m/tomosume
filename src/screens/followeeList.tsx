import React, {useState, useEffect, useCallback} from 'react';
import { View, StyleSheet,FlatList, Text, TouchableOpacity } from 'react-native';
import { Avatar,  } from 'react-native-elements'
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';
import {db} from '../../firebaseConfig'
import FollowButton from '../components/FollowButton'

type userProfileType = {
    userName: string
    iconURL: string
    uid: string
    followingMutually?: boolean
}

type followerListType = userProfileType[]

const FollowerList = (props) => {
    const [_followeeList, setFolloweeList] = useState<followerListType>();
    useEffect(() => {
        (async () => {
            const userId = props.globalState.state.userData.uid
            let followeeIdList: string[] = []
            let followeeUserList: followerListType = []
            let userProfileData: userProfileType
            const querySnapshot = await db.collection('userList').doc(userId).collection('followee').get()
            querySnapshot.forEach((data) => {
                followeeIdList.push(data.id)
            })
            //firstを削除しないとuidがundefinedというエラーが発生する
            followeeIdList = followeeIdList.filter(id => id != 'first')
            followeeUserList = await Promise.all(followeeIdList.map(async (item) => {
                //awaitしないと先にreturnが実行される
                await db.collection('userList').doc(item).get()
                .then(function(doc) {
                    userProfileData = doc.data() as userProfileType
                })
                return userProfileData;
            }))
            console.log(followeeUserList, 'result')
            const newArray =  await checkFollowingMutually(followeeUserList)
            //functional updates(高級関数)を使う方法の方がナイス
            setFolloweeList(newArray)
            // setFolloweeList( prevFollowerUserList => {
            //     const newFolloweeUserList = followeeUserList;
            //     checkFollowingMutually(newFolloweeUserList)
            //     return newFolloweeUserList
            // }
            // )
        })();
    }, [])
    //相互フォローをしているかのチェックをする
    const checkFollowingMutually = async(followeeList: followerListType): Promise<followerListType> => {
        const userId = props.globalState.state.userData.uid
        const followeeUserArray: string[] = []
        // console.log(followeeList)
        const followerList = await db.collection('userList').doc(userId).collection('follower').get()
        followerList.forEach((data) => {
            followeeUserArray.push(data.id)
        })
        followeeList.forEach((item) => {
            let followeeUserId = item.uid
            let isfollowingMutually = followeeUserArray.includes(followeeUserId)
            isfollowingMutually ? item.followingMutually = true : item.followingMutually = false
        })
        return followeeList
        // console.log(followeeList)
    }
    return(
        <FlatList
            style={styles.container}
            data={_followeeList}
            keyExtractor={item => item.uid}
            renderItem={({item}) =>
                <View style={styles.cell}>
                    <Avatar
                        rounded
                        containerStyle={{marginLeft: 20, marginTop: 9}}
                        source={{ uri: item.iconURL }}/>
                    <Text style={styles.text}>{item.userName}</Text>
                    <FollowButton
                        id={item.uid}
                        isfollowingMutually={item.followingMutually}
                    />
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
});
