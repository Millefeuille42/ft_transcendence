import axios from "axios";
import { userDataIn } from "@/queriesData"

export async function RedirectToFTAuth() {
    try {
        const response = await axios.get("http://e2r10p2:3000/auth")
        window.location.href = response.data.page
    } catch {
        throw ("Error while getting auth link")
    }
}

export async function getAuthResponse(): Promise<string> {
    let params = (new URL(window.location.toString())).searchParams
    try {
        const response = await axios.post("http://e2r10p2:3000/auth/" + params.get('code'))
        return response.data.session
    } catch {
        throw ("Error while registering session")
    }
}

export async function getUserData(login: string): Promise<userDataIn> {
    try {
        const response = await axios.get("http://e2r10p2:3000/profile/" + login, {
            withCredentials: true,
        })
        return response.data
    } catch {
       throw ("Error while getting profile data")
    }
}
