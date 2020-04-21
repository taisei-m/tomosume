
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Avatar, Rating } from 'react-native-elements'
import firebase from '../../firebase';
// import { Subscribe } from 'unstated';
// import GlobalStateContainer from '../containers/GlobalState';

function getData() {
  const [postedData, changePostedData] = useState([]);
  useEffect(() => {
    firebase
      .firestore()
      .collection('postShopData')
      .onSnapshot((snapshot) => {
        const tempShopData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        changePostedData(tempShopData)
      })
  }, [])
  return postedData
}

function Item({ title, context, rating }) {
  return (
    <View style={styles.listItem}>
    <TouchableOpacity  onPress={() => console.log('good')}>
      <View style={styles.userInfomation}>   
        <Avatar rounded icon={{ name: 'home' }}/>
        <Text style={styles.userName}>okuse</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
      <View>      
        <Image
        style={styles.tinyLogo}
        source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
      /></View>
      <View>
      <Text style={styles.shopName}>{title}</Text>
      <Text style={styles.favoriteMenu}>おすすめメニュー：{context}</Text>
      <View style={{flexDirection: 'row'}}>   
        <Rating
          readonly
          style={styles.rating}
          ratingCount={5}
          startingValue={rating}
          imageSize={20}
          />
          <Text style={styles.ratingText}>{rating}</Text>
      </View>
      </View>
      </View>
    </TouchableOpacity>
    </View>
  );
}

export default function Top() {
  const shopData = getData()
  return(
    <View style={styles.container}>
        <FlatList
          data={shopData}
          renderItem={({ item }) => <Item title={item.shopName} context={item.favoriteMenu} rating={item.ratingValue}/>}
          keyExtractor={item => item.id}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  listItem: {
    marginTop: 10,
    marginBottom: 10,
  },
  userInfomation: {
    flexDirection: 'row',
    marginBottom: 10
  },
  userName: {
    fontSize: 18,
    paddingTop: 5,
    paddingLeft: 10
  },
  shopName: {
    fontSize: 25,
    marginLeft: 10
  },
  favoriteMenu: {
    margin: 10
  },
  rating: {
    marginLeft: 10
  },
  ratingText: {
    marginLeft: 5,
    marginTop: 2
  },
  tinyLogo: {
    width: 80,
    height: 80,
  },
  logo: {
    width: 66,
    height: 58,
  },
});


























// import * as Location from 'expo-location';
// import * as Permissions from 'expo-permissions';


// export default class App extends Component {
//   state = {
//     locationResult: null
//   };

// componentDidMount() {
//   this._getLocationAsync();
// }

// _getLocationAsync = async () => {
//   let { status } = await Permissions.askAsync(Permissions.LOCATION);
//   if (status !== 'granted') {
//     this.setState({
//       locationResult: 'Permission to access location was denied',
//   });
// }

// let location = await Location.getCurrentPositionAsync({});
//   console.log('data' + JSON.stringify(location.coords.latitude));
//   console.log('data' + JSON.stringify(location.coords.longitude));
//   this.setState({ locationResult: JSON.stringify(location) });
// };

//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>
//           {this.state.locationResult}
//         </Text>
//       </View>
//     );
//   }
// }
