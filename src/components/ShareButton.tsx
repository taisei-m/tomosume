import React from 'react';
import { useState, useEffect } from 'react';
// import { useState } from 'react';
import { Button } from 'react-native-elements';
//@ts-ignore
import firebase from '../../firebase';
import apiKey from '../api/api_key';


interface ShareButtonProps {
    shopName: string
    address: string
    favoriteMenu: string,
    price: string,
    category: string,
    buttonTitle: string,
    buttonType?: string,
}
const ShareButton = (props: ShareButtonProps) => {
    // const [complete, setComplete] = useState<boolean>(true)
    // if (props.shopName != null && props.address != null && props.favoriteMenu != null && props.price != null && props.category != null) {
    //     setComplete(false)
    // }
    const postShopData = firebase.firestore().collection('postData')
    const key = apiKey;
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${props.address}&key=${key}`;
    let latitude = 0
    let longitude = 0
    const share = async() => {
    try {
        const result = await fetch(apiUrl);
        const json = await result.json();
        let set = (function setLocationData () {
            return new Promise((resolve) => {
                console.log(json.results[0].geometry.location.lat)
                console.log(json.results[0].geometry.location.lng)
                latitude = json.results[0].geometry.location.lat
                longitude = json.results[0].geometry.location.lng
                console.log(latitude)
                console.log(longitude)
                resolve();
            });
        })();
        Promise.all([set]).then(function() {
            postShopData.add({
                shopName: props.shopName,
                address: props.address,
                favoriteMenu: props.favoriteMenu,
                price: props.price,
                category: props.category,
                createdAt: new Date(),
                latitude: latitude,
                longitude: longitude,
            })
            .then(function() {
                console.log('success')
            })
            .catch(function(error: any) {
                console.log(error)
            })
        })
    } catch (error) {
        console.log(error)
    }
}
    return(
        <>
            <Button
                buttonStyle={{borderRadius: 20}}
                title={props.buttonTitle}
                type={props.buttonType}
                // disabled={complete}
                onPress={share}
            />
        </>
    )
}

export default ShareButton
