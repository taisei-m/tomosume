import { Container } from "unstated";

export default class GlobalContainer extends Container {
   state = {
      // isLoading - We set this to true when we're trying to check if we already have a token saved in AsyncStorage
      // isSignout - We set this to true when user is signing out, otherwise set it to false
      // userToken - The token for the user. If it's non-null, we assume the user is logged in, otherwise not.
      isSplash: true,
      isSignout: "",
      userData: undefined
   }

   setUserData = (user) => {
      this.setState({
         userData: user
      })
   }

   endSplash = (result, user) => {
      this.setState({
         isSplash: false
      }),
      this.setState({
         isSignout: result
      })
   }

   login = (user) => {
      this.setState({
         isSignout: "false"
      }),
      this.setState({
         user: user
      })
   }

   signup = () => {
      this.state({
         userToken: "どこでメソッド呼ぼうかな"
      })
   }
   
   logout = () => {
      this.setState({
         isSignout: "true"
      })
   }

 }