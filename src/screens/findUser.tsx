import React, {useState, useEffect } from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native'
import { SearchBar, Avatar } from 'react-native-elements';
import { Icon } from 'react-native-elements'
import { useDebounce } from "use-debounce";
import {db} from '../../firebaseConfig'
import FollowButton from '../components/FollowButton'
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';
import {userProfileDataType} from '../types/types'
import {candidateUesrsDataListType} from '../types/types'

const FindUser = (props) => {
    const [_searchedUserName, setSearchedUserName] = useState<string>('')
    // _searchUserNameの値が確定してから1秒後にvalueに_searchedUserNameを代入する
    const [value] = useDebounce(_searchedUserName, 800);
    const [_isExistedCandidate, setIsExistedCandidate] = useState<boolean>(false)
    const [_candidateUsersList, setCandidateUsersList] = useState<candidateUesrsDataListType>()

    //async-awaitに書き換える
    useEffect(() => {
        let candidateUsersIdList:string[] = []
        let candidateUesrsDataList: candidateUesrsDataListType = []
        db.collection('userList').where('userName', '==', value).get()
        .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    candidateUsersIdList.push(doc.id)
                })
        })
        .then(() => {
            if(candidateUsersIdList != []) {
                setIsExistedCandidate(true)
            } else {
                setIsExistedCandidate(false)
            }
        })
        .then(async() => {
            candidateUesrsDataList = await Promise.all(candidateUsersIdList.map(async(userId) => {
                let userProfileData
                await db.collection('userList').doc(userId).get()
                .then((doc) => {
                    userProfileData = doc.data() as userProfileDataType
                })
                return userProfileData
            }))
        })
        .then(async() => {
            candidateUesrsDataList = await checkFollowExchange(candidateUesrsDataList)
        })
        .then(() => {
            setCandidateUsersList(candidateUesrsDataList)
        })
    },[value])
    // 検索結果のユーザをフォローしているかどうかの確認をする処理
    const checkFollowExchange = async(candidateUesrsDataList: candidateUesrsDataListType): Promise<candidateUesrsDataListType> => {
        const userId = props.globalState.state.uid
        const followerUserIdList: string[] = []
        const followerList = await db.collection('userList').doc(userId).collection('follower').get()
        followerList.forEach((data) => {
            followerUserIdList.push(data.id)
        })
        //　自分のフォローリストと検索結果のユーザリストを比べる。　検索結果のユーザリストのユーザを一人一人取り出し、そのユーザが自分のフォローリストに含まれるかを検証する
        candidateUesrsDataList.forEach((doc) => {
            let candidateUserId = doc.uid
            let isFollowExchange = followerUserIdList.includes(candidateUserId)
        // フォローしている場合true, フォローしていない場合falseを代入
            isFollowExchange ? doc.followExchange = true : doc.followExchange = false
        })
        return candidateUesrsDataList
    }

    const searchUsers = (userName: string) => {
        setSearchedUserName(userName)
    }
    const toUserDetailPage = (id) => {
        props.globalState.setFriendId(id)
        props.navigation.navigate('friendProfile')
    }

    return (
        <>
        <SearchBar
            placeholder="ユーザ検索"
            placeholderTextColor="black"
            onChangeText={searchUsers}
            value={_searchedUserName}
            placeholderTextColor='white'
            lightTheme
            containerStyle={{backgroundColor: 'white'}}
            inputContainerStyle={{backgroundColor: 'white'}}
            searchIcon={
                <Icon
                    name='search'
                    color='black'
                />
            }
        />
        {
            _isExistedCandidate
            ?
            <View>
            <FlatList
                style={styles.container}
                data={_candidateUsersList}
                keyExtractor={item => item.uid}
                renderItem={({item}) =>
                    <View style={styles.cell}>
                        <TouchableOpacity
                            onPress={() => {toUserDetailPage(item.uid)}}
                        >
                        <Avatar
                            rounded
                            containerStyle={{marginLeft: 20, marginTop: 9}}
                            source={{ uri: item.iconURL }}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {toUserDetailPage(item.uid)}}
                        >
                        <View style={{marginRight: '45%'}}>
                            <Text style={styles.text} numberOfLines={1}　ellipsizeMode="tail">{item.userName}</Text>
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
            </View>
            :
            <View>
                <Text>検索結果なし</Text>
            </View>
        }
        </>
    );
}

const FindUserWrapper = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalStateContainer]}>
			{
				globalState => <FindUser globalState={globalState} navigation = {navigation} />
			}
		</Subscribe>
	);
	}

export default FindUserWrapper

const styles = StyleSheet.create({
    container: {
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