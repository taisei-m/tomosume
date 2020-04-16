import React from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity, SafeAreaView, FlatList,} from 'react-native';
import { Card, Button, AirbnbRating, Rating } from 'react-native-elements'

function Item({ title, context }) {
  return (
    <TouchableOpacity style={styles.item} onPress={() => console.log('good')}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.context}>{context}</Text>
      <View >     
        <Rating
          style={styles.rating}
          count={5}
          defaultRating={4}
          size={20}
        />
      </View>
    </TouchableOpacity>
  );
}

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    context: 'The idea with React Native Elements is more about component structure than actual design'
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
    context: 'The idea with React Native Elements is more about component structure than actual design'

  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
    context: 'The idea with React Native Elements is more about component structure than actual design'
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    context: 'The idea with React Native Elements is more about component structure than actual design'
  },  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    context: 'The idea with React Native Elements is more about component structure than actual design'
  },  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    context: 'The idea with React Native Elements is more about component structure than actual design'
  },
];


export default function TabScreen4() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'file:///Users/oxyu8/Downloads/okuse_yuya.jpg'}}
        style={{ width: 150, height: 150, borderRadius: 200/ 2, position: 'fixed', marginTop: 500}}
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
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} context={item.context}/>}
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
    marginBottom: 450
  },
  item: {
    backgroundColor: '#f5f5f5',
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
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
  }
})