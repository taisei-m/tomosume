import { PinFunc } from '@/types/types';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';


const Pindescription = (props: PinFunc) =>{ 

    const [_descriptionVisible, setDescriptionVisible] =useState<any>('none');

    useEffect(() => {
        if( props.openedPinId == props.shopDoc.id ){
            setDescriptionVisible('');
        } else {
            setDescriptionVisible('none');
        }
	}, [props.openedPinId]);

    return(
        <View>
            <View style={{display: _descriptionVisible}}>
                <View style={styles.description}>
                    <Text>{props.shopDoc.shopName}</Text>
                    <Text>{props.shopDoc.address}</Text>
                </View>
            </View>
            <TouchableOpacity 
                onPress={
                    () => {
                        props.setPinId(props.shopDoc.id);
                        props.showShopReviews(props.shopDoc.id, props.shopDoc.latitude, props.shopDoc.longitude)
                    }
                }
            >
                <Image
                    source={require('../../assets/pin.png')}
                    style={styles.pin}
                />
            </TouchableOpacity>
        </View>
    );
}

export default Pindescription;


const styles = StyleSheet.create({
    pin: {
        width: 40,
        height: 40
    },
    description: {
		backgroundColor: 'white',
		width: '70vw',
		justifyContent: 'center',
		padding: '0.5rem'
	},
});

