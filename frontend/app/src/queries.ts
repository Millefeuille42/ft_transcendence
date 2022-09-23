import axios from "axios";
import {
    userDataIn,
    friendListIn,
    inventoryItem,
    statsIn,
    formDataOut,
    onlineDataIn,
    blockedListIn,
    match, sessionData, twoFAInit, getChannelResp, getDmResp, channelData, smolUserData
} from "@/queriesData"

export async function RedirectToFTAuth() {
    try {
        const response = await axios.get(process.env.VUE_APP_BACK_URL + "/auth")
        window.location.href = response.data.page
    } catch(e) {
        throw e
    }
}

export async function getAuthResponse(): Promise<sessionData> {
    let params = (new URL(window.location.toString())).searchParams
    try {
        const response = await axios.post( process.env.VUE_APP_BACK_URL + "/auth/" + params.get('code'))
        return response.data
    } catch(e) {
        throw e
    }
}

export async function getUserData(login: string): Promise<userDataIn> {
    try {
        const response = await axios.get(process.env.VUE_APP_BACK_URL + "/user/" + login + "/profile", {
            withCredentials: true,
        })
        return response.data
    } catch (e) {
        throw e
    }
}

export async function getUserByUser(from: string, target: string): Promise<smolUserData> {
    try {
        const response = await axios.get(process.env.VUE_APP_BACK_URL + `/user/byuser/${target}/${from}`, {
            withCredentials: true,
        })
        return response.data
    } catch (e) {
        throw e
    }
}

export async function postForm(userData: formDataOut, login: string): Promise<formDataOut> {
    let target: string = process.env.VUE_APP_BACK_URL + "/user/"
    target += login
    try {
        let response = await axios({
            method: 'patch',
            url: target,
            data: userData,
            withCredentials: true,
        })
        return response.data
    } catch (e) {
        throw e
    }
}

export async function getFriendsList(login: string): Promise<friendListIn> {
    let target: string = process.env.VUE_APP_BACK_URL + "/friends/"
    target += login
    try {
        let response = await axios( {
            method: 'get',
            url: target,
            withCredentials: true,
        })
        return response.data
    } catch (e) {
        throw e
    }
}

export async function getFriendStatus(login: string, friend: string): Promise<string> {
    let target: string = process.env.VUE_APP_BACK_URL + "/friends/"
    target += login + "/" + friend + "/online"
    try {
        let response = await axios( {
            method: 'get',
            url: target,
            withCredentials: true,
        })
        if (response.data === true)
            return 'online'
        return 'offline'
    } catch (e) {
        throw e
    }
}

export async function addFriend(login: string, friend: string) {
    let target: string = process.env.VUE_APP_BACK_URL + "/friends/"
    target += login + "/" + friend
    try {
        await axios( {
            method: 'post',
            url: target,
            withCredentials: true,
        })
        return ;
    } catch (e) {
        throw e
    }
}

export async function addBlock(login: string, block: string) {
    let target: string = process.env.VUE_APP_BACK_URL + "/blocked/"
    target += login + "/" + block
    try {
        await axios( {
            method: 'post',
            url: target,
            withCredentials: true,
        })
        return ;
    } catch (e) {
        throw e
    }
}

export async function removeFriendFromList(login: string, friend: string) {
    let target: string = process.env.VUE_APP_BACK_URL + "/friends/"
    target += login + "/" + friend
    try {
        await axios( {
            method: 'delete',
            url: target,
            withCredentials: true,
        })
        return ;
    } catch (e) {
        throw e
    }
}

export async function getInventoryByCategory(login: string, category: string): Promise<Array<inventoryItem>> {
    let target:string = process.env.VUE_APP_BACK_URL + "/items/inventory/"
    target += login + "/" + category

    return await axios({
        method: 'get',
        url: target,
        withCredentials: true
    }).then((response) => {
        return response.data
    }).catch((e) => {
        throw e
   })
}

export async function getEquippedByCategory(login: string, category: string): Promise<inventoryItem> {
    let target:string = process.env.VUE_APP_BACK_URL + "/items/equipped/"
    target += login + "/" + category

    return await axios({
        method: 'get',
        url: target,
        withCredentials: true
    }).then((response) => {
        return response.data
    }).catch((e) => {
        throw e
    })
}

export async function equipItem(login: string, item: inventoryItem) {
    let target:string = process.env.VUE_APP_BACK_URL + "/items/equipped/"
    target += login + "/" + item.category + "/" + item.name

    return await axios({
        method: 'post',
        url: target,
        withCredentials: true
    }).catch((e) => {
        throw e
    })
}

export async function dropItem(login: string): Promise<inventoryItem> {
    let target:string = process.env.VUE_APP_BACK_URL + "/items/drop/"
    target += login

    return await axios({
        method: 'get',
        url: target,
        withCredentials: true
    }).then((response) => {
        return response.data
    }).catch((e) => {
        throw e
    })
}

