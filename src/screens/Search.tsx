import React, { useState, useEffect }from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Button, } from 'react-native';
//@ts-ignore
import Modal, { SlideAnimation, ModalContent } from 'react-native-modals';
import firebase from '../../firebase'

const Search = () =>{
  const [locationData, changeLocationData] = useState<string[]>([''])
  const [latitude, changeLatitude] = useState<number>(32.726912);
  const [longitude, changeLongitude] = useState<number>(135.7202243);
  const [visible, setVisible] = useState<boolean>(true)

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
            console.log(tmp)
        })
        changeLocationData(dataArray)
    })
  },[])

  const change = () => {
    setVisible(!visible)
    console.log(visible)
  }

    return (
      <View style={styles.container}>
        <Button
          title={'test'}
          onPress={change}
        >
          <Text>fsda</Text>
        </Button>
        <MapView style={styles.mapStyle}
        initialRegion={{
          latitude,
          longitude,
        }}>
          {locationData.map((location) => 
            <Marker
              key={location.id}
              title={location.shopName}
              description={
                
                location.address}
              onPress={() => console.log(location.id)}
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

export default Search;

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

