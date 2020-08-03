import React, {useState, useEffect} from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements'
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../store/GlobalState';
import {db} from '../../firebaseConfig'
import FollowButton from '../components/FollowButton'
import {followeeProfileType} from '../types/types'
import {followeeListType} from '../types/types'
import {StackProps} from '../types/types'

const FolloweeList = (props:StackProps) => {
    const [_followeeList, setFolloweeList] = useState<followeeListType>();
    useEffect(() => {
        (async () => {
            const userId = props.globalState.state.uid
            let followeeIdList: string[] = []
            // フォローしているユーザのuidをfolloweeIdListへ追加
            const querySnapshot = await db.collection('userList').doc(userId).collection('followee').get()
            querySnapshot.forEach((data) => {
                followeeIdList.push(data.id)
            })
            //firstを削除しないとuidがundefinedというエラーが発生する
            followeeIdList = followeeIdList.filter(id => id != 'first')
            // フォローしているユーザのデータをオブジェクトの配列として返す
            let followeeUserList: followeeListType = []
            let followeeProfileData: followeeProfileType
            followeeUserList = await Promise.all(followeeIdList.map(async (item) => {
                //awaitしないと先にreturnが実行される
                await db.collection('userList').doc(item).get()
                .then(function(doc) {
                    followeeProfileData = doc.data() as followeeProfileType
                })
                return followeeProfileData;
            }))
            setFolloweeList(followeeUserList)
        })();
    }, [])
    const toProfileDetailPage = (id: string):void => {
        props.globalState.setFriendId(id)
        props.navigation.navigate('friendProfile')
    }
    return(
        <FlatList
            style={styles.container}
            data={_followeeList}
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
                        //自分がフォローしているので必ずtrueとして渡す
                        isFollowExchange={true}
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
                globalState => <FolloweeList globalState={globalState} navigation = {navigation} />
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
        marginTop: 15,
    },
});