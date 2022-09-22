import {io, Socket} from "socket.io-client";
import myVector from "./classes/genericClasses/MyVector";

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
	white: boolean
	match: {
		login: string
		id: string
	}
	ball: myVector
	myRod: myVector
	otherRod: myVector
	screen: string
	score: {left: number, right: number}
}

let net: connection = {
	socket: io(process.env.NODE_ENV_BACK_URL),
	hasError: false,
	auth: false,
	white: true,
	opponentReady: false,
	userReady: false,
	hasMatchUp: false,
	matchStart: false,
	ask: true,
	userLogin: "",
	userToken: "",
	ball: new myVector,
	myRod: new myVector,
	otherRod: new myVector,
	match: {login: "", id: ""},
	score: {left: 0, right: 0},
	screen: ""
}

net.socket.on('connect', () => {
	console.log("Connected")
	let u = new URL(window.location.toString())
	console.log(u.searchParams.get("login"), u.searchParams.get("token"))
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
	let u = new URL(window.location.toString())
	console.log(u.searchParams.get("login"), u.searchParams.get("token"))
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

net.socket.on('multiUpdate', (data: {ball: myVector, myRod: myVector, otherRod: myVector, score: {left: number, right: number}, screen: string}) => {
	net.ball = data.ball
	net.myRod = data.myRod
	net.otherRod = data.otherRod
	net.score = data.score
	net.screen = data.screen
})

net.socket.on('multiStop', () => {
	console.log("stop")
	net.ask = false
})

net.socket.on('multiError', (data: {code: number, text: string}) => {
	console.log("ERROR")
	if (data.code === 442) {
		console.log("LEFT")
		window.location.reload()
	}
})

export const getOnlineText = () => {
	return net.socket.connected ? "ONLINE" : "OFFLINE"
}

export default net
