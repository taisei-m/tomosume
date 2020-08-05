import firebase from '../../../firebaseConfig';
import {db} from '../../../firebaseConfig'
import * as ImagePicker from 'expo-image-picker';
import { userDataDocResponse, userReviewDocResponse, userReviewsType, pickerResult } from '../../types/types';

export const toUserDetailPage = (id, props) => {
    props.globalState.setFriendId(id)
    props.navigation.navigate('friendProfile')
}