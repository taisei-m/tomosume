export type pickerResult = {
    cancelled: boolean
    height: number
    type: string
    uri: string
    width: number
}

export type userReviewDocResponse = {
    category: string,
    createdAt: firebase.firestore.Timestamp,
    favoriteMenu: string,
    price: string,
    shopAddress: string,
    shopId: string,
    shopName: string
    user: firebase.firestore.DocumentReference
}


export type userDataDocResponse = {
    userName: string
    iconURL: string
}
