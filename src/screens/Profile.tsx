import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity, SafeAreaView, FlatList,} from 'react-native';
import { Subscribe } from 'unstated';
import firebase from '../../firebaseConfig';
import {db} from '../../firebaseConfig'
import * as ImagePicker from 'expo-image-picker';
import GlobalStateContainer from '../containers/GlobalState';
import ProfileNumber from '../components/ProfileNumber';
import ProfileReviews from '../components/ProfileReviews';
import {pickerResult} from '../types/types'
import {userReviewDocResponse} from '../types/types'
import {userDataDocResponse} from '../types/types'
import {userReviewsType} from '../types/types'

const Profile = (props: any) => {
  const [_userName, setUserName] = useState<string>()
  const [_followee, setFollowee] = useState<number>(0)
  const [_follower, setFollower] = useState<number>(0)
  const [_postNumber, setPostNumber] = useState<number>(0)
  const [_allReviews, setAllReviews] = useState<userReviewsType>([])
  const [_userIcon, setUserIcon] = useState<string>();

  // ユーザが投稿したレビューの一覧と投稿数を取得
  useEffect(() => {
    const userId = props.globalState.state.userData.uid
    const userFirestoreDocument = firebase.firestore().collection('userList').doc(userId)
    let userReviews: userReviewsType = []
    db.collectionGroup('reviews').where('user', '==', userFirestoreDocument).orderBy('createdAt', 'desc').get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let userReview = doc.data() as userReviewDocResponse
          userReviews.push(userReview)
        })
        let reviewNumber: number = userReviews.length
        setPostNumber(reviewNumber)
        setAllReviews(userReviews)
      })
  }, [])
  // ユーザーのアイコン画像を取得
  useEffect(() => {
    (async () => {
      const userId = props.globalState.state.userData.uid
      const userProfileDocument = await db.collection('userList').doc(userId)
      .get().then(function(doc) {
        let userProfileData = doc.data() as userDataDocResponse
        return userProfileData
      })
      userProfileDocument.iconURL != 'test-url' ? setUserIcon(userProfileDocument.iconURL) : setUserIcon('file:///Users/oxyu8/Downloads/okuse_yuya.jpg')
    })();
  }, [])
  // ユーザの名前を取得
  useEffect(() => {
    const userId = props.globalState.state.userData.uid
    firebase.firestore().collection('userList').doc(userId)
    .get().then(function(doc) {
      let userProfileData = doc.data() as userDataDocResponse
      console.log(userProfileData)
      setUserName(userProfileData.userName)
    })
  },[])
  // ユーザのフォロワーを取得
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
  // ユーザのフォローしている人を取得
  useEffect(() => {
    const userId = props.globalState.state.userData.uid
    let followerArray:string[] = []
    db.collection('userList').doc(userId).collection('follower')
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        followerArray.push(doc.id)
      })
      let followerNumber: number = followerArray.length-1
      setFollower(followerNumber)
  })
  },[])
  const setting = () => {
    props.navigation.navigate('toSettingPage')
  }
  const toFolloweeList = () => {
    props.navigation.navigate('followeeList')
  }
  const toFollowerList = () => {
    props.navigation.navigate('followerList')
  }
  const imageInput = (url: string) =>{
    setUserIcon(url);
  }
  const changeIcon = async() => {
    const iconUrl = await changeIconUrl()
    await setIconToFirestore(iconUrl);
    imageInput(iconUrl);
  }
  const changeIconUrl = async():Promise<string> => {
    let result = await selectIconPicture() as pickerResult
    let data = ''
    data = await uploadResult(result.uri, 'test-image7')
    return data
  }
  // 写真の変更をキャンセルした際の処理を書く必要あり
  const selectIconPicture = async(): Promise<ImagePicker.ImagePickerResult> => {
    let result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    return result
  }
  const uploadResult = async (uri:string, imageName:string): Promise<string> => {
    const storageRef = firebase.storage().ref('user/icon/' + imageName);
    const response = await fetch(uri);
    const blob = await response.blob();
    await storageRef.put(blob)
    const url = await storageRef.getDownloadURL()
    return url
  }
  const setIconToFirestore = (url:string):Promise<void> => {
    console.log('3a')
    const userId = props.globalState.state.userData.uid
    return db.collection('userList').doc(userId)
    .set({
      iconURL: url
    }, {merge: true})
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
                source={{ uri: _userIcon }}
                style = {styles.userIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center', marginTop: 10}}>
            <Text style={styles.userName}>{_userName}</Text>
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
              number={_postNumber}
              itemName='post'
            />
            <ProfileNumber
              number={_follower}
              itemName="フォロー"
              press={toFollowerList}
              centerClass={{width: 50, height: 50, marginHorizontal: 30}}
            />
            <ProfileNumber
              number={_followee}
              itemName="フォロワー"
              press={toFolloweeList}
            />
          </View>
          <View style={{ alignItems: 'center', marginTop: 20, flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={setting}
            >
              <Text
                style={styles.editText}>
                {'編集'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <SafeAreaView style={styles.list}>
        <FlatList
          data={_allReviews}
          renderItem={
            ({ item }) =>
              <ProfileReviews
                shopName={item.shopName}
                shopAddress={item.shopAddress}
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
  editButton: {
    width: 180,
    backgroundColor:"white",
    borderRadius:15,
    height:35,
    alignItems:"center",
    justifyContent:"center",
    borderColor: '#818181',
    borderWidth: 1,
  },
  editText: {
    color: 'black',
    fontWeight: '500'
  },
  list: {
    marginTop: 20,
    marginBottom: 350
  },
})
