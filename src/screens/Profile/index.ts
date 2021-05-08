import firebase from "../../../firebaseConfig";
import { db } from "../../../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { pickerResult } from "../../types/types";

import { Review } from "../../types/review";
import { User } from "../../types/user";

// ユーザが投稿したレビューの一覧と投稿数を取得
export const fetchReviews = async (uid: string): Promise<Review[]> => {
  const userRef = db.collection("userList").doc(uid);
  return await db
    .collectionGroup("reviews")
    .where("user", "==", userRef)
    .orderBy("createdAt", "desc")
    .get()
    .then((qs) => {
      const reviews = Promise.all(
        qs.docs.map(async (doc) => {
          return doc.data() as Review;
        })
      );
      return reviews;
    });
};

// ユーザーのアイコン画像を取得
export const fetchUserDescription = async (uid: string): Promise<User> => {
  return await db
    .collection("userList")
    .doc(uid)
    .get()
    .then((doc) => {
      return doc.data() as User;
    });
};

export const fetchFollowers = async (uid: string): Promise<number> => {
  //ここでawaitをしないとreturnにで返される値はforEachが実行される前のものとなるので0となる.
  const followers = await db
    .collection("userList")
    .doc(uid)
    .collection("follower")
    .get()
    .then((qs) => {
      const _followers = qs.docs.map((doc) => {
        return doc.data().id as string;
      });
      return _followers;
    });
  return followers.length - 1;
};

export const getProfileIcon = async (uid: string): Promise<string> => {
  const selectedIcon = (await selectIcon()) as pickerResult;
  //画像選択画面でキャンセルをした際，selectedIcon.cancelledがtrueになる
  if (!selectedIcon.cancelled) {
    const iconUrl = await fetchIconUrl(selectedIcon.uri, uid);
    return iconUrl;
  } else {
    return "cancel";
  }
};

export const selectIcon = async (): Promise<ImagePicker.ImagePickerResult> => {
  const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync(
    {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    }
  );
  return result;
};

export const fetchIconUrl = async (
  uri: string,
  imageName: string
): Promise<string> => {
  const storageRef = firebase.storage().ref("user/icon/" + imageName);
  const response = await fetch(uri);
  const blob = await response.blob();
  await storageRef.put(blob);
  const iconUrl = (await storageRef.getDownloadURL()) as string;
  return iconUrl;
};

export const setIconUrl = (
  uid: string,
  url: string | boolean
): Promise<void> => {
  return db.collection("userList").doc(uid).set(
    {
      iconURL: url
    },
    { merge: true }
  );
};
