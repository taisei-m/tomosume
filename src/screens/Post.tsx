import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
//@ts-ignore
import firebase from '../../firebase'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import InputText from '../components/InputText';
import ShareButton from '../components/ShareButton'

interface InputTextProps {
    onChangeText: any
    shopName: string
    favoriteMenu: string
    price: string
    locationResultLatitude: number
    locationResultLongitude: number
    locationResult: string
    selectedCategory: string
}

const Post: React.FC<InputTextProps>= () => {
    const [shopName, changeShop] = useState('')
    const [favoriteMenu, changeFavorite] = useState('')
    const [price, changePrice] = useState('')
    const [locationResultLatitude, setResultLatitude] = useState(0)
    const [locationResultLongitude, setResultLongitude] = useState(0)
    const [locationResult, permitResult] = useState('')
    const [selectedCategory, selectItem] = useState('')

    useEffect(() => {
        (async function () {
            let locationResult = await Permissions.askAsync(Permissions.LOCATION);
            inputResult()
            console.log(locationResult.status)
            if (locationResult.status !== 'granted') {
                alert('noo')
            } else if (locationResult.status === 'granted') {
                let location = await Location.getCurrentPositionAsync({});
                console.log('good')
                alert('ok')
                setLatitude(Number(JSON.stringify(location.coords.latitude)))
                setLongitude(Number(JSON.stringify(location.coords.longitude)))
            }
        }());
    }, [])
    const changeShopName = (text: string) => {
        changeShop(text)
    }
    const changeFavoriteMenu = (text: string) => {
        changeFavorite(text)
    }
    const changeMenuPrice = (price: string) => {
        changePrice(price)
    }
    const selectCategory = (text: string) => {
        selectItem(text)
    }
    const inputResult = () => {
        permitResult(locationResult)
    }
    const setLatitude = (latitude: number) => {
        setResultLatitude(latitude)
    }
    const setLongitude = (longitude: number) => {
        setResultLongitude(longitude)
    }
    return (
        <View style={styles.container}>
            <InputText 
                holderName='店名'
                value={shopName}
                change={changeShopName}
                // onChangeText={(text :string) => changeShop(text)}
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
                    data={
                        [
                            {value: '居酒屋',},
                            {value: 'カフェ',}, 
                            {value: 'ランチ',}, 
                            {value: 'ディナー',}
                        ]
                    }
                    value={selectedCategory}
                    onChangeText={selectCategory}
                />
            </View>
            <View style={{alignContent: 'center', marginHorizontal: 60, marginTop: 30 }}>
                <ShareButton
                    buttonTitle='シェア'
                    buttonType="outline"
                    shopName={shopName}
                    favoriteMenu={favoriteMenu}
                    price={price}
                    category={selectedCategory}
                    latitude={locationResultLatitude}
                    longitude={locationResultLongitude}
                />
            </View>
        </View>
    );
}

export default Post

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
})