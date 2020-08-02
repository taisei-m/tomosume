import {StackNavigationProp} from '@react-navigation/stack'
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

// Top.tsx search.tsx
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

// findUser.tsx changeUserName
export type userProfileDataType = {
    userName: string
    uid: string
    iconURL: string
    followExchange?: boolean
}

export type candidateUesrsDataListType = userProfileDataType[]

// friendProfile.tsx
export type friendReviewDocResponse = {
	category: string,
	createdAt: firebase.firestore.Timestamp,
	favoriteMenu: string,
	price: string,
	shopAddress: string,
	shopId: string,
	shopName: string
	user: firebase.firestore.DocumentReference
}
export type friendDataDocResponse = {
	userName: string
	iconURL: string
	uid: string
}
export type friendReviewsType = friendReviewDocResponse[]

// search.tsx
export type ShopDocResponse = {
	address: string
	latitude: number
	longitude: number
	shopName: string
	reviews: firebase.firestore.CollectionReference
	id: string
}

export type ShopsArrayType= ShopDocResponse[]

// Search.tsx
export type regionType = {
    latitude: number,
	longitude: number,
	latitudeDelta: number,
	longitudeDelta: number,
}

export type ContainerType = {
    isSplash: boolean
    isSignout: string
    uid: string
    itemId: string
    friendId: string
    createAccountEmail: string
    resetPasswordEmail: string
}

export type IndexParamList = {
    NavUnlogin: {
        headerShown: boolean
    }
    NavLogined: {
        headerShown: boolean
    }
}

export type NavUnloginParamList = {
    SelectLoginOrSignup: {
        headerShwon: boolean
    }
    LoginScreen: {
        headerShwon: boolean
    }
    CreateAccount: {
        headerShwon: boolean
    }
    ResetPassword: {
        headerShwon: boolean
    }
    afterResetEmail: {
        headerShwon: boolean
    }
    ResendEmail: {
        headerShwon: boolean
    }
    NavLogin: {
        headerShwon: boolean
    }
}

export type NavLoginParamList = {
    Top: {
        title: string
    }
    Search: {
        title: string
    }
    Post: {
        title: string
    }
    Profile: {
        title: string
    }
}

export type TopStackParamList = {
    Top: {
        headerShown: boolean
        title: string
    }
    friendProfile: {
        headerShown: boolean
        title: string
    }
    friendFollowerList: {
        headerShown: boolean
        title: string
    }
    friendFolloweeList: {
        headerShown: boolean
        title: string
    }
}
export type TopStackNavProps<T extends keyof TopStackParamList> = {
    navigation: StackNavigationProp<TopStackParamList, T>
}