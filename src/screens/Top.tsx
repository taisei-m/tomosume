import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

//@ts-ignore
import firebase from '../../firebase';
import Item from '../components/Item';

interface Data {
    shopName: string,
    favoriteMenu: string,
}

const getData = (): object | undefined => {
    const [postedData, changePostedData] = useState<Data>();
    useEffect(() => {
        firebase
        .firestore()
        .collection('postShopData')
        .onSnapshot((snapshot) => {
            const tempShopData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
            }))
            changePostedData(tempShopData)
        })
    }, [])
    return postedData
}

const Top = () => {
    const shopData = getData()
    return(
        <View style={styles.container}>
            <FlatList
            data={shopData}
            renderItem={
                ({ item }) => <Item 
                                title={item.shopName} 
                                category={item.category} 
                                price={item.price} 
                                favorite={item.favoriteMenu}/>
                }
            keyExtractor={item => item.id}
            />
        </View>
    )
}

export default Top

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    listItem: {
        marginTop: 10,
        marginBottom: 10,
    },
    userInfomation: {
        flexDirection: 'row',
        marginBottom: 10
    },
    userName: {
        fontSize: 18,
        paddingTop: 5,
        paddingLeft: 10
    },
    shopName: {
        fontSize: 25,
        marginLeft: 10
    },
    favoriteMenu: {
        margin: 10
    },
    rating: {
        marginLeft: 10
    },
    ratingText: {
        marginLeft: 5,
        marginTop: 2
    },
    tinyLogo: {
        width: 80,
        height: 80,
    },
    logo: {
        width: 66,
        height: 58,
    },
});