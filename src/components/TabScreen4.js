import React from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native';
import { Card, Button, AirbnbRating, Rating } from 'react-native-elements'
export default function TabScreen4() {
  return (
    <View style={ styles.container}>
      <Image
        source={{ uri: 'file:///Users/oxyu8/Downloads/okuse_yuya.jpg'}}
        style={{ width: 150, height: 150, borderRadius: 200/ 2}}
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
      <Card
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
      </Card>
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
})