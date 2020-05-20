import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
//@ts-ignore
import firebase from '../../firebase';
import Item from '../components/Item';

interface Data {
    shopName: string,
    favoriteMenu: string,
}

const Top = () => {
    const [shopData, setShopData] = useState<string[]>([])
    useEffect(() => {
        let dataArray: string[] = []
        firebase
        .firestore()
        .collectionGroup('reviews')
        .orderBy('createdAt', 'desc')
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                let tmp = doc.data()
                tmp.id = doc.id
                dataArray.push(tmp)
            })
            setShopData(dataArray)
        })
    }, [])
    return(
        <View style={styles.container}>
            <FlatList
            style={styles.list}
            data={shopData}
            renderItem={
                ({ item }) => <Item 
                                id={item.shopId}
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