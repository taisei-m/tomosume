import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {db} from '../../firebaseConfig'
import Item from '../components/Item';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';

type ReviewDocResponse = {
	category: string,
	createdAt: firebase.firestore.Timestamp,
	favoriteMenu: string,
	price: string,
	shopAddress: string,
	shopId: string,
	shopName: string
	user: firebase.firestore.DocumentReference
	userName?: string
	iconURL?: string
	key?: string
	userId?: string
}

type ReviewsDocResponse = ReviewDocResponse[]

const Top = (props) => {
    const [allReviews, setAllReviews] = useState<ReviewsDocResponse>([])
    useEffect(() => {
        (async () => {
            let reviewArray: ReviewsDocResponse = []
            const querySnapshot = await db.collectionGroup('reviews').orderBy('createdAt', 'desc').get()
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
            setAllReviews(reviewArray)
        })()
    }, [])

    const toFriendProfile = (id: string) => {
        props.globalState.setFriendId(id)
        // props.navigation.navigate('friendProfile')
        props.navigation.navigate('friendProfileStack')
    }

    return(
        <View style={styles.container}>
            <FlatList
            style={styles.list}
            data={allReviews}
            renderItem={
                ({ item }) => <Item
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
            />
        </View>
    )
}

const ProfileWrapper = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalStateContainer]}>
            {
                globalState => <Top globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}

export default ProfileWrapper

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    list: {
        marginTop: 30
    },
});