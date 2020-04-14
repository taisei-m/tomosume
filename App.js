import React from 'react';
import { useState } from 'react';
import { StyleSheet, Button, View, TouchableOpacity, TextInput, Tab, AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';
import TabScreen1 from './src/components/TabScreen1';
import TabScreen2 from './src/components/TabScreen2';
import TabScreen3 from './src/components/TabScreen3';
import TabScreen4 from './src/components/TabScreen4';
import firebase from './firebase';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('LoginScreen')}
      />
    </View>
  );
}

function CreateAccount({ navigation }) {
  const [userId, setName] = useState()
  const [password, setPass] = useState()
  const userIdInput = (text) => {
    setName(text)
  }
  const passwordInput = (pass) => {
    setPass(pass)
  }
  const signUp = () => {
    console.log(userId);
    console.log(password)
    firebase.auth().createUserWithEmailAndPassword(userId, password)
    .then(function() {
      alert('sign up success')
    })
    .catch(function(error) {
      alert(error.message)
    })
  }

  return (
    <View style={styles.container}>
    <View>
        <Text style={styles.newAccountTitle}>Create New Account</Text>
    </View>
    <View style={styles.inputView} >
        <TextInput  
            style={styles.inputText}
            placeholder="userID"
            placeholderTextColor="#818181"
            value={userId}
            onChangeText={userIdInput}
        />
    </View>

    <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="password" 
          placeholderTextColor="#818181"
          value={password}
          secureTextEntry={true}
          onChangeText={passwordInput}
        />
    </View>

    <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="confirm-password" 
          placeholderTextColor="#818181"
          // value={password}
          // secureTextEntry={true}
          // onChangeText={passwordInput}
        />
    </View>
    <TouchableOpacity
        style={styles.signUpButton}
        // onPress={() => navigation.navigate('Notifications')}
        onPress={signUp}
    >
        <Text style={styles.buttonText}> Sign Up </Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => navigation.navigate('LoginScreen')}
    >
        <Text> Already have an account </Text>
    </TouchableOpacity>
    </View>
);
}

function LoginScreen({ navigation }) {

  const [userId, setName] = useState()
  const [password, setPass] = useState()
  const userIdInput = (text) => {
    setName(text)
  }
  const passwordInput = (pass) => {
    setPass(pass)
  }
  const login = () => {
    console.log(userId);
    console.log(password)
  }

  return (
    <View style={styles.container1}>
    <View>
        <Text style={styles.logo}>TomoSume</Text>
    </View>
    <View style={styles.inputView} >
        <TextInput  
            style={styles.inputText}
            placeholder="userID"
            placeholderTextColor="#818181"
            value={userId}
            onChangeText={userIdInput}
        />
    </View>

    <View style={styles.inputView} >
        <TextInput  
          style={styles.inputText}
          placeholder="password" 
          placeholderTextColor="#818181"
          value={password}
          secureTextEntry={true}
          onChangeText={passwordInput}
        />
    </View>

    <TouchableOpacity>
    <Text style={styles.forgot}>Forgot Password?</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Notifications')}
        // onPress={login}
    >
        <Text style={styles.buttonText}> Sign In </Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => navigation.navigate('creatAccount')}
    >
        <Text> Create Account </Text>
    </TouchableOpacity>
    </View>
);
}

const Tab1 = createBottomTabNavigator();

function NotificationsScreen() {
  return (
    <Tab1.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Top') {
          iconName = focused
            ? 'ios-information-circle'
            : 'ios-information-circle-outline';
        } else if (route.name === 'Post') {
          iconName = focused ? 'ios-list-box' : 'ios-list';
        } else if (route.name === 'Search') {
          iconName = focused ? 'ios-search' : 'ios-search'
        } else if (route.name === 'Profile') {
          iconName = focused ? 'ios-contact' : 'ios-contact'
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: '#5E9CFE',
      inactiveTintColor: 'gray',
    }}
    >
      <Tab1.Screen name="Top" component={TabScreen1} />
      <Tab1.Screen name="Post" component={TabScreen2} />
      <Tab1.Screen name="Search" component={TabScreen3} />
      <Tab1.Screen name="Profile" component={TabScreen4} />
    </Tab1.Navigator>

  );
}

const Stack = createStackNavigator();

function Router() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="creatAccount" component={CreateAccount} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
}

AppRegistry.registerComponent('Appname', () => App);


const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
  },
  container1: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
},
  newAccountTitle: {
    fontWeight:"bold",
    fontSize:30,
    color:"black",
    marginTop: 120,
    marginBottom: 60
  },
  logo:{
      fontWeight:"bold",
      fontSize:50,
      color:"black",
      marginBottom:100
  },
  inputView:{
      width:"80%",
      borderRadius:25,
      borderColor: 'black',
      height:50,
      marginBottom:20,
      justifyContent:"center",
      padding:20,
      color: 'black'
  },
  inputText:{
      height:50,
      color:"black",
      borderColor: '#818181',
      borderRadius: 25,
      borderWidth: 1,
      padding: 10
  },
  forgot: {
      margin: 20,
      color: '#818181',
      marginBottom: 30
  },
  signUpButton: {
    width:"70%",
    backgroundColor:"#5E9CFE",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop: 50,
    marginBottom:30
  },
  button: {
      width:"70%",
      backgroundColor:"#5E9CFE",
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginBottom:30
  },
  buttonText: {
      color: 'white'
  },
  icon: {
      marginRight: 10
  }
});