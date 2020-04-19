// function TabScreen11(props) {
//   console.log("TabScreen1");
//   console.log(props);

//   const [GlobalState, a] = useState(props.globalState);
  

//   logout = () => {        
//     console.log("method logout")
//     GlobalState.logout();
//     // this.state.navigation.navigate('NavLogined');
//   }
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Button
//           title="Tab 1 page"
//         />
//          <TouchableOpacity
//                     style={styles.button}
//                     onPress={logout}
                    
//                 >
//                     <Text> logout </Text>
//                 </TouchableOpacity>
//       </View>
//     );
// }
  

// const TabScreen1Wrapper = ({ navigation }) => {
//   return (
//       <Subscribe to={[GlobalStateContainer]}>
//           {
//               globalState => <TabScreen11 globalState={globalState} navigation = {navigation} />
//           }
//       </Subscribe>
//   );
// }

// export default TabScreen1Wrapper;

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Avatar, Rating } from 'react-native-elements'
import firebase from '../../firebase';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';

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
    <TouchableOpacity style={styles.item} onPress={() => console.log('good')}>
      <View style={styles.userInfomation}>   
        <Avatar rounded icon={{ name: 'home' }}/>
        <Text style={styles.userName}>okuse</Text>
      </View>

      <Text style={styles.shopName}>{title}</Text>
      <Text style={styles.favoriteMenu}>おすすめメニュー：{context}</Text>
      <View>   
        <Rating
          style={styles.rating}
          ratingCount={5}
          startingValue={rating}
          imageSize={35}
          />
      </View>
    </TouchableOpacity>
    </View>
  );
}

export default function Top() {
  const shopData = getData()
  return(
    <View style={styles.container}>
      <SafeAreaView style={styles.list}>
        <FlatList
          data={shopData}
          renderItem={({ item }) => <Item title={item.shopName} context={item.favoriteMenu} rating={item.ratingValue}/>}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 60,
    backgroundColor: 'white',
  },
  listItem: {
    margin: 15
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
    fontSize: 25
  },
  favoriteMenu: {
    margin: 10
  }
  
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
