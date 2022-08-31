import axios from "axios";
import {userDataIn, friendListIn, inventoryItem, statsIn, formDataOut} from "@/queriesData"

export async function RedirectToFTAuth() {
    try {
        const response = await axios.get(process.env.VUE_APP_BACK_URL + "/auth")
        window.location.href = response.data.page
    } catch {
        throw ("Error while getting auth link")
    }
}

export async function getAuthResponse(): Promise<string> {
    let params = (new URL(window.location.toString())).searchParams
    try {
        const response = await axios.post( process.env.VUE_APP_BACK_URL + "/auth/" + params.get('code'))
        return response.data.session
    } catch {
        throw ("Error while registering session")
    }
}

export async function getUserData(login: string): Promise<userDataIn> {
    try {
    const response = await axios.get(process.env.VUE_APP_BACK_URL + "/user/" + login + "/profile", {
            withCredentials: true,
        })
        return response.data
    } catch {
       throw ("Error while getting profile data")
    }
}

export async function postForm(userData: formDataOut, login: string): Promise<formDataOut> {
    let target: string = process.env.VUE_APP_BACK_URL + "/user/"
    target += login
    console.log(userData)
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
