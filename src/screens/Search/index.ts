import {db} from '../../../firebaseConfig'
import firebase from '../../../firebaseConfig'
import { ReviewDocResponse, ShopDocResponse, ShopsArrayType } from '../../types/types'

export const fetchFolloweeIds = async(uid):Promise<string[]> => {
    const querySnapshot = await db.collection('userList').doc(uid).collection('followee').get()
    const followeeIds = querySnapshot.docs.map(doc => {
        return doc.id
    })
    return followeeIds
}

export const convertToReferenceType = async(followeeIds: string[]):Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>[]> => {
    let reference: firebase.firestore.DocumentReference
    followeeIds = followeeIds.filter(n => n != 'first')
    let convertedFollowees = followeeIds.map(uid => {
        reference = db.collection('userList').doc(uid)
        return reference
    })
    return convertedFollowees
}

export const fetchShopDescription = async(shopReviewdByFollowerDocs:any):Promise<any> => {
    const shopDescriptions = await Promise.all(shopReviewdByFollowerDocs.map(async (item) => {
        let shopId = item.data().shopId
        return db.collection('shops').doc(shopId).get().then(doc => {
            let shopDescription = doc.data() as ShopDocResponse
            shopDescription.id = doc.id
            return shopDescription
        })
    }))
    return shopDescriptions
}

export const fetchReviews = async(queryDocsSnapshot:any):Promise<any> => {
    const reviews = await Promise.all(queryDocsSnapshot.map(async (item) => {
        let review = item.data() as ReviewDocResponse
        review.key = item.id
        const profile = await (review.user).get()
        review.userName = profile.get('userName')
        review.iconURL = profile.get('iconURL')
        review.userId = profile.id
        return review
    }))
    return reviews
}