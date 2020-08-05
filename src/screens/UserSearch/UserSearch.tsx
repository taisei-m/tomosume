import React, {useState, useEffect } from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native'
import { SearchBar, Avatar, Icon } from 'react-native-elements';
import { useDebounce } from "use-debounce";
import FollowButton from '../../components/FollowButton'
import { Subscribe } from 'unstated';
import GlobalContainer from '../../store/GlobalState';
import {candidateUserDescriptionsType, ProfileStackNavProps, ContainerProps } from '../../types/types'
import {styles} from './style'
import { checkFollowExchange, showFrinedCandidates } from './index'

const UserSearch:React.FC<ProfileStackNavProps<'UserSearchWrapper'> & ContainerProps> = (props) => {
    const [_searchedUserName, setSearchedUserName] = useState<string>('')
    // _searchUserNameの値が確定してから1秒後にvalueに_searchedUserNameを代入する
    const [value] = useDebounce(_searchedUserName, 800);
    const [_candidateUsersList, setCandidateUsersList] = useState<candidateUserDescriptionsType>()

    useEffect(() => {
        (async() => {
            const candidateUserDescriptions = await showFrinedCandidates(value)
            const candidates = await checkFollowExchange(props.globalState.state.uid, candidateUserDescriptions)
            setCandidateUsersList(candidates)
        })()
    },[value])

    const searchUsers = (userName: string) => {
        setSearchedUserName(userName)
    }
    const toUserDetailPage = (uid: string) => {
        props.globalState.setFriendId(uid)
        props.navigation.navigate('friendProfile')
    }
    return (
        <>
        <SearchBar
            placeholder="ユーザ名を入力してください"
            onChangeText={searchUsers}
            value={_searchedUserName}
            placeholderTextColor='grey'
            lightTheme
            containerStyle={{backgroundColor: 'white'}}
            inputContainerStyle={{backgroundColor: 'white'}}
            searchIcon={
                <Icon
                    name='search'
                    color='#fbd01d'
                />
            }
        />
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
        </>
    );
}

export const UserSearchWrapper:React.FC<ProfileStackNavProps<'UserSearchWrapper'>> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{
				(globalState:GlobalContainer) => <UserSearch globalState={globalState} navigation = {navigation} />
			}
		</Subscribe>
	);
	}

