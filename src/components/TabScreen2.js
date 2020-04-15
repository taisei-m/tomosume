import React from 'react';
import {MapView,Marker} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

export default function TabScreen2() {


  return (
    <View style={styles.container}>
      <MapView style={styles.mapStyle}/>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapStyle: {
      width: '90%',
      height: '90%',
    },
  });
  