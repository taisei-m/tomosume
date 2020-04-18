import React, { useState } from 'react';
import { StyleSheet, Button, View, TouchableOpacity, TextInput, Text } from 'react-native';
import { Subscribe } from 'unstated';
import GlobalStateContainer from '../containers/GlobalState';


function TabScreen11(props) {
  console.log("TabScreen1");
  console.log(props);

  const [GlobalState, a] = useState(props.globalState);
  // console.log(globalstate)

  logout = () => {        
    console.log("method logout")
    GlobalState.logout();
    // this.state.navigation.navigate('NavLogined');
  }
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Tab 1 page"
        />
         <TouchableOpacity
                    style={styles.button}
                    onPress={logout}
                    
                >
                    <Text style={styles.buttonText}> logout </Text>
                </TouchableOpacity>
      </View>
    );
}
  

const TabScreen1Wrapper = ({ navigation }) => {
  return (
      <Subscribe to={[GlobalStateContainer]}>
          {
              globalState => <TabScreen11 globalState={globalState} navigation = {navigation} />
          }
      </Subscribe>
  );
}

export default TabScreen1Wrapper;


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
