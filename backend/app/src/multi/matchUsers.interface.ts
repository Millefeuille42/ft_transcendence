import {Socket} from "socket.io";
import IPair from "../utils/IPair";

export interface Ball {
	size: {x: number, y: number}
	speed: {x: number, y: number}
	position: {x: number, y: number}
	direction:{x: number, y: number}
}

export interface Rod {
	width: number
	height: number
	speed: number
	position: {x: number, y: number}
	goUp: boolean
	goDown: boolean
}

interface matchUsersInterface {
	socket: Socket
	login: string
	ready: boolean
	width: number
	height: number
	rod: Rod
	ball: Ball
}

export interface matchPair extends IPair<matchUsersInterface, matchUsersInterface> {}

export default matchUsersInterface
