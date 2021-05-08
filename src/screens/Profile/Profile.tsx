import React, { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import {
  Image,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  RefreshControl,
  StyleSheet
} from "react-native";
import { Icon } from "react-native-elements";
import ProfileNumber from "../../components/ProfileNumber";
import ProfileReviews from "../../components/ProfileReviews";
import {
  fetchReviews,
  fetchUserDescription,
  fetchFollowers,
  setIconUrl,
  getProfileIcon
} from "./index";
import GlobalContainer from "../../store/GlobalState";
import {
  ProfileStackNavProps,
  userDataDocResponse,
  ContainerProps
} from "../../types/types";
import { Subscribe } from "unstated";
import { Text, Button } from "../../components/atoms/index";
import { Review } from "../../types/review";

const Profile: React.FC<
  ProfileStackNavProps<"ProfileWrapper"> & ContainerProps
> = (props) => {
  const [_userName, setUserName] = useState<string>();
  const [followeeNum, setFolloweeNum] = useState<number>(0);
  const [followerNum, setFollowerNum] = useState<number>(0);
  const [_postNumber, setPostNumber] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [_userIcon, setUserIcon] = useState<string>();
  const [userDataUpdate, setUserDataUpdate] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const reviews = await fetchReviews(props.globalState.state.uid);
      setReviews(reviews);
      setPostNumber(reviews.length);
    })();
  }, [refresh]);
  useEffect(() => {
    (async () => {
      const user = await fetchUserDescription(props.globalState.state.uid);
      setUserIcon(user.iconURL);
    })();
  }, []);
  useEffect(() => {
    const unsubscribe = db
      .collection("userList")
      .doc(props.globalState.state.uid)
      .onSnapshot((doc) => {
        const userProfileData = doc.data() as userDataDocResponse;
        setUserName(userProfileData.userName);
      });
    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    (async () => {
      const followerNum = await fetchFollowers(props.globalState.state.uid);
      setFollowerNum(followerNum);
    })();
  }, [refresh]);
  useEffect(() => {
    let followees: string[] = [];
    const unsubscribe = db
      .collection("userList")
      .doc(props.globalState.state.uid)
      .collection("followee")
      .onSnapshot((querySnapshot) => {
        followees = [];
        querySnapshot.forEach((doc) => {
          followees.push(doc.id);
        });
        const followeeNumber: number = followees.length - 1;
        setFolloweeNum(followeeNumber);
      });
    return () => {
      unsubscribe();
    };
  }, []);

  const updateProfileInfo = () => {
    setUserDataUpdate(true);
    setRefresh(!refresh);
    setUserDataUpdate(false);
  };

  //TODO: プロフィール編集画面と共に処理記述
  const editProfile = () => {};

  const changeIcon = async () => {
    try {
      const profileIcon = await getProfileIcon(props.globalState.state.uid);
      if (profileIcon == "cancel") {
      } else {
        await setIconUrl(props.globalState.state.uid, profileIcon);
        setUserIcon(profileIcon);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={userDataUpdate}
            onRefresh={() => updateProfileInfo()}
          />
        }
      >
        <View style={styles.profileDescriptionArea}>
          <View>
            <TouchableOpacity onPress={changeIcon}>
              <Image source={{ uri: _userIcon }} style={styles.userIcon} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center"
            }}
          >
            <View style={styles.userNameArea}>
              <Text weight="700" size={20}>
                {_userName}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Button
                title="プロフィール編集"
                onPress={() => console.log("ok")}
              />
              <View
                style={{
                  borderColor: "grey",
                  borderWidth: 1,
                  width: 40,
                  height: 40,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Icon
                  size={20}
                  name="cog"
                  type="font-awesome"
                  color="black"
                  onPress={() => props.navigation.navigate("setting")}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginLeft: 30 }}>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginHorizontal: "10%",
              marginTop: 10
            }}
          >
            <ProfileNumber number={_postNumber} itemName="投稿" />
            <ProfileNumber
              number={followeeNum}
              itemName="フォロワー"
              press={() => props.navigation.navigate("followerList")}
            />
            <ProfileNumber
              number={followerNum}
              itemName="フォロー"
              press={() => props.navigation.navigate("followeeList")}
            />
          </View>
        </View>
        <SafeAreaView style={[styles.list, { marginHorizontal: "5%" }]}>
          <FlatList
            data={reviews}
            renderItem={({ item }) => (
              <ProfileReviews
                shopName={item.shopName}
                shopAddress={item.shopAddress}
                category={item.category}
                price={item.price}
                favorite={item.favoriteMenu}
              />
            )}
            keyExtractor={(item) => item.shopId}
          />
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

export const ProfileWrapper: React.FC<ProfileStackNavProps<
  "ProfileWrapper"
>> = ({ navigation }) => {
  return (
    <Subscribe to={[GlobalContainer]}>
      {(globalState: GlobalContainer) => (
        <Profile globalState={globalState} navigation={navigation} />
      )}
    </Subscribe>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center"
  },
  profileDescriptionArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: "10%",
    marginTop: "15%"
  },
  userNameArea: {
    marginBottom: 10
  },
  userIcon: {
    width: 90,
    height: 90,
    borderRadius: 90 / 2,
    borderColor: "white",
    borderWidth: 2
  },
  listItem: {
    margin: 15
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
    textAlign: "center",
    color: "#818181"
  },
  editButton: {
    width: 160,
    backgroundColor: "white",
    borderRadius: 15,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#818181",
    borderWidth: 1,
    marginRight: 10
  },
  editText: {
    color: "black",
    fontWeight: "500"
  },
  list: {
    marginTop: 20,
    marginBottom: 10
  }
});
