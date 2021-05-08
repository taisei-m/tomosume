import firebase from "firebase";

export type Review = {
  category: string;
  createdAt: firebase.firestore.Timestamp;
  favoriteMenu: string;
  price: string;
  shopAddress: string;
  shopId: string;
  shopName: string;
  user: firebase.firestore.DocumentReference;
};
