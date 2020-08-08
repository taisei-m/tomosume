import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {NavLoginParamList} from '../types/types'
import {Input} from 'react-native-elements'
import { Button } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import firebase from '../../firebaseConfig'
import apiKey from '../api/api_key';
import GlobalContainer from '../store/GlobalState';
import { Subscribe } from 'unstated';
import {PredictionJsonType} from '../types/types'
import {predictionsArrayType} from '../types/types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions'
//@ts-ignore
import { Dialog } from 'react-native-simple-dialogs';

type GlobalStateProps = {
    globalState: {
        state: {
            uid: string
        }
    }
}
const Post:React.FC<NavigationProps & GlobalStateProps> = (props) => {
    const [shopName, setShopName] = useState<string>('');
    const [favoriteMenu, changeFavorite] = useState<string>('');
    const [price, changePrice] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [address, setShopAddress] = useState<string>('');
    const [inputedShopName, setInputedShopName] =useState<string>('');
    const [predictions, setPredictions] = useState<predictionsArrayType>();
    const [isShownPredictions, setIsShownPredictions] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPressed , setIsPressed] = useState<boolean>(false);
    const [_dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [permissionDialogVisible , setPermissionDialogVisible] = useState<boolean>(false);
    const [shareCompleteDialogVisible , setShareCompleteDialogVisible] = useState<boolean>(false);
    const [_latitude, setLatitude] = useState<number>(35.68123620000001);
    const [_longitude, setLongitude] = useState<number>(139.7671248);
    const [canPressSearchButton, setCanPressSearchButton] = useState<boolean>(false)
    const [whileSearching, setWhileSearching] = useState<boolean>(false)
    const categoryItemList = [
        {label: '居酒屋', value: '居酒屋',},
        {label: 'カフェ', value: 'カフェ',},
        {label: '中華', value: '中華',},
        {label: 'ラーメン', value: 'ラーメン',},
        {label: 'ランチ', value: 'ランチ',},
        {label: 'ディナー', value: 'ディナー',},
        {label: 'その他', value: 'その他',},
    ]

    useEffect(() => {
        (async() => {
            let {status} = await Permissions.askAsync(Permissions.LOCATION);
            if(status !== 'granted') {
                setPermissionDialogVisible(true)
            } else {
            const location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude)
            setLongitude(location.coords.longitude)
            }
        })()
    }, [])
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
    const searchShop = async () => {
        if (inputedShopName == '') {
            openDialog()
        } else {
            setCanPressSearchButton(true)
            setWhileSearching(true)
            const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}
            &input=${inputedShopName}&location=${_latitude}, ${_longitude}
            &language=ja&radius=5000`;
            try {
                const searchPredictionResult: Response = await fetch(apiUrl);
                const json = await searchPredictionResult.json() as PredictionJsonType;
                //　検索結果の一覧を表示される
                setIsShownPredictions(true)
                setPredictions(json.predictions)
                setCanPressSearchButton(false)
                setWhileSearching(false)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const share = async() => {
        setIsLoading(true)
        setIsPressed(true)
        canPress()
        const userId = props.globalState.state.uid
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
                    setShareCompleteDialogVisible(true)
                    setShopName('')
                    changeFavorite('')
                    changePrice('')
                    selectCategory('')
                })
                .then(() => {
                    setIsLoading(false)
                    setIsPressed(false)
                })
                .catch(function(error: any) {
                    console.log(error)
                })
            })
        } catch (error) {
            console.log(error)
        }
    }
    const canPress = ():boolean => {
        if (category == '' || shopName == '') {
            return true
        } else if (isPressed){
            return true
        }
        else {
            return false
        }
    }
    const openDialog = () => {
        setDialogVisible(true)
    }
    const closeDialob = () => {
        setDialogVisible(false)
    }
    const closePermissionDialog =() => {
        setPermissionDialogVisible(false)
    }
    const closeShareCompleteDialog = () => {
        setShareCompleteDialogVisible(false)
    }

    return (
        <KeyboardAwareScrollView style={{flex: 1, backgroundColor: 'white',}}>
        <View style={styles.container}>
            <View>
                <Text style={styles.itemName}>
                    店名検索
                </Text>
                <View style={{ flexDirection: 'row', width: 250, alignContent: 'center'}}>
                    <Input
                        containerStyle={styles.searchResultArea}
                        placeholder="例）新宿　吉野家"
                        value={inputedShopName}
                        onChangeText={change}
                    />
                    <Button
                        onPress={searchShop}
                        title='検索'
                        type='solid'
                        buttonStyle={{borderRadius: 10, backgroundColor: 'white', borderColor: 'black', borderWidth: 1}}
                        titleStyle={{color: 'black'}}
                        disabled={canPressSearchButton}
                        loading={whileSearching}
                        disabledStyle={
                            canPressSearchButton ?
                            {backgroundColor: 'white'}
                        :
                            null
                        }
                    >
                    </Button>
                </View>
            </View>
            {
                isShownPredictions ?
                <KeyboardAwareScrollView style={{flex: 1, backgroundColor: 'white',}}>
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
                    title={'閉じる'}
                    type='outline'
                    buttonStyle={styles.closeButton}
                    titleStyle={{color: 'black'}}
                    onPress={close}
                />
            </View>
            </KeyboardAwareScrollView>
            : null
            }
            <View style={{marginTop: 30}}>
                <Text style={styles.itemName}>
                    店名 (必須)
                </Text>
                <TextInput
                    placeholder='検索結果が入力されます'
                    value={shopName}
                    style={styles.input}
                    onChangeText={selectShopName}
                    editable={false}
                />
            </View>
            <View style={{marginTop: 30}}>
                <Text style={styles.itemName}>
                    カテゴリー (必須)
                </Text>
                <RNPickerSelect
                    doneText=''
                    items={categoryItemList}
                    style={pickerSelectStyles}
                    placeholder={{label: '選択してください', value: ''}}
                    onValueChange={selectCategory}
                />
            </View>
            <View style={{marginTop: 30}}>
                <Text style={styles.itemName}>
                    おすすめのメニュー
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder='おすすめのメニューを入力して下さい'
                    value={favoriteMenu}
                    onChangeText={changeFavorite}
                />
            </View>
            <View style={{marginTop: 30}}>
                <Text style={styles.itemName}>
                    値段
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder='価格を入力して下さい'
                    value={price}
                    onChangeText={changePrice}
                />
            </View>
            <View style={{marginTop: 30, width: '60%'}}>
                <Button
                    buttonStyle={{borderRadius: 20, backgroundColor: '#fbd01d'}}
                    title='投稿する'
                    type='solid'
                    onPress={share}
                    disabled={canPress()}
                    loading={isLoading}
                    disabledStyle={
                        isPressed ?
                        {backgroundColor: '#fbd01d'}
                    :
                        null
                    }
                />
            </View>
        </View>
        <View>
            <Dialog
                visible={_dialogVisible}
                onTouchOutside={closeDialob}
                >
                <View>
                    <Text style={{textAlign: 'center'}}>店名を入力して下さい</Text>
                </View>
            </Dialog>
        </View>
        <View>
            <Dialog
                visible={shareCompleteDialogVisible}
                onTouchOutside={closeShareCompleteDialog}
                >
                <View>
                    <Text style={{textAlign: 'center'}}>投稿が完了しました</Text>
                </View>
            </Dialog>
        </View>
        <View>
            <Dialog
                visible={permissionDialogVisible}
                onTouchOutside={closePermissionDialog}
                >
                <View>
            <Text style={{textAlign: 'center'}}>位置情報利用が許可されていません。位置情報を利用すると、より正確にお店を検索することができます。位置情報を許可する場合は端末の設定から許可をお願いします</Text>
                </View>
            </Dialog>
        </View>
        </KeyboardAwareScrollView>
    );
}

type PostScreenNavigationProps = BottomTabNavigationProp<NavLoginParamList, 'Post'>;

type NavigationProps = {
    navigation: PostScreenNavigationProps
}

const PostWrapper:React.FC<NavigationProps> = ({ navigation }) => {
	return (
			<Subscribe to={[GlobalContainer]}>
				{
					(globalState:GlobalContainer) => <Post globalState={globalState} navigation = {navigation} />
				}
			</Subscribe>
	);
	}

export default PostWrapper;

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 100,
    alignItems: 'center'
},
itemName: {
    color: '#fbd01d',
},
searchResultArea: {
    // width: 265,
    backgroundColor: 'white',
    height: 40,
    padding: 5,
    borderColor: 'black',
    width: 200
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
closeButton: {
    marginHorizontal: 20,
    marginTop: 5,
    borderColor: 'black',
    color: 'black',
    borderRadius: 25
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
    fontSize: 14,

    marginRight: 5,
    marginLeft: 5
}
})
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        width: 250,
    },
    inputAndroid: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'grey',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        width: 250,
        backgroundColor:'#eee'
    },
})