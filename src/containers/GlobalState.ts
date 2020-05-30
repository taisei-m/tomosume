import { Container } from "unstated";

export default class GlobalContainer extends Container {
   state = {
      isSplash: true,
      isSignout: "",
      userData: undefined,
      itemId: "",
      friendId: '',
   }
   setUserData = (user) => {
      this.setState({
         userData: user
      })
   }
   setSplashFalse = () => {
      this.setState({
         isSplash: false
      })
   }
   setSignout = (result) => {
      this.setState({
         isSignout: result
      })
   }
   login = (user) => {
      this.setState({
         isSignout: "false"
      }),
      this.setState({
         userData: user
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
   setItemId = (id) => {
      this.setState({
         itemId: id
      })
   }
   setFriendId = (id: string) => {
      this.setState({
         friendId: id
      })
   }
}