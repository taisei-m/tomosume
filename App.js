import * as React from 'react';
import { StyleSheet, Button, View, TouchableOpacity, TextInput, Tab } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, } from 'react-native-elements'


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

function LoginScreen({ navigation }) {
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
        onPress={() => navigation.navigate('Notifications')}
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

function TabScreen1() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Tab 1 page"
      />
    </View>
  );
}

function TabScreen2() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Tab 2 page"
      />
    </View>
  );
}

function TabScreen3() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Tab 3 page"
      />
    </View>
  );
}

function TabScreen4() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Tab 4 page"
      />
    </View>
  );
}

const Tab1 = createBottomTabNavigator();

function NotificationsScreen() {
  return (
    <Tab1.Navigator>
      <Tab1.Screen name="Tab1" component={TabScreen1} />
      <Tab1.Screen name="Tab2" component={TabScreen2} />
      <Tab1.Screen name="Tab3" component={TabScreen3} />
      <Tab1.Screen name="Tab4" component={TabScreen4} />
    </Tab1.Navigator>

  );
}


const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
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