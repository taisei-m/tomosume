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
        .collection('postData')
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
            style={styles.list}
            data={shopData}
            renderItem={
                ({ item }) => <Item 
                                id={item.id}
                                title={item.shopName} 
                                category={item.category} 
                                address={item.address}
                                price={item.price} 
                                favorite={item.favoriteMenu}
                                />
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
    list: {
        marginTop: 30
    },
});