import {io, Socket} from "socket.io-client";
import myVector from "./classes/genericClasses/MyVector";

export interface specMatch {
	one: string
	two: string
	id: string
}

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
	specMatches: specMatch[]
	started: boolean
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
	screen: "",
	specMatches: undefined,
	started: false
}

net.socket.on('connect', () => {
	let u = new URL(window.location.toString())
	net.hasError = false
})

net.socket.on('disconnect', () => {
})

net.socket.on('connect_error', () => {
})

net.socket.on('multiAuth', (valid: boolean) => {
	if (!valid)
		net.hasError = true
	net.auth = valid
})

net.socket.on('multiMatchUp', (data: {login: string, id: string}) => {
	net.hasMatchUp = true
	net.match = data
})

net.socket.on('multiReady', (data: {login: string, ready: boolean}) => {
	if (data.login === net.match.login)
		net.opponentReady = data.ready
})

net.socket.on('multiStart', () => {
	net.matchStart = true
})

net.socket.on('multiSpecList', (data: specMatch[]) => {
	net.specMatches = data
})

net.socket.on('multiUpdate', (data: {ball: myVector, myRod: myVector, otherRod: myVector, score: {left: number, right: number}, screen: string}) => {
	net.ball = data.ball
	net.myRod = data.myRod
	net.otherRod = data.otherRod
	net.score = data.score
	net.screen = data.screen
})

net.socket.on('multiSpec', (data: {started: boolean, ball: myVector, myRod: myVector, otherRod: myVector, score: {left: number, right: number}, screen: string}) => {
	net.started = data.started
	net.ball = data.ball
	net.myRod = data.myRod
	net.otherRod = data.otherRod
	net.score = data.score
	net.screen = data.screen
})

net.socket.on('multiStop', () => {
	net.ask = false
})

net.socket.on('multiError', (data: {code: number, text: string}) => {
	if (data.code === 442) {
		window.location.reload()
	} else if (data.code === 404) {
		window.location.reload()
	}
})

export const getOnlineText = () => {
	return net.socket.connected ? "ONLINE" : "OFFLINE"
}

export default net