export async function getUserStats(login: string): Promise<statsIn> {
    let target:string = process.env.VUE_APP_BACK_URL + "/game/" + login
    target += "/stats"

    return await axios({
        method: 'get',
        url: target,
        withCredentials: true
    }).then((response) => {
        return response.data
    }).catch((e) => {
        throw e
    })
}

export async function getOnlineList(login: string): Promise<Array<onlineDataIn>> {
    let target:string = process.env.VUE_APP_BACK_URL + "/user/online/" + login
    return await axios({
        method: 'get',
        url: target,
        withCredentials: true
    }).then((response) => {
        return response.data
    }).catch((e) => {
        throw e
    })
}

export async function getBlockedList(login: string): Promise<Array<blockedListIn>> {
    let target:string = process.env.VUE_APP_BACK_URL + "/blocked/" + login
    return await axios({
        method: 'get',
        url: target,
        withCredentials: true
    }).then((response) => {
        return response.data
    }).catch((e) => {
        throw e
    })
}

export async function removeBlock(login: string, block: string) {
    let target: string = process.env.VUE_APP_BACK_URL + "/blocked/"
    target += login + "/" + block
    try {
        await axios( {
            method: 'delete',
            url: target,
            withCredentials: true,
        })
        return ;
    } catch (e) {
        throw e
    }
}

export async function getHistory(login: string): Promise<Array<match>> {
    let target: string = process.env.VUE_APP_BACK_URL + "/game/"
    target += login + "/history"
    return await axios( {
        method: 'get',
        url: target,
        withCredentials: true,
    }).then((response) => {
        return response.data
    }).catch((e) => {
        throw e
    })
}

export async function deleteUser(login: string) {
    let target: string = process.env.VUE_APP_BACK_URL + "/user/"
    target += login
    try {
        await axios( {
            method: 'delete',
            url: target,
            withCredentials: true,
        })
        return ;
    } catch (e) {
        throw e
    }
}

export async function getTwoFaQR(login: string): Promise<twoFAInit> {
    let target: string = process.env.VUE_APP_BACK_URL + "/user/twofa/"
    target += login
    return await axios( {
        method: 'post',
        url: target,
        withCredentials: true,
    }).then((response) => {
        return response.data
    }).catch((e) => {
        throw e
    })
}

export async function getTwoFAStatus(login: string): Promise<boolean> {
    let target: string = process.env.VUE_APP_BACK_URL + "/user/twofa/status/"
    target += login
    return await axios( {
        method: 'get',
        url: target,
        withCredentials: true,
    }).then((response) => {
        return response.data
    }).catch((e) => {
        throw e
    })
}

export async function validateTwoFaActivation(login: string, code: string) {
    let target: string = process.env.VUE_APP_BACK_URL + "/user/twofa/"
    target += login + "/" + code
    return await axios( {
        method: 'patch',
        url: target,
        withCredentials: true,
    }).then(() => {
        return
    }).catch((e) => {
        throw e
    })
}

export async function disableTwoFaActivation(login: string, code: string) {
    let target: string = process.env.VUE_APP_BACK_URL + "/user/twofa/"
    target += login + "/" + code
    return await axios( {
        method: 'delete',
        url: target,
        withCredentials: true,
    }).then(() => {
        return
    }).catch((e) => {
        throw e
    })
}

export async function getChannelsOfUser(login: string): Promise<getChannelResp> {
    let target: string = process.env.VUE_APP_BACK_URL + "/chat/channel/user/"
    target += login
    return await axios( {
        method: 'get',
        url: target,
        withCredentials: true,
    }).then((response) => {
        return response.data
    }).catch((e) => {
        throw e
    })
}

export async function getDMsOfUser(login: string): Promise<getDmResp> {
    let target: string = process.env.VUE_APP_BACK_URL + "/chat/dm/user/"
    target += login
    return await axios( {
        method: 'get',
        url: target,
        withCredentials: true,
    }).then((response) => {
        return response.data
    }).catch((e) => {
        throw e
    })
}

export async function getChannel(channel: string): Promise<channelData> {
    let target: string = process.env.VUE_APP_BACK_URL + "/chat/channel/"
    target += channel
    return await axios( {
        method: 'get',
        url: target,
        withCredentials: true,
    }).then((response) => {
        return response.data
    }).catch((e) => {
        throw e
    })
}

export async function createChannel(name: string, owner: string, p: boolean, password: string | undefined) {
    let target: string = process.env.VUE_APP_BACK_URL + "/chat/channel"

    return await axios( {
        method: 'post',
        url: target,
        data: {
            name: name,
            owner: owner,
            public: p,
			password: password
        },
        withCredentials: true,
    }).catch((e) => {
        throw e
    })
}

export async function editPrivacy(channel: string, owner: string, p: boolean, password: string) {
    let target: string = process.env.VUE_APP_BACK_URL + "/chat/channel/privacy/" + channel

    return await axios( {
        method: 'patch',
        url: target,
        data: {
            login: owner,
            public: p,
            password: password
        },
        withCredentials: true,
    }).catch((e) => {
        throw e
    })
}
