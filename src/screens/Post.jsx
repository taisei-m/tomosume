import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, } from 'react-native';
import { Button, AirbnbRating} from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import firebase from '../../firebase'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import InputText from '../components/InputText';

export default function Post() {
    useEffect(() => {
        permit();
    }, [])

    let finalRating = 0
    const [locationResultLatitude, setResultLatitude] = useState()
    const [locationResultLongitude, setResultLongitude] = useState()
    const [locationResult, permitResult] = useState(null)
    const [selectedCategory, selectItem] = useState()

    const ratingCompleted = (rating) => {
        finalRating = rating
        console.log(finalRating)
    }
    const selectCategory = (text) => {
        selectItem(text)
        console.log(text)
    }
    const inputResult = () => {
        permitResult(locationResult)
    }
    const setLatitude = (latitude) => {
        setResultLatitude(latitude)
    }
    const setLongitude = (longitude) => {
        setResultLongitude(longitude)
    }

    const share = () => {
        const postShopData = firebase.firestore().collection('postShopData')
        postShopData.add({
            shopName: shopName,
            favoriteMenu: favoriteMenu,
            price: price,
            category: selectedCategory,
            rating: finalRating,
            createdAt: new Date(),
            latitude: locationResultLatitude,
            longitude: locationResultLongitude,
        })
        .then(function() {
            console.log('success')
        })
        .catch(function(error) {
            console.log(error)
        })
    }

    const permit = async () => {
        let locationResult = await Permissions.askAsync(Permissions.LOCATION);
        inputResult()
        console.log(locationResult.status)
        if (locationResult.status !== 'granted') {
            alert('noo')
        } else if (locationResult.status === 'granted') {
            alert('ok')
            let location = await Location.getCurrentPositionAsync({});
            console.log('good')
            setLatitude(JSON.stringify(location.coords.latitude))
            setLongitude(JSON.stringify(location.coords.longitude))
            console.log(locationResultLatitude)
            console.log(locationResultLongitude);
        }
    }
    const [shopName, changeShop] = useState()
    const [favoriteMenu, changeFavorite] = useState()
    const [price, changePrice] = useState()

    const changeShopName = (text) => {
        changeShop(text)
        console.log(shopName)
    }
    const changeFavoriteMenu = (text) => {
        changeFavorite(text)
        console.log(favoriteMenu)
    }
    const changeMenuPrice = (price) => {
        changePrice(price)
        console.log(price)
    }

    return (
        <View style={styles.container}>
            <InputText 
                holderName='店名'
                value={shopName}
                change={changeShopName}
            />
            <InputText 
                holderName='おすすめのメニュー'
                value={favoriteMenu}
                change={changeFavoriteMenu}
            />
            <InputText 
                holderName='価格'
                value={price}
                change={changeMenuPrice}
            />
        <View style={{alignContent: 'center', marginHorizontal: 60 }}>
            <Dropdown
                label='カテゴリー'
                data={[{
                value: '居酒屋',
                }, {
                value: 'カフェ',
                }, {
                value: 'ランチ',
                }, {
                value: 'ディナー',
                }]}
                value={selectedCategory}
                onChangeText={selectCategory}
            />
        </View>
        <AirbnbRating
            count={5}
            reviews={["1/5", "2/5", "3/5", "4/5", "5/5",]}
            defaultRating={0}
            size={30}
            onFinishRating={ratingCompleted}
        />
        <View style={{alignContent: 'center', marginHorizontal: 60, marginTop: 30 }}>
            <Button
            style={styles.shareButton}
            title="シェア"
            type="outline"
            onPress={share}
            />
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 30
},
inputView:{
    borderRadius:25,
    borderColor: 'black',
    height:50,
    marginBottom:20,
    padding:20,
    color: 'black',
    alignContent: 'center',
    marginHorizontal: 40
},
inputText:{
    height:50,
    color:"black",
    borderColor: '#818181',
    borderBottomWidth: 1,
    padding: 5
},
inputShopName: {
    width: 30
},
shareButton: {

}
})