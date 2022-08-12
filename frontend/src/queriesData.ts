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
