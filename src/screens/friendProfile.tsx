import React, { useState, useEffect } from 'react';
import {StyleSheet, 
        Text, 
        Image, 
        View, 
        TouchableOpacity, 
        SafeAreaView, 
        FlatList,  
        AsyncStorage
        } from 'react-native';
import { Subscribe } from 'unstated';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../../firebaseConfig';
import {db} from '../../firebaseConfig'
import * as ImagePicker from 'expo-image-picker';
//@ts-ignore
import GlobalStateContainer from '../containers/GlobalState';
import ProfileNumber from '../components/ProfileNumber';
import Item from '../components/Item';

type pickerResult = {
  cancelled: boolean
  height: number
  type: string
  uri: string
  width: number
}

type userReviewDocResponse = {
  category: string,
  createdAt: firebase.firestore.Timestamp,
  favoriteMenu: string,
  price: string,
  shopAddress: string,
  shopId: string,
  shopName: string
  user: firebase.firestore.DocumentReference
}

type userDataDocResponse = {
  userName: string
  iconURL: string
}

type userReviewsType = userReviewDocResponse[]

const Profile = (props: any) => {
  const [userName, setUserName] = useState<string>()
  const [followee, setFollowee] = useState<number>(0)
  const [follower, setFollower] = useState<number>(0)
  const [postNumber, setPostNumber] = useState<number>(0)
  const [shopData, setShopData] = useState<userReviewsType>([])
  const [followStatus, changeStatus] = useState('follow')
  const [pressStatus, changePress] = useState(false)
  const [image, setImage] = useState<string>();

  useEffect(() => {
    const userId = props.globalState.state.userData.uid
    const ref = firebase.firestore().collection('userList').doc(userId)
    let userReviews: userReviewsType = []
    db.collectionGroup('reviews').where('user', '==', ref).orderBy('createdAt', 'desc').get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let userReview = doc.data() as userReviewDocResponse
          userReviews.push(userReview)
        })
        let reviewNumber: number = userReviews.length
        setPostNumber(reviewNumber)
        setShopData(userReviews)
      })
  }, [])

  useEffect(() => {
    (async () => {
      const userId = props.globalState.state.userData.uid
      const userData = await db.collection('userList').doc(userId)
      .get().then(function(doc) {
        let userData = doc.data() as userDataDocResponse
        return userData
      })
      userData.iconURL != 'test-url' ? setImage(userData.iconURL) : setImage('file:///Users/oxyu8/Downloads/okuse_yuya.jpg')
    })();
  }, [])

  useEffect(() => {
    const userId = props.globalState.state.userData.uid
    firebase.firestore().collection('userList').doc(userId)
    .get().then(function(doc) {
      let userData = doc.data() as userDataDocResponse
      setUserName(userData.userName)
    })
  },[])

  useEffect(() => {
    const userId = props.globalState.state.userData.uid
    let followeeArray:string[] = []
    db.collection('userList').doc(userId).collection('followee')
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        followeeArray.push(doc.id)
      })
      let followeeNumber: number = followeeArray.length-1
      setFollowee(followeeNumber)
  })

  },[])
  useEffect(() => {
    const userId = props.globalState.state.userData.uid    
    let followerArray:string[] = []
    db.collection('userList').doc(userId).collection('follower')
    .get()
    .then(function(querySnapshot:any) {
      querySnapshot.forEach(function(doc:any) {
        followerArray.push(doc.id)
      })
      let followerNumber: number = followerArray.length-1
      setFollower(followerNumber)
  })
  },[])

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

  const imagePick = async(): Promise<ImagePicker.ImagePickerResult> => {
    let result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    return result
  }

  const changeIcon2 = async():Promise<string> => {
      let result = await imagePick() as pickerResult
      let data = ''
      data = await uploadResult(result.uri, 'test-image7')
      return data
  }

  const setIconToFirestore = (url:string):Promise<void> => {
    console.log('3a')
    const userId = props.globalState.state.userData.uid
    return db.collection('userList').doc(userId)
    .set({
      iconURL: url
    }, {merge: true})
  }

  const imageInput = (gotresult: string) =>{
    setImage(gotresult);
  }
  const changeIcon = async() => {
    const _result = await changeIcon2()
    await setIconToFirestore(_result);
    imageInput(_result);
  }

const uploadResult = async (uri:string, imageName:string): Promise<string> => {
  const storageRef = firebase.storage().ref('user/icon/' + imageName);
  const response = await fetch(uri);
  const blob = await response.blob();
  await storageRef.put(blob)
  const url = await storageRef.getDownloadURL()
  return url
}

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'center',}}>
        <View>
          <View style={{alignItems: 'center', marginTop: 50}}>
            <TouchableOpacity
              onPress={changeIcon}
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
              // onPress={follow}
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
                id={item.shopId}
                title={item.shopName} 
                address={item.shopAddress}
                category={item.category} 
                price={item.price} 
                favorite={item.favoriteMenu}
              />
          }
          keyExtractor={item => item.shopId}
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
