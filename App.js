import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function App() {
  // state = {
  //   userId: '',
  //   password: '',
  // }
  return (
    <View style={styles.container}>
    <Text style={styles.logo}>Tomosume</Text>
    <View style={styles.inputView} >
      <TextInput  
        style={styles.inputText}
        placeholder="userId..." 
        placeholderTextColor="white"
        onChangeText={text => this.setState({userId:text})}/>
    </View>
    <View style={styles.inputView} >
      <TextInput  
        secureTextEntry
        style={styles.inputText}
        placeholder="Password..." 
        placeholderTextColor="white"
        onChangeText={text => this.setState({password:text})}/>
    </View>
    <TouchableOpacity>
      <Text style={styles.forgot}>Forgot Password?</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.loginBtn}>
      <Text style={styles.loginText}>LOGIN</Text>
    </TouchableOpacity>
    <TouchableOpacity>
      <Text style={styles.loginText}>Signup</Text>
    </TouchableOpacity>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242E37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"white",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor: 'grey',
    opacity: .3,
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"white"
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#3E48E0",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
});
