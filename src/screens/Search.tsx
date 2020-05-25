import React, { useState, useEffect }from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Button ,FlatList, SafeAreaView } from 'react-native';
import {Avatar, Icon} from 'react-native-elements'
//@ts-ignore
// import Modal, { SlideAnimation, ModalContent } from 'react-native-modals';
import firebase from '../../firebase'
// import { functionsIn } from 'lodash';

const Search = () => {
  const [locationData, changeLocationData] = useState<string[]>([''])
  const [latitude, changeLatitude] = useState<number>(34.7201152);
  const [longitude, changeLongitude] = useState<number>(137.7394095);
  // const [visible, setVisible] = useState<boolean>(false)
  const [shopData, setShopData] = useState<string[]>([''])

  useEffect(() => {
    let dataArray: string[] = []
    firebase
      .firestore()
      .collection('shops')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let tmp = doc.data()
            tmp.id = doc.id
            dataArray.push(tmp)
        })
        changeLocationData(dataArray)
    })
  },[])
  const getShopId = async(id) => {
    const db = firebase.firestore()
    let dataArray: string[] = []
    // setVisible(!visible)
    const querySnapshot = await db.collectionGroup('reviews').where('shopId', '==', id).orderBy('createdAt', 'desc').get()
    querySnapshot.forEach(async(doc) => {
      let tmp = doc.data()
      const profile = await (doc.data().user).get()
      // console.log(profile.get('userName'))
      // console.log(profile.get('iconURL'))
      tmp.userName = profile.get('userName')
      tmp.iconURL = profile.get('iconURL')
      delete tmp.user
      // console.log('==============================')
      // console.log(tmp)
      dataArray.push(tmp)
      console.log(dataArray)
      // console.log(dataArray)
    })
      // setShopData(data)
      // console.log(shopData)
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
              onPress={() => getShopId(location.id)}
              coordinate={
                {
                  latitude: location.latitude,
                  longitude: location.longitude
                }
              }
            />
          )}
          {/* <View style={{height: 140, width: '100%', backgroundColor: 'white', position: 'absolute', bottom: 0, borderTopRightRadius: 25, borderTopLeftRadius: 25, paddingTop: 15, paddingHorizontal: 15}}>
            {visible ?( 
            <FlatList
              horizontal
              data={shopData}
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
          keyExtractor={item => item.user}
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

