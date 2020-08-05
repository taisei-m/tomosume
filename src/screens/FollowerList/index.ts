import { diffClamp } from 'react-native-reanimated'
import {db} from '../../../firebaseConfig'
import { userDescriptionType, followersType } from '../../types/types'

export const fetchFollowers = async(uid: string):Promise<string[]> => {
    let followerIds: string[] = []
    await db.collection('userList').doc(uid).collection('follower').get()
    .then(querySnapshot => {
        querySnapshot.forEach(doc => {
            followerIds.push(doc.id)
        })
    })
    followerIds = followerIds.filter( id => id != 'first')
    return followerIds
}

export const getFollowerDescriptions= async(followerIds: string[]): Promise<followersType> => {
    let followersDescription: followersType = []
    let userDescription: userDescriptionType
    followersDescription = await Promise.all(followerIds.map(async (docId) => {
        await db.collection('userList').doc(docId).get()
        .then(doc => {
            userDescription = doc.data() as userDescriptionType
        })
        return userDescription
    }))
    return followersDescription
}

export const checkFollowExchange = async(followers: followersType, uid: string):Promise<followersType> => {
    const followeeIds: string[] = []
    const followees = await db.collection('userList').doc(uid).collection('followee').get()
    followees.forEach(user => {
        followeeIds.push(user.id)
    })
    //　フォローリストとフォロワーリストの比べる。　フォロワーリストのユーザを一人一人取り出し、そのユーザがフォローリストに含まれるかを検証する
    followers.forEach(user => {
        let followerId = user.uid
        let isFollowExchange = followeeIds.includes(followerId)
    // 相互フォローの場合true, 相互フォローしていない場合falseを代入
        isFollowExchange ? user.followExchange = true : user.followExchange = false
    })
    return followers
}