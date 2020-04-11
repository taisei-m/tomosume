import * as React from 'react';
import { StyleSheet, Button, View, TouchableOpacity, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, } from 'react-native-elements'


function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}

function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
    <View>
        <Text style={styles.logo}>TomoSume</Text>
    </View>
    <View style={styles.inputView} >
        <TextInput  
            style={styles.inputText}
            placeholder="userID"
            placeholderTextColor="#003f5c"
        />
    </View>

    <View style={styles.inputView} >
        <TextInput  
            style={styles.inputText}
            placeholder="password" 
            placeholderTextColor="#003f5c"
        />
    </View>
    <TouchableOpacity>
    <Text style={styles.forgot}>Forgot Password?</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
    >
        <Text style={styles.buttonText}> Sign In </Text>
    </TouchableOpacity>
    <TouchableOpacity
    >
        <Text> Create Account </Text>
    </TouchableOpacity>
    </View>
);
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
  },
  logo:{
      fontWeight:"bold",
      fontSize:50,
      color:"black",
      marginBottom:40
  },
  inputView:{
      width:"80%",
      borderRadius:25,
      borderColor: 'black',
      height:50,
      marginBottom:20,
      justifyContent:"center",
      padding:20
  },
  inputText:{
      height:50,
      color:"white"
  },
  forgot: {
      margin: 20,
      color: '#818181',
      marginBottom: 60
  },
  button: {
      width:"80%",
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