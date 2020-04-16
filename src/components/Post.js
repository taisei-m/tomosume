import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Button, AirbnbRating} from 'react-native-elements';
import firebase from '../../firebase'

export default function TabScreen3() {
  let ratingValue = 0
  const [shopName, setName] = useState()
  const [favoriteMenu, setMenu] = useState()
  const [price, setPrice] = useState()

  const inputShopName = (text) => {
    setName(text)
  }
  const inputFavorite = (text) => {
    setMenu(text)
  }
  const inputPrice = (price) => {
    setPrice(price)
  }
  const share = () => {
    const postShopData = firebase.firestore().collection('postShopData')
    postShopData.add({
      shopName: shopName,
      favoriteMenu: favoriteMenu,
      price: price,
      ratingValue: ratingValue,
      createdAt: new Date(),
    })
    .then(function() {
      console.log('success')
    })
    .catch(function(error) {
      console.log(error)
    })
  }
  const ratingCompleted = (rating) => {
    ratingValue = rating
  }
  return (
    <View style={styles.container}>
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="店名"
          placeholderTextColor="#818181"
          value={shopName}
          onChangeText={inputShopName}
        />
      </View>    
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="おすすめメニュー"
          placeholderTextColor="#818181"
          value={favoriteMenu}
          onChangeText={inputFavorite}
        />
      </View>  
      <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="値段"
          placeholderTextColor="#818181"
          value={price}
          onChangeText={inputPrice}
        />
      </View>
      <AirbnbRating
        showRating
        count={5}
        reviews={["1/5", "2/5", "3/5", "4/5", "5/5",]}
        defaultRating={3}
        size={30}
        onFinishRating={ratingCompleted}
      />
      <View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30
  },
  inputView:{
    width:"80%",
    borderRadius:25,
    borderColor: 'black',
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20,
    color: 'black'
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
    marginTop: 80
  }
})