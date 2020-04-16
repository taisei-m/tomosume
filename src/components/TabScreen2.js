import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimension, Platform } from 'react-native';
import { SearchBar } from 'react-native-elements';
import * as Permissions from 'expo-permissions'

export default class App extends React.Component {
  state = {
    search: '',
    title: 'park',
    description: '遊び場',
    latlng: {
      latitude: 34.726912,
      longitude: 137.7202243,
    },
    isNotificationPermitted: false,
    isLocationPermitted: false,
  };
  updateSearch = search => {
    this.setState({ search });
  };
  async componentDidMount () {
    this.setState({
      isNotificationPermitted: await this._confirmNotificationPermission(),
      isLocationPermitted: await this._confirmLocationPermission()
    })
  }
  render() {
    const { search } = this.state;
    return (
      
      <View style={styles.container}>
              <SearchBar
        placeholder="Type Here..."
        onChangeText={this.updateSearch}
        value={search}
      />
        <MapView style={styles.mapStyle}
        initialRegion={{
          latitude: 34.726912,
          longitude: 137.7202243,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}>
          <Marker
            title={this.state.title}
            description={this.state.description}
            coordinate={this.state.latlng}
          />
        </MapView>
        <View>
          <Text>Notification Permission: { this.state.isNotificationPermitted ? '○' : '×' }</Text>
          <Text>Location Permission: { this.state.isLocationPermitted ? '○' : '×' }</Text>
        </View>
      </View>
    );
  }

  async _confirmNotificationPermission () {
    const permission = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    if (permission.status === 'granted') return true
    const askResult = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    return askResult.status === 'granted'
  }

  async _confirmLocationPermission () {
    const permissionIsValid = () => {
      if (permission.status !== 'granted') return false
      if (Platform.OS !== 'ios') return true
      return permission.permissions.location.ios.scope === 'always'
    }
    const permission = await Permissions.getAsync(Permissions.LOCATION)
    if (permissionIsValid(permission)) return true
    const askResult = await Permissions.askAsync(Permissions.LOCATION)
    return permissionIsValid(askResult)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  mapStyle: {
    width: '100%',
    height: '100%'
  },
});