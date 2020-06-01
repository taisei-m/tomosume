import { Container } from "unstated";

export default class GlobalContainer extends Container {
   //Splash.tsx
   setSplashFalse = ():void => {
      this.setState({
         isSplash: false
      })
   }
   //LoginScreen.tsx
   login = (uid: string):void => {
      this.setState({
         isSignout: "false"
      }),
      this.setState({
         uid: uid
      })
   }
   //Setting.tsx
   logout = ():void => {
      this.setState({
         isSignout: "true"
      })
   }
   setItemId = (id: string): void => {
      this.setState({
         itemId: id
      })
   }
   setFriendId = (id: string):void => {
      this.setState({
         friendId: id
      })
   }
   //CreateAccount.tsx
   setUserEmail = (userEmail: string): void => {
      this.setState({
         userEmail: userEmail
      })
   }
   //Splash.tsx
   setUid = (uid: string): void=> {
      this.setState({
         userEmail: uid
      })
   }
}
