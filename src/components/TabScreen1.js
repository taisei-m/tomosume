import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';


export default class App extends Component {
  state = {
    locationResult: null
  };

componentDidMount() {
  this._getLocationAsync();
}

_getLocationAsync = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    this.setState({
      locationResult: 'Permission to access location was denied',
  });
}

let location = await Location.getCurrentPositionAsync({});
  console.log('data' + JSON.stringify(location.coords.latitude));
  console.log('data' + JSON.stringify(location.coords.longitude));
  this.setState({ locationResult: JSON.stringify(location) });
};

  render() {
    return (
      <View style={styles.container}>
        <Text>
          {this.state.locationResult}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 60
  },
});