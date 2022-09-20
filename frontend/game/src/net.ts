import {io, Socket} from "socket.io-client";
import matchmaking from "./games/Addons/Matchmaking";

interface connection {
	socket: Socket
	hasError: boolean
	userLogin: string
	userToken: string

	auth: boolean
	hasMatchUp: boolean

	opponentReady: boolean
	userReady: boolean
	match: {
		login: string
		id: string
	}
}

let net: connection = {
	socket: io("http://e1r12p3:3000"), // TODO Set to env
	hasError: false,
	auth: false,
	opponentReady: false,
	userReady: false,
	hasMatchUp: false,
	userLogin: "",
	userToken: "",
	match: {login: "", id: ""}
}

net.socket.on('connect', () => {
	console.log("Connected")
	net.hasError = false
})

net.socket.on('disconnect', () => {
	console.log("Disconnected")
})

net.socket.on('connect_error', () => {
	console.log("Error while establishing connection")
})

net.socket.on('multiAuth', (valid: boolean) => {
	console.log("AUTH")
	net.auth = valid
})

net.socket.on('multiMatchUp', (data: {login: string, id: string}) => {
	console.log("MATCHUP")
	net.hasMatchUp = true
	net.match = data
})

net.socket.on('multiReady', (data: {login: string, ready: boolean}) => {
	console.log("READY")
	if (data.login === net.match.login)
		net.opponentReady = data.ready
})

net.socket.on('multiError', (data: {code: number, text: string}) => {
	if (data.code === 442) {
		console.log("ERROR")
		net.hasMatchUp = false
		net.auth = false
		net.opponentReady = false
		net.userReady = false
		net.hasError = true
	}
})

export const getOnlineText = () => {
	return net.socket.connected ? "ONLINE" : "OFFLINE"
}

export default net
