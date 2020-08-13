import { Container } from 'unstated';
import {ContainerType} from '../types/types';

export default class GlobalContainer extends Container<ContainerType> {
   state = {
   	isSplash: true,
   	isSignout: '',
   	uid: '',
   	itemId: '',
   	friendId: '',
   	createAccountEmail: '',
   	resetPasswordEmail: '',
   }
   //Splash.tsx
   setSplashFalse = ():void => {
   	this.setState({
   		isSplash: false
   	});
   }
   //Splash.tsx
   setSignout = (result:string):void => {
   	this.setState({
   		isSignout: result
   	});
   }
   //LoginScreen.tsx
   login = (uid: string):void => {
   	this.setState({
   		isSignout: 'false'
   	});
   	this.setState({
   		uid: uid
   	});
   }
   //Setting.tsx
   logout = ():void => {
   	this.setState({
   		isSignout: 'true'
   	});
   }
   setItemId = (id: string): void => {
   	this.setState({
   		itemId: id
   	});
   }
   setFriendId = (id: string):void => {
   	this.setState({
   		friendId: id
   	});
   }
   //CreateAccount.tsx
   setCreateAccountEmail = (userEmail: string): void => {
   	this.setState({
   		createAccountEmail: userEmail
   	});
   }
   //RestPassword.tsx
   setResetPasswordEmail = (userEmail: string): void => {
   	this.setState({
   		resetPasswordEmail: userEmail
   	});
   }
   //Splash.tsx
   setUid = (uid: string): void=> {
   	this.setState({
   		uid: uid
   	});
   }
}
