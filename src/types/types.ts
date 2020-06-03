// Profile.tsx
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

export type userReviewsType = userReviewDocResponse[]

// followerList.tsx
export type followerProfileType = {
    userName: string
    iconURL: string
    uid: string
    followExchange: boolean
}

export type followerListType = followerProfileType[]

// followeeList.tsx
export type followeeProfileType = {
    userName: string
    iconURL: string
    uid: string
    followExchange: boolean
}

export type followeeListType = followeeProfileType[]

// followButton.tsx
export type followButtonProps = {
    id: string
    isFollowExchange: boolean
    userId: string
}

// Post.tsx
export type PredictionJsonType = {
    predictions: predictionsArrayType
}
export type predictionsArrayType = predictionsType[]

export type predictionsType = {
    description: string,
    id: string,
    place_id: string,
    structured_formatting: structuredFormattingType
}

export type structuredFormattingType = {
    main_text: string
}

// Top.tsx
export type ReviewDocResponse = {
	category: string,
	createdAt: firebase.firestore.Timestamp,
	favoriteMenu: string,
	price: string,
	shopAddress: string,
	shopId: string,
	shopName: string
	user: firebase.firestore.DocumentReference
	userName?: string
	iconURL?: string
	key?: string
	userId?: string
}

export type ReviewsDocResponse = ReviewDocResponse[]