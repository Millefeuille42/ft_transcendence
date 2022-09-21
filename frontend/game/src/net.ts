import {io, Socket} from "socket.io-client";
import matchmaking from "./games/Addons/Matchmaking";
import MultiGame from "./games/MultiGame";

interface connection {
	socket: Socket
	hasError: boolean
	userLogin: string
	userToken: string

	auth: boolean
	hasMatchUp: boolean

	opponentReady: boolean
	userReady: boolean
	matchStart: boolean,
	ask: boolean
	match: {
		login: string
		id: string
	}
	ball: {x: number, y: number}
}

let net: connection = {
	socket: io(process.env.NODE_ENV_BACK_URL),
	hasError: false,
	auth: false,
	opponentReady: false,
	userReady: false,
	hasMatchUp: false,
	matchStart: false,
	ask: true,
	userLogin: "",
	userToken: "",
	ball: {x: 0, y: 0},
	match: {login: "", id: ""},
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

net.socket.on('multiStart', () => {
	console.log("Start")
	net.matchStart = true
})

net.socket.on('multiUpdate', (data: {x: number, y: number}) => {
	console.log("update")
	net.ball = data
})

net.socket.on('multiStop', () => {
	console.log("stop")
	net.ask = false
})

net.socket.on('multiError', (data: {code: number, text: string}) => {
	if (data.code === 442) {
		console.log("ERROR")
		window.location.reload()
	}
})

export const getOnlineText = () => {
	return net.socket.connected ? "ONLINE" : "OFFLINE"
}

export default net
