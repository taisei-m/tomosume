import React, { useState, useEffect }from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View,　FlatList, } from 'react-native';
import {Avatar, Icon} from 'react-native-elements'
import firebase from 'firebase/app'
import {db} from '../../firebaseConfig'

type ReviewDocResponse = {
  category: string,
  createdAt: firebase.firestore.Timestamp,
  favoriteMenu: string,
  price: string,
  shopAddress: string,
  shopId: string,
  shopName: string
  user: firebase.firestore.DocumentReference
  userName?: string
  iconURL?: string
  key: string
}

type ShopDocResponse = {
  address: string
  latitude: number
  longitude: number
  shopName: string
  reviews: firebase.firestore.CollectionReference
  id?: string
}

type ReviewsDocResponse = ReviewDocResponse[]
type ShopsArrayType= ShopDocResponse[]

const Search = () => {
  const [shopsData, setShopsData] = useState<ShopsArrayType>([])
  const [latitude, changeLatitude] = useState<number>(34.7201152);
  const [longitude, changeLongitude] = useState<number>(137.7394095);
  // const [visible, setVisible] = useState<boolean>(false)
  const [reviews, setReviews] = useState<ReviewsDocResponse>([])

  useEffect(() => {
    let shopsArray: ShopsArrayType = []
    db.collection('shops')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let shopData = doc.data() as ShopDocResponse
            shopData.id = doc.id
            shopsArray.push(shopData)
        })
        setShopsData(shopsArray)
    })
  },[])
  const handlePress = async (id: string) => {
    const _reviews = await getAllReviews(id)
    setReviews(_reviews)
  }
  const getAllReviews = async(id: string): Promise<ReviewsDocResponse> => {
    let reviews: ReviewsDocResponse = []
    // setVisible(!visible)
    const querySnapshot = await db.collectionGroup('reviews').where('shopId', '==', id).orderBy('createdAt', 'desc').get()
    querySnapshot.forEach(async(doc) => {
      let review = doc.data() as ReviewDocResponse
      review.key = doc.id
      const profile = await (review.user).get()
      review.userName = profile.get('userName')
      review.iconURL = profile.get('iconURL')
      reviews.push(review)
    })
    return reviews
  }

    return (
      <View style={styles.container}>
        <MapView style={styles.mapStyle}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}>
          {shopsData.map((shopData) => 
            <Marker
              key={shopData.id}
              title={shopData.shopName}
              description={shopData.address}
              onPress={() => handlePress(shopData.id)}
              coordinate={
                {
                  latitude: shopData.latitude,
                  longitude: shopData.longitude
                }
              }
            />
          )}
          {/* <View style={{height: 140, width: '100%', backgroundColor: 'white', position: 'absolute', bottom: 0, borderTopRightRadius: 25, borderTopLeftRadius: 25, paddingTop: 15, paddingHorizontal: 15}}>
            {visible ?( 
            <FlatList
              horizontal
              data={reviews}
              renderItem={
            ({ item }) => 
              <View style={{marginRight: 30}}>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                  <Avatar rounded source={{ uri: item.iconURL }}/>
                  <Text style={{fontSize: 18, marginTop: 5, marginLeft: 5}}>{item.userName}</Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 5, marginLeft: 5}}>
                  <Icon 
                    name='list'
                    color="#2774E8"
                    type='material'
                    size={20}
                    />
                  <Text style={{marginTop: 2, marginLeft: 10}}>{item.category}</Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 5, marginLeft: 5}}>
                  <Icon 
                    name='favorite'
                    color="#2774E8"
                    size={20}
                    />
                  <Text style={{marginTop: 2, marginLeft: 10}}>{item.favoriteMenu}</Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 5, marginLeft: 5}}>
                  <Icon 
                    name='attach-money'
                    color="#2774E8"
                    size={20}
                    />
                  <Text style={{marginTop: 2, marginLeft: 10}}>{item.price}</Text>
                </View>
              </View>
          }
          keyExtractor={item => item.key}
          />
          ): null
          }
          </View> */}
        </MapView>
    </View>
  );
}

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapStyle: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
});

