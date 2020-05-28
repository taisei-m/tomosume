import React, { useState, useEffect } from 'react';
import {StyleSheet, 
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
import firebase from '../../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
//@ts-ignore
import GlobalStateContainer from '../containers/GlobalState';
import ProfileNumber from '../components/ProfileNumber';
import Item from '../components/Item';

const Profile = (props: any) => {
  const [userName, setUserName] = useState<string>('')
  const [followee, setFollowee] = useState<number>(0)
  const [follower, setFollower] = useState<number>(0)
  const [postNumber, setPostNumber] = useState<number>(0)
  const [shopData, setShopData] = useState<string[]>([])
  const [followStatus, changeStatus] = useState('follow')
  const [pressStatus, changePress] = useState(false)
  const [image, setImage] = useState('');

  useEffect(() => {
    const userId = props.globalState.state.userData.uid
    const ref = firebase.firestore().collection('userList').doc(userId)
    let dataArray: string[] = []
    let db = firebase.firestore()
    db.collectionGroup('reviews')
    .where('user', '==', ref)
    .orderBy('createdAt', 'desc')
    .get()
      .then(function(querySnapshot:Array<any>) {
        querySnapshot.forEach(function(doc) {
          let temp = doc.data()
          temp.id = doc.id
          dataArray.push(temp)
          console.log(dataArray)
        })
        let lng = dataArray.length
        setPostNumber(lng)
        setShopData(dataArray)
      })
  }, [])
  useEffect(() => {
    const db = firebase.firestore()
    const userId = props.globalState.state.userData.uid
    db.collection('userList').doc(userId)
      .get().then(function(doc:any) {
        if (doc.data().iconURL != 'test-url') {
          setImage(doc.data().iconURL)
        } else {
          setImage('file:///Users/oxyu8/Downloads/okuse_yuya.jpg')
        }
      })
  }, [])
  useEffect(() => {
    const userId = props.globalState.state.userData.uid
    firebase.firestore().collection('userList').doc(userId)
    .get().then(function(doc:any) {
      setUserName(doc.data().userName)
    })
  },[])
  useEffect(() => {
    const userId = props.globalState.state.userData.uid
    const db = firebase.firestore().collection('userList').doc(userId)
    let lengthArray:string[] = []
    db.collection('followee')
    .get()
    .then(function(querySnapshot:any) {
      querySnapshot.forEach(function(doc:any) {
        lengthArray.push(doc.id)
      })
      let lng: number = lengthArray.length-1
      setFollowee(lng)
  })
  },[])
  useEffect(() => {
    const userId = props.globalState.state.userData.uid    
    const db = firebase.firestore().collection('userList').doc(userId)
    let lengthArray:string[] = []
    db.collection('follower')
    .get()
    .then(function(querySnapshot:any) {
      querySnapshot.forEach(function(doc:any) {
        lengthArray.push(doc.id)
      })
      let lng: number = lengthArray.length-1
      setFollower(lng)
  })
  },[])

  AsyncStorage.getItem('Authenticated', (err, result) => {
      // console.log("Authenticated = " + result)
    })
    
  const follow = () => {
    changePress(!pressStatus)
    if(followStatus == 'follow') {
      changeStatus('unfollow')
      let userId = props.globalState.state.userData.uid
      console.log(props.globalState.state.userData.uid)
      let db = firebase.firestore()
                .collection('userList')
                .doc(userId)
                .collection('following')
      db.add()
    } else {
      changeStatus('follow')
    }
  }
  const setting = () => {
    props.navigation.navigate('idealDrawer')
    console.log(props)
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
  const userId = props.globalState.state.userData.uid
  const storageRef = firebase.storage().ref('user/icon/' + imageName);
  const response = await fetch(uri);
  const blob = await response.blob();
  await new Promise(function(resolve) {
    storageRef.put(blob)
    console.log('1')
    resolve();
  })
  await new Promise(function(resolve) {
    storageRef.getDownloadURL().then(function (url:string) {
      imageUrl = url
      setImage(url)
      console.log('2')
      resolve()
    })
  })  
    console.log('3')
    firebase.firestore().collection('userList').doc(userId)
    .set({
          iconURL: imageUrl
          },{ merge: true }) 
    console.log('4')
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
            <Text style={styles.userName}>{userName}</Text>
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
              number={postNumber}
              itemName='post'
            />
            <ProfileNumber
              number={follower}
              itemName="フォロー"
              press={toFollowList}
              centerClass={{width: 50, height: 50, marginHorizontal: 30}}
            />
            <ProfileNumber 
              number={followee}
              itemName="フォロワー"
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
