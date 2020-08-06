import {db} from '../../../firebaseConfig'
import firebase from '../../../firebaseConfig'
import { ReviewDocResponse } from 'src/types/types'

export const fetchFolloweeIds = async(uid: string):Promise<string[]> => {
    const querySnapshot = await db.collection('userList').doc(uid).collection('followee').get()
    const followeeIds = querySnapshot.docs.map(doc => {
        return doc.id
    })
    return followeeIds
}

export const convertToReference = async(followeeIds: string[]):Promise<any> => {
    let reference: firebase.firestore.DocumentReference
    followeeIds = followeeIds.filter(n => n != 'first')
    const convertedFollowees = followeeIds.map(uid => {
        reference = db.collection('userList').doc(uid)
        return reference
    })
    return convertedFollowees
}

export const fetchReviews = async(queryDocsSnapshot: any):Promise<any> => {
    const reviews = await Promise.all(queryDocsSnapshot.map(async (item) => {
        let review = item.data() as ReviewDocResponse
        review.key = item.id
        const userProfile = await (review.user).get()
        review.userName = userProfile.get('userName')
        review.iconURL = userProfile.get('iconURL')
        review.userId = userProfile.id
        return review
    }))
    return reviews
}