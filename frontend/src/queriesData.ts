export interface userDataIn {
    login: string,
    username: string,
    banner: string,
    avatar: string,
    status: string
}

export interface friendListIn {
    thereIsFriend: Boolean,
    listOfFriends: Array<string>,
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
}

export interface formDataOut {
    username: string,
    avatar: string,
    banner: string
}
