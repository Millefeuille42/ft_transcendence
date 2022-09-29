import {Socket} from "socket.io";
import IPair from "../utils/IPair";
import Pair from "../utils/Pair";

export interface Ball {
	size: {x: number, y: number}
	speed: {x: number, y: number}
	position: {x: number, y: number}
	direction:{x: number, y: number}
	score: Pair<number, number>
	goal: boolean
}

export interface Rod {
	width: number
	height: number
	speed: number
	position: {x: number, y: number}
	goUp: boolean
	goDown: boolean
	left: boolean
	login: string
}

interface matchUsersInterface {
	socket: Socket
	login: string
	ready: boolean
	width: number
	height: number
}

export interface matchData extends matchPair {
	ball: Ball
	rodOne: Rod
	rodTwo: Rod
	wait: boolean
	width: number
	height: number
	screen: string
	stop: boolean
	started: boolean
}

export interface matchPair extends IPair<matchUsersInterface, matchUsersInterface> {
}

export default matchUsersInterface
