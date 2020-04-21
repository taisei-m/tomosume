import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity, SafeAreaView, FlatList, AsyncStorage} from 'react-native';
import { Avatar, Rating } from 'react-native-elements';
import firebase from '../../firebase';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';
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

const Profile =  (props) => {
  const shopData = getData()
  const [followStatus, changeStatus] = useState('follow')
  const [pressStatus, changePress] = useState(false)
  const [navigation, setNavigation] = useState(props.navigation);
  const [globalState, setGlobalState] = useState(props.globalState);
  console.log("Profile////////////////////////////////////")
  console.log(globalState.state);
   AsyncStorage.getItem('Authenticated', (err, result) => {
      console.log("Authenticated = " + result)
    })

  const logout = () => {  
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
      console.log("Sign-out successful and call global.logout")
      AsyncStorage.setItem('Authenticated', 'false', () => {
        globalState.logout();
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
  const toFollowList = () => {
    globalState.navigate('followTabList')
  }
  const toFollowerList = () => {
    globalState.navigate('followTabList')
  }


  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'file:///Users/oxyu8/Downloads/okuse_yuya.jpg'}}
        style = {styles.userIcon}
      />
      <Text style={styles.userName}>yuya okuse</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
        <View style={{width: 50, height: 50,}}>
          <Text style={styles.number}>100</Text>
          <Text style={styles.numberKey}>post</Text>
        </View>
        <View style={{marginRight: 50, marginLeft: 50, width: 50, height: 50,}}>
          <Text 
            style={styles.number}
            onPress={toFollowList}
            >100</Text>
          <Text style={styles.numberKey}>follow</Text>
        </View>
        <View style={{width: 50, height: 50,}}>
          <Text 
            style={styles.number}
            onPress={toFollowerList}
            >100</Text>
          <Text style={styles.numberKey}>follower</Text>
        </View>
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
      <TouchableOpacity
        style={
          pressStatus
          ? styles.followButton
          : styles.unFollowButton
          }
        onPress={logout}
      >
        <Text>
          ログアウト
        </Text>
      </TouchableOpacity>
      <SafeAreaView style={styles.list}>
        <FlatList
          data={shopData}
          renderItem={({ item }) => <Item title={item.shopName} context={item.favoriteMenu} rating={item.ratingValue}/>}
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
  userIcon: {
    width: 80,
    height: 80, 
    borderRadius: 80/ 2, 
    marginTop: 300
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
  unFollowButton: {
    width:"30%",
    backgroundColor:"#5E9CFE",
    borderRadius:25,
    height:25,
    alignItems:"center",
    justifyContent:"center",
    marginTop: 20,
    borderColor: '#5E9CFE',
    borderWidth: 1
  },
  followButtonText: {
    color: '#5E9CFE'
  },
  unfollowButtonText: {
    color: 'white'
  },
  list: {
    marginTop: 10,
    marginBottom: 250,
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