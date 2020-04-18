import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity, SafeAreaView, FlatList,} from 'react-native';
import { Avatar, Rating } from 'react-native-elements';
import firebase from '../../firebase';



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
        <Text style={styles.postUserName}>okuse</Text>
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



export default function TabScreen4() {
  const shopData = getData()
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'file:///Users/oxyu8/Downloads/okuse_yuya.jpg'}}
        style={{ width: 80, height: 80, borderRadius: 80/ 2, marginTop: 500}}
      />
      <Text style={styles.userName}>yuya okuse</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
        <View style={{width: 50, height: 50,}}>
          <Text style={styles.number}>100</Text>
          <Text style={styles.numberKey}>post</Text>
        </View>
        <View style={{marginRight: 50, marginLeft: 50, width: 50, height: 50,}}>
          <Text style={styles.number}>100</Text>
          <Text style={styles.numberKey}>follow</Text>
        </View>
        <View style={{width: 50, height: 50,}}>
          <Text style={styles.number}>100</Text>
          <Text style={styles.numberKey}>follower</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
      >
        <Text style={styles.buttonText}> follow </Text>
      </TouchableOpacity>

      <SafeAreaView style={styles.list}>
        <FlatList
          data={shopData}
          renderItem={({ item }) => <Item title={item.shopName} context={item.favoriteMenu} rating={item.ratingValue}/>}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>

      {/* <Card
        title='starbucks'
        image={require('../../assets/okuse_yuya.jpg')}>
        <Text style={{marginBottom: 10}}>
          The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Rating
          count={5}
          defaultRating={4}
          style={{ paddingVertical: 10 }}
          size={20}
        />
        <Button
          icon={{name: 'code'}}
          backgroundColor='#03A9F4'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          title='Read More' />
      </Card> */}
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontWeight: '700',
    fontSize: 24,
    marginTop: 20,
  },
  listItem: {
    margin: 15,
  },
  userInfomation: {
    flexDirection: 'row',
    marginBottom: 10
  },
  postUserName: {
    fontSize: 18,
    paddingTop: 5,
    paddingLeft: 10
  },
  shopName: {
    fontSize: 25
  },
  favoriteMenu: {
    margin: 10
  },
  number: {
    fontSize: 28
  },
  numberKey: {
    fontSize: 12,
    textAlign: 'center',
    color: '#818181'
  },
  button: {
    width:"30%",
    backgroundColor:"white",
    borderRadius:25,
    height:25,
    alignItems:"center",
    justifyContent:"center",
    marginTop: 20,
    borderColor: '#5E9CFE',
    borderWidth: 1
  },
  buttonText: {
    color: '#5E9CFE'
  },
  list: {
    marginTop: 20,
    marginBottom: 400,
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  context: {
    marginTop: 10
  },
  rating: {
    paddingVertical: 10,
    backgroundColor: 'white',
  }
})