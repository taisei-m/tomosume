import { Container } from "unstated";

export default class GlobalContainer extends Container {
   state = {
      // isLoading - We set this to true when we're trying to check if we already have a token saved in AsyncStorage
      // isSignout - We set this to true when user is signing out, otherwise set it to false
      // userToken - The token for the user. If it's non-null, we assume the user is logged in, otherwise not.
      isLoading: false,
      isSignout: true,
      userToken: undefined
   }

   endLoding = () => {
      this.setState({
         isLoading: false
      })
   }

   login = () => {
      console.log("method start");
      
      this.setState({
         isSignout: false
      })
      this.setState({
         userToken: 'やったね！'
      })
      console.log("method end");
   }

   signup = () => {
      this.state({
         userToken: "どこでメソッド呼ぼうかな"
      })
   }
   
   logout = () => {
      this.setState({
         isSignout: true
      })
   }

 }