import { db } from '../../../firebaseConfig';
import { PredictionJsonType } from '../../types/types';
import apiKey from '../../api/api_key';

//TODO:エラー処理について調べる
export const fetchShopPredictions = async (
	shopName: string,
	latitude: number,
	longitude: number,
): Promise<PredictionJsonType | never> => {
	const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}
    &input=${shopName}&location=${latitude}, ${longitude}
    &language=ja&radius=5000`;
	try {
		const Predictions: Response = await fetch(apiUrl);
		const json = (await Predictions.json()) as PredictionJsonType;
		return json;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const fetchShopDescription = async (address: string): Promise<any> => {
	const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;
	const shopDescription = await fetch(apiUrl);
	const shopDescriptionJson = await shopDescription.json();
	return shopDescriptionJson;
};
type shopInfomationType = {
	latitude: number;
	longitude: number;
	placeId: string;
};
export const registerShopInfomation = async (
	shopDescriptionJson: any,
): Promise<shopInfomationType> => {
	const shopInfomation: shopInfomationType = {
		latitude: 0,
		longitude: 0,
		placeId: '',
	};
	shopInfomation.latitude = shopDescriptionJson.results[0].geometry.location.lat;
	shopInfomation.longitude = shopDescriptionJson.results[0].geometry.location.lng;
	shopInfomation.placeId = shopDescriptionJson.results[0].place_id;
	return shopInfomation;
};

export const setShopInfoOnFireStore = async (
	shopInfomation: shopInfomationType,
	address: string,
	shopName: string,
) => {
	db.collection('shops').doc(shopInfomation.placeId).set({
		shopName: shopName,
		address: address,
		latitude: shopInfomation.latitude,
		longitude: shopInfomation.longitude,
	});
};

export const registerReview = async (
	shopInfomation: shopInfomationType,
	uid: string,
	price: string,
	category: string,
	favoriteMenu: string,
	shopName: string,
	address: string,
) => {
	db
		.collection('shops')
		.doc(shopInfomation.placeId)
		.collection('reviews')
		.doc(shopInfomation.placeId + uid)
		.set({
			shopId: shopInfomation.placeId,
			user: db.collection('userList').doc(uid),
			address: address,
			shopName: shopName,
			favoriteMenu: favoriteMenu,
			price: price,
			category: category,
			createdAt: new Date(),
		});
};

export const canPress = (category: string, shopName: string, isPressed: boolean): boolean => {
	if (category == '' || shopName == '') {
		return true;
	} else if (isPressed) {
		return true;
	} else {
		return false;
	}
};
