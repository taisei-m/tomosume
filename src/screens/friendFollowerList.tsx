import React, {useState, useEffect} from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { Avatar,  } from 'react-native-elements'
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';
import {db} from '../../firebaseConfig'
import FollowButton from '../components/FollowButton'
import {followerProfileType} from '../types/types'
import {followerListType} from '../types/types'

const FollowerList = (props) => {
    const [_followerList, setFollowerList] = useState<followerListType>();
    useEffect(() => {
        (async () => {
            const friendId = props.globalState.state.friendId
            let followerIdList: string[] = []
            let followerUserList: followerListType = []
            let followerProfileData: followerProfileType
            // フォローしているユーザのuidをfollowerIdListへ追加
            const querySnapshot = await db.collection('userList').doc(friendId).collection('follower').get()
            querySnapshot.forEach((data) => {
                followerIdList.push(data.id)
            })
            //firstを削除しないとuidがundefinedというエラーが発生する
            followerIdList = followerIdList.filter(id => id != 'first')
            // フォローしているユーザのデータをオブジェクトの配列として返す
            followerUserList = await Promise.all(followerIdList.map(async (item) => {
                //awaitしないと先にreturnが実行される
                await db.collection('userList').doc(item).get()
                .then(function(doc) {
                    followerProfileData = doc.data() as followerProfileType
                })
                return followerProfileData;
            }))
            const checkedFollowExchangeArray =  await checkFollowExchange(followerUserList)
            setFollowerList(checkedFollowExchangeArray)
        })();
    }, [])
    const checkFollowExchange = async(followeeList: followerListType): Promise<followerListType> => {
        const userId = props.globalState.state.uid
        const followerUserList: string[] = []
        const followerList = await db.collection('userList').doc(userId).collection('follower').get()
        followerList.forEach((data) => {
            followerUserList.push(data.id)
        })
        //　フォローリストとフォロワーリストの比べる。　フォロワーリストのユーザを一人一人取り出し、そのユーザがフォローリストに含まれるかを検証する
        followeeList.forEach((item) => {
            let followeeUserId = item.uid
            let isFollowExchange = followerUserList.includes(followeeUserId)
        // 相互フォローの場合true, 相互フォローしていない場合falseを代入
            isFollowExchange ? item.followExchange = true : item.followExchange = false
        })
        return followeeList
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
                    <FollowButton
                        id={item.uid}
                        isFollowExchange={item.followExchange}
                        userId = {props.globalState.state.uid}
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
