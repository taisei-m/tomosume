import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
//@ts-ignore
import firebase from '../../firebase'
import InputText from '../components/InputText';
import apiKey from '../api/api_key';

interface InputTextProps {
    onChangeText: any
    onKeyPress: any
    shopName: string
    address: string
    favoriteMenu: string
    price: string
    predictions: string[]
    locationResultLatitude: number
    locationResultLongitude: number
    locationResult: string
    selectedCategory: string
    showResult: boolean
}

const Post: React.FC<InputTextProps>= () => {
    const [shopName, changeShop] = useState('');
    const [favoriteMenu, changeFavorite] = useState('');
    const [price, changePrice] = useState('');
    const [selectedCategory, selectItem] = useState('');
    const [address, setAddress] = useState('');
    const [destination, setDestination] =useState('');
    const [predictions, setPredictions] = useState([]);
    const [showResult, setResult] = useState(false);

    const change = (text: string) => {
        setDestination(text);
    }
    const close = () => {
        setResult(false)
        change('')
    }
    const changeShopName = (text: string, address: string) => {
        setAddress(address)
        changeShop(text)
    }
    const callApi = async () => {
        const key = apiKey
        if (destination == '') {
            alert('店名を入力してください')
        } else {
            const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${key}
            &input=${destination}&location=34.7263212, 137.7176678
            &language=ja&radius=5000`;
            try {
                const result = await fetch(apiUrl);
                const json = await result.json();  
                setResult(true)
                setPredictions(json.predictions)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const share = async() => {
        const postShopData = firebase.firestore().collection('postData')
        const key = apiKey;
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`;
        let latitude = 0
        let longitude = 0
        try {
            const result = await fetch(apiUrl);
            const json = await result.json();
            let set = (function setLocationData () {
                return new Promise((resolve) => {
                    latitude = json.results[0].geometry.location.lat
                    longitude = json.results[0].geometry.location.lng
                    resolve();
                });
            })();
            Promise.all([set]).then(function() {
                postShopData.add({
                    shopName: shopName,
                    address: address,
                    favoriteMenu: favoriteMenu,
                    price: price,
                    category: selectedCategory,
                    createdAt: new Date(),
                    latitude: latitude,
                    longitude: longitude,
                })
                .then(function() {
                    console.log('success')
                })
                .catch(function(error: any) {
                    console.log(error)
                })
            })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <View style={styles.container}>
            <View style={{marginTop: 70}}>
            <Text
                style={styles.title}
            >投稿フォーム</Text>
            <Text style={styles.itemName}>
                店名検索
            </Text>
            <View style={{ flexDirection: 'row', marginHorizontal: 60}}>
            <TextInput 
                style={styles.input}
                placeholder="例）新宿　吉野家" 
                value={destination}
                onChangeText={change}
            />
            <Button 
                icon={
                    <Icon
                    name="search"
                    size={20}
                    color="black"
                    />
                }
                buttonStyle={styles.searchButton}
                type="clear"
                titleStyle={{fontSize: 15, color: 'grey'}}
                onPress={callApi}                
            >
            </Button>
            </View>
            {
                showResult ? 
            <View>
            <FlatList
                data={predictions}
                renderItem={({ item }) => 
                <TouchableOpacity
                    onPress={
                        () => changeShopName(item.structured_formatting.main_text, item.description)
                    }
                >
                    <Text style={styles.suggestion} key={item.id}>
                        {item.description}
                    </Text>
                </TouchableOpacity>
                }
                >
            </FlatList>
            <Button
                title={'close'}
                type='outline'
                buttonStyle={styles.closeButton}
                onPress={close}
            />
            </View>
            : null
            }
            <Text style={styles.itemName}>
                店名
            </Text>
            <InputText 
                holderName='店名'
                value={shopName}
                change={changeShopName}
                canEdit={false}
            />
            <Text style={styles.itemName}>
                カテゴリー
            </Text>
            <View style={{alignContent: 'center', marginHorizontal: 60 }}>
                <Dropdown
                    data={
                        [
                            {value: '居酒屋',},
                            {value: 'カフェ',}, 
                            {value: '中華',}, 
                            {value: 'ラーメン'},
                            {value: 'ランチ'},
                            {value: 'ディナー'},
                            {value: 'その他'},
                        ]
                    }
                    value={selectedCategory}
                    onChangeText={selectItem}
                />
            </View>
            <Text style={styles.itemName}>
                おすすめのメニュー
            </Text>
            <InputText 
                holderName='おすすめのメニューを入力して下さい'
                value={favoriteMenu}
                change={changeFavorite}
            />
            <Text style={styles.itemName}>
                値段
            </Text>
            <InputText 
                holderName='価格を入力して下さい'
                value={price}
                change={changePrice}
            />
            <View style={{alignContent: 'center', marginHorizontal: 60, marginTop: 30 }}>
                <Button
                    buttonStyle={{borderRadius: 20}}
                    title='投稿する'
                    type='solid'
                    onPress={share}
                    disabled={selectedCategory == '' || shopName == ''}
                />
            </View>
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
title: {
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 10
},
itemName: {
    marginLeft: 60,
    color: '#5E9CFE',
    marginTop: 20
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
searchButton: {
    width: 50,
    marginLeft: 5
},
closeButton: {
    marginHorizontal: 20,
    marginTop: 5
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
input: {
    backgroundColor: 'white',
    height: 40,
    padding: 5,
    fontSize: 18,
    borderBottomWidth: 0.5,
    width: 250
},
suggestion: {
    backgroundColor: 'white',
    padding: 5,
    fontSize: 18,
    borderWidth: 0.5,
    marginRight: 5,
    marginLeft: 5
}
})