import React, {useState, useEffect} from 'react';
import { View, StyleSheet,FlatList, Text, TouchableOpacity } from 'react-native';
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
            const userId = props.globalState.state.uid
            let followerIdList: string[] = []
            // 自分をフォローしているユーザのuidを取得してfolloweeIdListへ追加する
            const querySnapshot = await db.collection('userList').doc(userId).collection('follower').get()
            querySnapshot.forEach((data) => {
                followerIdList.push(data.id)
            })
            //firstを削除しないとuidがundefinedというエラーが発生する
            followerIdList = followerIdList.filter(id => id != 'first')
            // フォロワーのユーザデータのオブジェクトの配列を返す
            let followerUserList: followerListType = []
            let followerProfileData: followerProfileType
            followerUserList = await Promise.all(followerIdList.map(async (item) => {
                //awaitしないと先にreturnが実行される
                await db.collection('userList').doc(item).get()
                .then(function(doc) {
                    followerProfileData = doc.data() as followerProfileType
                })
                return followerProfileData;
            }))
            // 相互フォローをしているかの真偽値を含むオブジェクトの配列
            const checkedFollowExchangeArray =  await checkFollowExchange(followerUserList)
            setFollowerList(checkedFollowExchangeArray)
        })();
    }, [])
    //相互フォローをしているかのチェックをする
    const checkFollowExchange = async(followerList: followerListType): Promise<followerListType> => {
        const userId = props.globalState.state.uid
        const followeeUserList: string[] = []
        const followeeList = await db.collection('userList').doc(userId).collection('followee').get()
        followeeList.forEach((data) => {
            followeeUserList.push(data.id)
        })
        //　フォローリストとフォロワーリストの比べる。　フォロワーリストのユーザを一人一人取り出し、そのユーザがフォローリストに含まれるかを検証する
        followerList.forEach((item) => {
            let followerUserId = item.uid
            let isFollowExchange = followeeUserList.includes(followerUserId)
        // 相互フォローの場合true, 相互フォローしていない場合falseを代入
            isFollowExchange ? item.followExchange = true : item.followExchange = false
        })
        return followerList
    }
    const toProfileDetailPage = (id) => {
        props.globalState.setFriendId(id)
        props.navigation.navigate('friendProfile')
    }
    return(
        <FlatList
            style={styles.container}
            data={_followerList}
            keyExtractor={item => item.uid}
            renderItem={({item}) =>
                <View style={styles.cell}>
                    <TouchableOpacity onPress={() => {toProfileDetailPage(item.uid)}}>
                    <Avatar
                        rounded
                        containerStyle={{marginLeft: 20, marginTop: 9}}
                        source={{ uri: item.iconURL }}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {toProfileDetailPage(item.uid)}}>
                        <View style={{marginRight: '45%'}}>
                            <Text style={styles.text}　numberOfLines={1} ellipsizeMode="tail">{item.userName}</Text>
                        </View>
                    </TouchableOpacity>
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
