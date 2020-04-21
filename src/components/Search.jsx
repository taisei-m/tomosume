import React, { useState, useEffect }from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimension, Platform } from 'react-native';
import { SearchBar } from 'react-native-elements';
import * as Permissions from 'expo-permissions'
import firebase from '../../firebase'

function useFirestore() {
  const [locationData, changeLocationData] = useState([])
  useEffect(() => {
    firebase
      .firestore()
      .collection('postShopData')
      .onSnapshot((snapshot) => {
        const newLocationData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        changeLocationData(newLocationData)
      })
  },[])
  return locationData
}

export default TabScreen2 = () =>{
  const locationData = useFirestore()
  const [latitude, changeLatitude] = useState(32.726912);
  const [longitude, changeLongitude] = useState(135.7202243);

    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Type Here..."
        />
        <MapView style={styles.mapStyle}
        initialRegion={{
          latitude,
          longitude,
        }}>
          {locationData.map((location) => 
            <Marker
            key={location.id}
              title={location.shopName}
              description={location.favoriteMenu}
              coordinate={
                {
                  latitude: location.latitude,
                  longitude: location.longitude
                }
              }
            />
          )}
        </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  mapStyle: {
    width: '100%',
    height: '100%'
  },
});
