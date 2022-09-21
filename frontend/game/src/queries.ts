import axios from "axios";
import {getCookies} from "typescript-cookie";
import net from "./net";

export interface userDataIn {
	login: string,
	username: string,
	banner: string,
	avatar: string,
	status: string
	fa: boolean
}

export interface inventoryItem {
	id: number,
	rarity: number,
	category: string,
	name: string,
	description: string,
}

export interface equippedData {
	rod: inventoryItem,
	ball: inventoryItem,
	sound: inventoryItem
}

export interface gameUserData {
	data: userDataIn
	assets: equippedData
}

export async function getUserData(login: string): Promise<userDataIn> {
	return axios.get(process.env.NODE_ENV_BACK_URL + "/user/" + login + "/profile", {
			withCredentials: true,
		})
		.then((response) => {
			return response.data
		})
		.catch ((e) => {
			throw e
		})
}

export async function getEquipped(login: string): Promise<equippedData> {
	let target:string = process.env.NODE_ENV_BACK_URL + "/items/equipped/"
	target += login

	return await axios({
		method: 'get',
		url: target,
		withCredentials: true,
	}).then((response) => {
		return response.data
	}).catch((e) => {
		throw e
	})
}
