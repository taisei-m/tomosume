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
  key?: string
}

type ShopData = {
  address: string
  latitude: number
  longitude: number
  shopName: string
  reviews: firebase.firestore.CollectionReference
  id: string
}

type ReviewsDocResponse = ReviewDocResponse[]
type ShopsData = ShopData[]

const Search = () => {
  const [locationData, changeLocationData] = useState<ShopsData>([])
  const [latitude, changeLatitude] = useState<number>(34.7201152);
  const [longitude, changeLongitude] = useState<number>(137.7394095);
  const [visible, setVisible] = useState<boolean>(false)
  const [reviews, setReviews] = useState<ReviewsDocResponse>([])

  useEffect(() => {
    let dataArray: ShopsData = []
    db.collection('shops')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let tmp = doc.data() as ShopData
            tmp.id = doc.id
            dataArray.push(tmp)
        })
        changeLocationData(dataArray)
    })
  },[])

  const getAllReviews = async(id: string): Promise<ReviewsDocResponse> => {
    let reviewssss: ReviewsDocResponse = []
    // setVisible(!visible)
    // const querySnapshot =
    const querySnapshot = await db.collectionGroup('reviews').where('shopId', '==', id).orderBy('createdAt', 'desc').get()
    // .then(querySnapshot => {
        const queryDocsSnapshot = querySnapshot.docs
        reviewssss = await Promise.all(queryDocsSnapshot.map(async (item) => {
          let data = item.data()
          data.key = item.id
          const profile = await (data.user).get()
          data.userName = profile.get('userName')
          data.iconURL = profile.get('iconURL')
          delete data.user
          return data
          // reviewssss.push(data)
        }))
      // const queryDocsSnapshot = querySnapshot.docs
      // for (let i = 0; i < queryDocsSnapshot.length; i++) {
      //   let data = queryDocsSnapshot[i].data()
      //   const profile = (data.user).get()
      //   data.userName = profile.get('userName')
      //   data.iconURL = profile.get('iconURL')
      //   delete data.user
      //   reviewssss.push(data)
      //   // console.log(reviewssss)
      // }
    // })
    return reviewssss
    // querySnapshot.forEach(async(doc): Promise<void> => {
    //     let review = doc.data() as ReviewDocResponse
    //     review.key = doc.id
    //     const profile = await (review.user).get()
    //     review.userName = profile.get('userName')
    //     review.iconURL = profile.get('iconURL')
    //     reviewssss.push(review)
    // })
    // return reviewssss
  }

  const handlePress = async (id: string) => {
    let newArray = [];
    const _reviews = await getAllReviews(id)
    console.log('=======================================')
    console.log(_reviews, '_reviews')
    // Object.assign(newArray, _reviews)
    setReviews(_reviews)
    console.log(reviews,'review')
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
          {locationData.map((location) =>
            <Marker
              key={location.id}
              title={location.shopName}
              description={location.address}
              onPress={() => handlePress(location.id)}
              coordinate={
                {
                  latitude: location.latitude,
                  longitude: location.longitude
                }
              }
            />
          )}
          {/* <View style={{height: 140, width: '100%', backgroundColor: 'white', position: 'absolute', bottom: 0, borderTopRightRadius: 25, borderTopLeftRadius: 25, paddingTop: 15, paddingHorizontal: 15}}>
            <FlatList
              horizontal
              data={reviews}
              renderItem={({ item }) =>
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

