import React from 'react';
import { Button } from 'react-native-elements';
//@ts-ignore
import firebase from '../../firebase';

interface ShareButtonProps {
    shopName: string
    favoriteMenu: string,
    price: string,
    category: string,
    latitude: number,
    longitude: number,
    buttonTitle: string,
    buttonType?: string,
}

const ShareButton = (props: ShareButtonProps) => {
    const share = () => {
        const postShopData = firebase.firestore().collection('postShopData')
        postShopData.add({
            shopName: props.shopName,
            favoriteMenu: props.favoriteMenu,
            price: props.price,
            category: props.category,
            createdAt: new Date(),
            latitude: props.latitude,
            longitude: props.longitude,
        })
        .then(function() {
            console.log('success')
        })
        .catch(function(error: any) {
            console.log(error)
        })
    }
    return(
        <>
            <Button
                title={props.buttonTitle}
                type={props.buttonType}
                onPress={share}
            />
        </>
    )
}

export default ShareButton
