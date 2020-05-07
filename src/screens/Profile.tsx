import React, { useState, useEffect } from 'react';
import {
        StyleSheet, 
        Text, 
        Image, 
        View, 
        TouchableOpacity, 
        SafeAreaView, 
        FlatList, 
        AsyncStorage, 
        ImageBackground
        } from 'react-native';
import { Card } from 'react-native-elements'
import { Subscribe } from 'unstated';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
//@ts-ignore
import firebase from '../../firebase';
import GlobalStateContainer from '../containers/GlobalState';
import ProfileNumber from '../components/ProfileNumber';
import Item from '../components/Item';

function getData() {
  const [postedData, changePostedData] = useState([]);
  useEffect(() => {
    firebase
      .firestore()
      .collection('postData')
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

const Profile =  (props) => {
  console.log(props)
  const shopData = getData()
  const [followStatus, changeStatus] = useState('follow')
  const [pressStatus, changePress] = useState(false)
  AsyncStorage.getItem('Authenticated', (err, result) => {
      console.log("Authenticated = " + result)
    })
  const logout = () => {  
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
      console.log("Sign-out successful and call global.logout")
      AsyncStorage.setItem('Authenticated', 'false', () => {
        props.globalState.logout();
      });
    })
    .catch(function(error) {
    // An error happened.
      console.log(error); 
    }); 
  } 
  const follow = () => {
    changePress(!pressStatus)
    if(followStatus == 'follow') {
      changeStatus('unfollow')
    } else {
      changeStatus('follow')
    }
  }
  const setting = () => {
    props.navigation.navigate('idealDrawer')
  }
  function toFollowList() {
    props.navigation.navigate('followTabList')
  }
  const toFollowerList = () => {
    props.navigation.navigate('followTabList')
  }
  return (
    <View style={styles.container}>
      <LinearGradient
                        colors={['#323eff','#06acff', '#00d4ff']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.LinearGradientView}
                    >
          <View style={{flexDirection: 'row'}}>
          <View>
          </View>
      </View>
        </LinearGradient>
        <Card
              containerStyle={{
                width: 380,
                height: 160,
                borderRadius: 10,
                marginHorizontal: 15,
                position: 'absolute',
                top: 80
              }}
            >
            </Card>
            <Image
            source={{ uri: 'file:///Users/oxyu8/Downloads/okuse_yuya.jpg'}}
            style = {styles.userIcon}
          />
            <TouchableOpacity
            style={{position: 'absolute', top: 50, left: 360}}
            onPress={setting}
            >
              <Icon
                name="bars"
                size={30}
                color="#f5f5f5"
              />
            </TouchableOpacity>
          <Text style={styles.userName}>奥瀬雄哉</Text>
          <View 
            style={{
            flexDirection: 'row', 
            justifyContent: 'space-around', 
            borderRadius: 15,
            width: 250,
            padding: 10,
            marginLeft: 80,
          }}
          >
        <ProfileNumber 
          number={100}
          itemName='post'
        />
        <ProfileNumber
          number={100}
          itemName="follow"
          press={toFollowList}
          centerClass={{width: 50, height: 50, marginHorizontal: 50}}
        />
        <ProfileNumber 
          number={100}
          itemName="follower"
          prass={toFollowerList}
        />
      </View>
      <TouchableOpacity
        style={
          pressStatus
          ? styles.followButton
          : styles.unFollowButton
          }
        onPress={follow}
      >
        <Text 
          style={
            pressStatus
            ? styles.followButtonText
            : styles.unfollowButtonText
            }>
          {followStatus}
        </Text>
      </TouchableOpacity>
      <SafeAreaView style={styles.list}>
        <FlatList
          data={shopData}
          renderItem={
            ({ item }) => <Item 
                            title={item.shopName} 
                            address={item.address}
                            category={item.category} 
                            price={item.price} 
                            favorite={item.favoriteMenu}/>
            }
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </View>
  );
}
const ProfileWrapper = ({ navigation }) => {
  return (
      <Subscribe to={[GlobalStateContainer]}>
          {
              globalState => <Profile globalState={globalState} navigation = {navigation} />
          }
      </Subscribe>
  );
}

export default ProfileWrapper;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F8FB',
  },
  LinearGradientView: {
    height: 170,
    width: '100%',
    borderRadius: 25
  },
  userName: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
    position: 'absolute',
    top: 150,
    left: 170,
  },
  userIcon: {
    width: 90,
    height: 90, 
    marginTop:50,
    borderRadius: 90/ 2, 
    borderColor: 'white',
    borderWidth: 2,
    position: 'absolute',
    left: 160
  },
  listItem: {
    margin: 15,
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
  followButton: {
    width:"50%",
    backgroundColor:"white",
    borderRadius:15,
    height:35,
    alignItems:"center",
    justifyContent:"center",
    borderColor: '#5E9CFE',
    borderWidth: 1,
    marginLeft: 105
  },
  unFollowButton: {
    width:"50%",
    backgroundColor:"#5E9CFE",
    borderRadius:15,
    height : 35,
    alignItems:"center",
    justifyContent:"center",
    borderColor: '#F4F8FB',
    borderWidth: 1,
    marginLeft: 105
  },
  followButtonText: {
    color: '#5E9CFE'
  },
  unfollowButtonText: {
    color: 'white'
  },
  list: {
    marginBottom: 550,
  },
})
