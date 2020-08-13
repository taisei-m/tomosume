import firebase from '../../../firebaseConfig';
import { AsyncStorage } from 'react-native';
//@ts-ignore
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { ContainerProps } from '../../types/types';

export const logout = (props:ContainerProps) => {
	firebase.auth().signOut().then(function() {
		AsyncStorage.setItem('Authenticated', 'false', () => {
			props.globalState.logout();
		});
	})
		.catch(function(error) {
			console.log(error);
		});
};