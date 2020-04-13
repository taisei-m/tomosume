import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';


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
  
          // You can return any component that you like here!
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

export default function Router() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}