import React, {useState, useEffect} from 'react';
import { View, StyleSheet,FlatList, Text } from 'react-native';
import { Avatar,  } from 'react-native-elements'
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';
import {db} from '../../firebaseConfig'
import FollowButton from '../components/FollowButton'
import {followeeProfileType} from '../types/types'
import {followeeListType} from '../types/types'

const FollowerList = (props) => {
    const [_followeeList, setFolloweeList] = useState<followeeListType>();
    useEffect(() => {
        (async () => {
            const userId = props.globalState.state.uid
            let followeeIdList: string[] = []
            let followeeUserList: followeeListType = []
            let followeeProfileData: followeeProfileType
            // 自分をフォローしているユーザのuidを取得してfolloweeIdListへ追加する
            const querySnapshot = await db.collection('userList').doc(userId).collection('followee').get()
            querySnapshot.forEach((data) => {
                followeeIdList.push(data.id)
            })
            //firstを削除しないとuidがundefinedというエラーが発生する
            followeeIdList = followeeIdList.filter(id => id != 'first')
            // フォロワーのユーザデータのオブジェクトの配列を返す
            followeeUserList = await Promise.all(followeeIdList.map(async (item) => {
                //awaitしないと先にreturnが実行される
                await db.collection('userList').doc(item).get()
                .then(function(doc) {
                    followeeProfileData = doc.data() as followeeProfileType
                })
                return followeeProfileData;
            }))
            // 相互フォローをしているかの真偽値を含むオブジェクトの配列
            const checkedFollowExchangeArray =  await checkFollowExchange(followeeUserList)
            setFolloweeList(checkedFollowExchangeArray)
        })();
    }, [])
    //相互フォローをしているかのチェックをする
    const checkFollowExchange = async(followeeList: followeeListType): Promise<followeeListType> => {
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
