export interface userDataIn {
    login: string,
    username: string,
    banner: string,
    avatar: string,
    status: string
    fa: boolean

}

export interface smolUserData {
    login: string,
    avatar: string,
    username: string,
    isBlocked: boolean,
    isFriend: boolean,
}


export interface sessionData {
    cookie: {
        Session: string,
        Login: string
    }
    isTwoFA: boolean
}

export interface friendListIn {
    thereIsFriend: Boolean,
    listOfFriends: Array<string>,
}

export interface blockedListIn {
    thereIsBlocked: Boolean,
    listOfBlocked: Array<string>
}

export interface inventoryItem {
    id: number,
    rarity: number,
    category: string,
    name: string,
    description: string,
}

export interface statsIn {
    total: number,
    wins: number,
    looses: number,
    points: number,
    lastRival: string,
    history: Array<match>
}

export interface formDataOut {
    username?: string,
    avatar?: string,
    banner?: string
}

export interface onlineDataIn {
    info: {
        login: string,
        username: string,
        banner: string,
        avatar: string,
        stats: statsIn,
    }
    friend: boolean,
    friendLoading: boolean
    blockLoading: boolean
}

export interface match {
    rival: string,
    userPoints: number,
    rivalPoints: number,
    gameMode: string,
    key: number
}

export interface twoFAInit {
    qr: string,
    code: string
}

export interface messageDataIn {
    content: string,
    createAd: string,
    id: number,
    userLogin: string,
}

export interface channelData {
    id: string,
    name: string
    owner?: string,
    admins?: string[],
    users: string[],
    messages: messageDataIn[],
    public?: boolean,
    pass?: boolean,
	isDm: boolean
}

export interface dmData {
    id: string
    user: string
	name: string
	isDm: boolean
}

export interface getChannelResp {
	thereIsChannel: boolean
	channels: channelData[]
}

export interface getDmResp {
    thereIsDm: boolean
    dms: dmData[]
}
