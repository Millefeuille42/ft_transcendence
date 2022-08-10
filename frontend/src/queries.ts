import axios from "axios";
import { userDataIn, friendListIn } from "@/queriesData"

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
        const response = await axios.get(process.env.VUE_APP_BACK_URL + "/profile/" + login, {
            withCredentials: true,
        })
        return response.data
    } catch {
       throw ("Error while getting profile data")
    }
}

export async function postFormUsername(username: string, login: string): Promise<string> {
    const payload = {username: username}
    let target: string = process.env.VUE_APP_BACK_URL + "/user/"
    target += login
    target += "/username"
    try {
        let response = await axios({
            method: 'patch',
            url: target,
            data: payload,
            withCredentials: true,
        })
        return response.data.username + ""
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
