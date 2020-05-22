import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
//@ts-ignore
import firebase from '../../firebase';
import Item from '../components/Item';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';


interface Data {
    shopName: string,
    favoriteMenu: string,
}

const Top = (props) => {
    const [shopData, setShopData] = useState<string[]>([])

    console.log("Top component ----------------------")
    console.log("isSignout = " + props.globalState.state.isSignout)
    console.log("isSplash = " + props.globalState.state.isSplash)
    console.log("userData = " + props.globalState.state.userData)

    
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