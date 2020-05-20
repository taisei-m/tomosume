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
        } from 'react-native';
import { Subscribe } from 'unstated';
import Icon from 'react-native-vector-icons/FontAwesome';
//@ts-ignore
import firebase from '../../firebase';
import * as ImagePicker from 'expo-image-picker';
import GlobalStateContainer from '../containers/GlobalState';
import ProfileNumber from '../components/ProfileNumber';
import Item from '../components/Item';

const Profile = (props: any) => {
  // console.log(props)
  const [shopData, setShopData] = useState<string[]>([])
  const [followStatus, changeStatus] = useState('follow')
  const [pressStatus, changePress] = useState(false)
  const [image, setImage] = useState('');

  useEffect(() => {
    let dataArray: string[] = []
    // let user = firebase.auth().currentUser;
    // if (user != null) {
    //   alert(user.uid)
    // }
    let db = firebase.firestore()
    db.collection('postData').get()
      .then(function(querySnapshot:Array<any>) {
        querySnapshot.forEach(function(doc) {
          let temp = doc.data()
          temp.id = doc.id
          dataArray.push(temp)
        })
        setShopData(dataArray)
      })
  }, [])
  useEffect(() => {
    let db = firebase.firestore()
    db.collection('userList').doc('9jQ8HF4cuwaHxVsm8AayZj1WHBf1')
      .get().then(function(doc) {
        // console.log(doc.data().iconUrl)
        if (doc.data().iconUrl != null) {
          setImage(doc.data().iconUrl)
        } else {
          console.log('画像のURLがstoreにありません')
        }
      })
  }, [])

  AsyncStorage.getItem('Authenticated', (err, result) => {
      // console.log("Authenticated = " + result)
    })
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
  const toFollowList = () => {
    props.navigation.navigate('followTabList')
  }
  const toFollowerList = () => {
    props.navigation.navigate('followTabList')
  }
  const changeImage = async() => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })
      if (!result.cancelled) {
        uploadImage(result.uri, 'test-image')
        .then(() => {
          alert('success')
        })
        .catch(e => {
          alert(e)
        })
      }
    } catch (E) {
      console.log(E);
    }
  }


const uploadImage = async (uri:string, imageName:string) => {
  let imageUrl = ''
  let storageRef = firebase.storage().ref('user/icon/' + imageName);
  const response = await fetch(uri);
  const blob = await response.blob();
  let putInStorage = new Promise(function(resolve) {
    storageRef.put(blob)
    resolve();
  })
  let downloadUrl = new Promise(function(resolve) {
    storageRef.getDownloadURL().then(function (url:string) {
      imageUrl = url
      setImage(url)
      resolve()
    }).catch(function(error) {
      console.log(error)
    })
  })  
  Promise.all([
    putInStorage,
    downloadUrl
  ]).then(function() {
    firebase
    .firestore()
    .collection('userList')
    .doc('9jQ8HF4cuwaHxVsm8AayZj1WHBf1')
    .set({
      iconUrl: imageUrl
    },{ merge: true }) 
  })
}
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'center',}}>
        <View>
          <View style={{alignItems: 'center', marginTop: 50}}>
            <TouchableOpacity
              onPress={changeImage}
            >
              <Image
                source={{ uri: image }}
                style = {styles.userIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center', marginTop: 10}}>
            <Text style={styles.userName}>奥瀬雄哉</Text>
          </View>
        </View>

        <View style={{marginLeft: 30}}>
          <View 
            style={{
              justifyContent: 'center', 
              flexDirection: 'row',
              marginTop: 70,
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
              centerClass={{width: 50, height: 50, marginHorizontal: 30}}
            />
            <ProfileNumber 
              number={100}
              itemName="follower"
              press={toFollowerList}
            />
          </View>
          <View style={{ alignItems: 'center', marginTop: 20, flexDirection: 'row'}}>
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
              onPress={setting}
              style={{marginLeft: 10}}
            >
              <Icon
                name="bars"
                size={30}
                color="#000"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <SafeAreaView style={styles.list}>
        <FlatList
          data={shopData}
          renderItem={
            ({ item }) => 
              <Item 
                id={item.id}
                title={item.shopName} 
                address={item.address}
                category={item.category} 
                price={item.price} 
                favorite={item.favoriteMenu}
              />
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
    backgroundColor: '#fff'
  },
  userName: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
  },
  userIcon: {
    width: 90,
    height: 90, 
    borderRadius: 90/ 2, 
    borderColor: 'white',
    borderWidth: 2,
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
    width: 160,
    backgroundColor:"white",
    borderRadius:15,
    height:35,
    alignItems:"center",
    justifyContent:"center",
    borderColor: '#5E9CFE',
    borderWidth: 1,
  },
  unFollowButton: {
    width: 160,
    backgroundColor:"#5E9CFE",
    borderRadius:15,
    height : 35,
    alignItems:"center",
    justifyContent:"center",
    borderColor: '#F4F8FB',
    borderWidth: 1,
  },
  followButtonText: {
    color: '#5E9CFE'
  },
  unfollowButtonText: {
    color: 'white'
  },
  list: {
    marginTop: 20,
    marginBottom: 350
  },
})
