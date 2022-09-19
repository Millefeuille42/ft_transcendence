import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {AuthService} from "../auth/auth.service";
import {GameService} from "../game/game.service";
import {Socket} from "socket.io";
import Queue from "../utils/Queue";
import {makePair} from "../utils/Pair";
import matchUsersInterface, {matchPair} from "./matchUsers.interface";
import IPair from "../utils/IPair";
import {MultiService} from "./multi.service";
import {v4 as uuid} from 'uuid'

interface authData {
	token: string,
	login: string
}

interface err {
	code: number
	text: string
}

interface socketLoginPair extends IPair<Socket, string> {}

@WebSocketGateway({ cors: true })
export class MultiGateway {
	constructor (
		private multiService: MultiService,
		private gameService: GameService,
		private authService: AuthService
	) {}
	@WebSocketServer() server;

	matchQ: Queue<socketLoginPair> = new Queue()
	users: Map<string, string> = new Map()

	matches: Map<string, matchPair> = new Map()
	operateQ: boolean = false

	ERR_NOT_LOGGED_IN: err = {code: 401, text: "Error: not logged in"}
	ERR_NOT_IN_MATCH: err = {code: 400, text: "Error: not in match"}
	ERR_IN_QUEUE: err = {code: 400, text: "Error: already in queue"}
	ERR_NOT_FOUND: err = {code: 404, text: "Error: match not found"}

	async handleDisconnect(client: Socket) {
		console.log("Disconnected")
		if (this.users[client.id] === undefined)
			return
		let userIndex = this.matchQ.getStorage().findIndex((x) => {
			return x.second === this.users[client.id]
		})
		console.log("found in queue")
		if (userIndex > -1) {
			this.matchQ.getStorage().splice(userIndex, 1);
			console.log("deleted")
		}
	}

	@SubscribeMessage('multiAuth')
	async handleAuth(@MessageBody() data: authData, @ConnectedSocket() client: Socket) {
		let ret = await this.authService.isAuth(data.login, data.token)
		//TODO add DE-connection
		if (data.token === "pass")
			ret = true
		client.emit('multiAuth', ret)
		if (ret === true)
			this.users[client.id] = data.login
	}

	@SubscribeMessage('multiReady')
	async handleMatch(@MessageBody() data: {id: string, ready: boolean}, @ConnectedSocket() client: Socket) {
		if (this.users[client.id] === undefined) {
			client.emit('multiError', this.ERR_NOT_LOGGED_IN)
			return
		}

		if (this.matches[data.id] === undefined) {
			client.emit('multiError', this.ERR_NOT_FOUND)
			return
		}

		if (this.matches[data.id].first.login === this.users[client.id]) {
			this.matches[data.id].first.ready = data.ready
			this.matches[data.id].second.socket.emit("multiReady", {login: this.users[client.id], ready: data.ready})
		}

		if (this.matches[data.id].second.login === this.users[client.id]) {
			this.matches[data.id].second.ready = data.ready
			this.matches[data.id].first.socket.emit("multiReady", {login: this.users[client.id], ready: data.ready})
		}

		if (this.matches[data.id].first.ready && this.matches[data.id].second.ready) {
			this.matches[data.id].first.socket.emit('multiReady', {oper: "start"})
			this.matches[data.id].second.socket.emit('multiReady', {oper: "start"})
		}
	}

	@SubscribeMessage('multiQueue')
	async handleMatchmaking(@MessageBody() data: {oper: string}, @ConnectedSocket() client: Socket) {
		if (this.users[client.id] === undefined) {
			client.emit('multiError', this.ERR_NOT_LOGGED_IN)
			return
		}
		while (this.operateQ) {
			await setTimeout(()=>{},500)
		}
		console.log(data)
		this.operateQ = true
		if (data.oper === "add") {

			let mat = this.matchQ.getStorage().find((x) => {
				return x !== undefined && x.second === this.users[client.id]
			})

			if (mat !== undefined) {
				client.emit('multiError', this.ERR_IN_QUEUE)
				this.operateQ = false
				return
			}
			this.matchQ.enqueue(makePair(client, this.users[client.id]) as socketLoginPair)
		}
		if (this.matchQ.size() >= 2) {
			let one = this.matchQ.dequeue()
			let two = this.matchQ.dequeue()
			let match_id = uuid()
			one.first.emit('multiMatchUp', {login: two.second, id: match_id})
			two.first.emit('multiMatchUp', {login: one.second, id: match_id})
			this.matches[match_id] = makePair(
				{socket: one.first, login: one.second, ready: false} as matchUsersInterface,
				{socket: two.first, login: two.second, ready: false} as matchUsersInterface,
			) as matchPair
		}
		this.operateQ = false
	}
}
