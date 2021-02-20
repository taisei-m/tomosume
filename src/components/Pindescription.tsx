import { PinFunc, ShopDocResponse } from '@/types/types';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const PinDescriptionDetail = (props: {shopDoc: ShopDocResponse}) => {
    return(
        <View>
            <View style={styles.description}>
                <Text style={{fontWeight: 'bold'}}>{props.shopDoc.shopName}</Text>
                <Text>{props.shopDoc.address}</Text>
            </View>
        </View>
    )
}



const Pindescription = (props: PinFunc) =>{ 

    const [_descriptionVisible, setDescriptionVisible] =useState<boolean>(false);

    useEffect(() => {
        if( props.openedPinId == props.shopDoc.id ){
            setDescriptionVisible(true);
        } else {
            setDescriptionVisible(false);
        }
    }, [props.openedPinId]);
    
   

    return(
        <View style={styles.descriptionView}>
            {(props.openedPinId == props.shopDoc.id)
                ? <PinDescriptionDetail shopDoc={props.shopDoc} />
                : null
            }
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
        width: 30,
        height: 30
    },
    description: {
		backgroundColor: 'white',
		width: '70vw',
		justifyContent: 'center',
		padding: '0.5rem'
    },
    descriptionView: {
		flexDirection: 'column', 
		alignItems: 'center'
	},
});

