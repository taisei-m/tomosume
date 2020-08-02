import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, ScrollView, RefreshControl } from 'react-native';
import {db} from '../../firebaseConfig'
import ListItem from '../components/ListItem';
import { Subscribe } from 'unstated';
import GlobalContainer from '../containers/GlobalState';
import {ReviewDocResponse} from '../types/types'
import {ReviewsDocResponse} from '../types/types'
import * as Permissions from 'expo-permissions'
import Icon from 'react-native-vector-icons/FontAwesome';
import {TopStackNavProps} from '../types/types'

type GlobalStateProps = {
    globalState: {
        state: {
            uid: string
        }
    setFriendId: (friendId: string) => void
    }
}

const Top:React.FC<TopStackNavProps<'Top'> & GlobalStateProps> = (props) => {
    const [allReviews, setAllReviews] = useState<ReviewsDocResponse>([])
    const [isRefreshed, setIsRefreshed] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [isReview , setIsReview] = useState<boolean>(true)
    const [pageDescription, setPageDescription] = useState<string>('')
    const userId = props.globalState.state.uid

    useEffect(() => {
        (async() => {
            Permissions.askAsync(Permissions.LOCATION);
        })()
    })
    useEffect(() => {
        (async () => {
            const uidArray = await getFollowingUid()
            // 自分の投稿も表示されるように自分のuidを追加する
            uidArray.push(userId)
            const convertedUidArray = await convertTypeToReference(uidArray)
            let reviewArray: ReviewsDocResponse = []
            const querySnapshot = await db.collectionGroup('reviews').where('user', 'in', convertedUidArray).orderBy('createdAt', 'desc').get()
            const queryDocsSnapshot = querySnapshot.docs
            reviewArray = await Promise.all(queryDocsSnapshot.map(async (item) => {
                let review = item.data() as ReviewDocResponse
                review.key = item.id
                const profile = await (review.user).get()
                review.userName = profile.get('userName')
                review.iconURL = profile.get('iconURL')
                review.userId = profile.id
                return review
            }))
            if (reviewArray.length == 0) {
                setIsReview(false)
                setPageDescription('ここには投稿されたレビューが表示されます。画面上部を引くことで、最新の投稿を確認することができます。')
            } else {
                setIsReview(true)
            }
            setAllReviews(reviewArray)
            setRefreshing(false)
        })()
    }, [isRefreshed])
    //　whereの条件で使う時にrefernce型が必要になるからstring型からreference型に変換する処理
    const convertTypeToReference = (array: string[]):firebase.firestore.DocumentReference[]=> {
        let reference: firebase.firestore.DocumentReference
        // 文字列firstを削除する
        array = array.filter(n => n !== 'first')
        let convertedArray = array.map((uid) => {
            reference = db.collection('userList').doc(uid)
            return reference
        })
        return convertedArray
    }
    // ログインユーザのフォローしているユーザのuidを取得する
    const getFollowingUid = async():Promise<string[]> => {
        let followingUidList: string[] = []
        // この書き方がsubcollectionの展開の仕方のはず
        const querySnapshot = await db.collection('userList').doc(userId).collection('followee').get()
        followingUidList =  querySnapshot.docs.map((doc) => {
            return doc.id
        })
        return followingUidList
    }
    // 友達のプロフィール欄に遷移する
    const toFriendProfile = (id: string):void => {
        props.globalState.setFriendId(id)
        props.navigation.navigate('friendProfile')
    }

    const handleRefresh = () => {
        setIsRefreshed(!isRefreshed)
        setRefreshing(true)
    }
    const updateReview = () => {
        setIsRefreshed(!isRefreshed)
        setRefreshing(true)
    }

    return(
        <View style={styles.container}>
            { isReview ?
            <FlatList
            data={allReviews}
            renderItem={
                ({ item }) => <ListItem
                                id={item.shopId}
                                title={item.shopName}
                                category={item.category}
                                address={item.shopAddress}
                                price={item.price}
                                favorite={item.favoriteMenu}
                                userName={item.userName}
                                iconURL={item.iconURL}
                                userId={item.userId}
                                pressMethod={toFriendProfile}
                                />
                }
            refreshing={refreshing}
            onRefresh={handleRefresh}
            />
            :
            <View>
                <ScrollView
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={() => updateReview()}
				/>
				}
			>
                <View style={styles.descriptionPosition}>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center'}}>
                        <Icon
                            name='hand-o-up'
                            color='#fbd01d'
                            size={40}
                        />
                        <Icon
                            name='arrow-down'
                            color='black'
                            size={25}
                            style={
                                {
                                    marginTop: 10,
                                    marginLeft: 5
                                }
                            }
                        />
                    </View>
                    <Text style={styles.description}>{pageDescription}</Text>
                </View>
            </ScrollView>
            </View>
        }
        </View>
    )
}

const ProfileWrapper: React.FC<TopStackNavProps<'Top'>> = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalContainer]}>
            {
                (globalState:GlobalContainer) => <Top globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}

export default ProfileWrapper

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingTop: 20,
        flex: 1
    },
    descriptionPosition: {
        marginHorizontal: 30,
        marginTop: 30,
    },
    description: {
        fontSize: 18,
        marginTop: 10
    }
});