import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
//@ts-ignore
import DropdownMenu from 'react-native-dropdown-menu';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../../firebaseConfig'
import InputText from '../components/InputText';
import apiKey from '../api/api_key';
import GlobalStateContainer from '../containers/GlobalState';
import { Subscribe } from 'unstated';
import {PredictionJsonType} from '../types/types'
import {predictionsArrayType} from '../types/types'
// import {predictionsType} from '../types/types'
// import {structuredFormattingType} from '../types/types'

const Post: React.FC = (props) => {
    const [shopName, setShopName] = useState<string>('');
    const [favoriteMenu, changeFavorite] = useState<string>('');
    // 最終的にはnumber型にする。　その際に該当するファイルの型を変更する
    const [price, changePrice] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [address, setShopAddress] = useState<string>('');
    const [inputedShopName, setInputedShopName] =useState<string>('');
    const [predictions, setPredictions] = useState<predictionsArrayType>();
    const [isShownPredictions, setIsShownPredictions] = useState<boolean>(false);

    const selectCategory = (category: string) => {
        setCategory(category)
    }
    const change = (text: string) => {
        setInputedShopName(text);
    }
    const close = () => {
        //　falseになると検索結果の一覧が表示されなくなる
        setIsShownPredictions(false)
        change('')
    }
    const selectShopName = (shopName: string, address: string) => {
        setShopAddress(address)
        setShopName(shopName)
    }
    const callApi = async () => {
        if (inputedShopName == '') {
            alert('店名を入力してください')
        } else {
            const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}
            &input=${inputedShopName}&location=34.7263212, 137.7176678
            &language=ja&radius=5000`;
            try {
                const searchPredictionResult: Response = await fetch(apiUrl);
                const json = await searchPredictionResult.json() as PredictionJsonType;
                //　検索結果の一覧を表示される
                setIsShownPredictions(true)
                setPredictions(json.predictions)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const share = async() => {
        //たいせいのログインの機能が完成したらprops.globalStateの値に書き換える
        const userId = props.globalState.state.uid
        console.log(props.globalState.state.uid)
        const shopReview = firebase.firestore().collection('shops')
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;
        let latitude: number = 0
        let longitude: number = 0
        let placeId: string = ''
        try {
            const result = await fetch(apiUrl);
            const json = await result.json();
            let setShopLocationData = (()=> {
                return new Promise((resolve) => {
                    latitude = json.results[0].geometry.location.lat
                    longitude = json.results[0].geometry.location.lng
                    placeId = json.results[0].place_id
                    resolve();
                });
            })
            setShopLocationData().then(() => {
                shopReview.doc(placeId).set({
                    shopName: shopName,
                    address: address,
                    latitude: latitude,
                    longitude: longitude,
                })
                .then(function() {
                    shopReview.doc(placeId).collection('reviews').doc(placeId + userId).set({
                        shopId: placeId,
                        user: firebase.firestore().collection('userList').doc(userId),
                        shopAddress: address,
                        shopName: shopName,
                        favoriteMenu: favoriteMenu,
                        price: price,
                        category: category,
                        createdAt: new Date(),
                    })
                })
                .then(function() {
                    console.log('success')
                    setShopName('')
                    changeFavorite('')
                    changePrice('')
                    setCategory('')
                })
                .catch(function(error: any) {
                    console.log(error, '1')
                })
            })
        } catch (error) {
            console.log(error, '2')
        }
    }
    return (
        <View style={styles.container}>
            <View style={{marginTop: 70}}>
            <Text style={styles.itemName}>
                店名検索
            </Text>
            <View style={{ flexDirection: 'row', marginHorizontal: 60}}>
            <TextInput
                style={styles.input}
                placeholder="例）新宿　吉野家"
                value={inputedShopName}
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
                isShownPredictions ?
            <View>
            <FlatList
                data={predictions}
                renderItem={({ item }) =>
                <TouchableOpacity
                    onPress={
                        () => selectShopName(item.structured_formatting.main_text, item.description)
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
                店名 (必須)
            </Text>
            <InputText
                holderName='店名'
                value={shopName}
                change={selectShopName}
                canEdit={false}
            />
            <Text style={styles.itemName}>
                カテゴリー (必須)
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
                    value={category}
                    onChangeText={selectCategory}
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
                    disabled={category == '' || shopName == ''}
                />
            </View>
            </View>
        </View>
    );
}

const PostWrapper = ({ navigation }) => {
	return (
			<Subscribe to={[GlobalStateContainer]}>
				{
					globalState => <Post globalState={globalState} navigation = {navigation} />
				}
			</Subscribe>
	);
	}

export default PostWrapper;

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 0
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

//ChIJUdNf03veGmARWgnQGmH1Hyo