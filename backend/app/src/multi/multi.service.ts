import { Injectable } from '@nestjs/common';
import {matchPair} from "./matchUsers.interface";
import Queue from "../utils/Queue";
import {Socket} from "socket.io";
import IPair from "../utils/IPair";

export interface socketLoginPair extends IPair<Socket, string> {}

export interface err {
	code: number
	text: string
}

@Injectable()
export class MultiService {
	ERR_OPPONENT: err = {code: 442, text: "Error: opponent left"}

	removeFromQueue(login: string, Q: Queue<socketLoginPair>) {
		let userIndex = Q.getStorage().findIndex((x) => {
			return x.second === login
		})
		if (userIndex > -1) {
			Q.getStorage().splice(userIndex, 1);
		}
	}

	deleteMatch(login: string, matches: Map<string, matchPair>): string {
		let other: string
		let key: string
		matches.forEach((val, k) => {
			console.log(val.first.login, val.second.login)
			if (val.first.login === login) {
				val.second.socket.emit("multiError", this.ERR_OPPONENT)
				other = val.second.socket.id
				key = k
			}
			if (val.second.login === login) {
				val.first.socket.emit("multiError", this.ERR_OPPONENT)
				other = val.first.socket.id
				key = k
			}
		})
		matches.delete(key)
		return other
	}

	deleteUser(id: string, users: Map<string, string>, Q: Queue<socketLoginPair>, matches: Map<string, matchPair>) {
		let other = this.deleteMatch(users[id], matches)
		this.removeFromQueue(users[id], Q)
		this.removeFromQueue(users[other], Q)
		users.delete(id)
		users.delete(other)
	}
}
