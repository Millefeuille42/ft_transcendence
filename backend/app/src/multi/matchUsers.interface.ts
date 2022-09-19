import {Socket} from "socket.io";
import IPair from "../utils/IPair";

interface matchUsersInterface {
	socket: Socket
	login: string
	ready: boolean
}

export interface matchPair extends IPair<matchUsersInterface, matchUsersInterface> {}

export default matchUsersInterface
