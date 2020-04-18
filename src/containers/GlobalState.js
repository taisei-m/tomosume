import { Container } from "unstated";

export default class GlobalContainer extends Container {
   state = {
      isLoading: true,
      isSignout: true,
      userToken: undefined
   }   
 }