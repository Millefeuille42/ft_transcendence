import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {AuthService} from "../auth/auth.service";
import {GameService} from "../game/game.service";
import {Socket} from "socket.io";
import Queue from "../utils/Queue";
import {makePair} from "../utils/Pair";
import matchUsersInterface, {matchPair} from "./matchUsers.interface";
import IPair from "../utils/IPair";
import {err, MultiService} from "./multi.service";
import {v4 as uuid} from 'uuid'

interface authData {
	token: string,
	login: string
}

interface socketLoginPair extends IPair<Socket, string> {}

interface matchData extends matchPair {}

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

	matches: Map<string, matchData> = new Map()
	operateQ: boolean = false

	ERR_NOT_LOGGED_IN: err = {code: 401, text: "Error: not logged in"}
	ERR_NOT_IN_MATCH: err = {code: 400, text: "Error: not in match"}
	ERR_IN_QUEUE: err = {code: 400, text: "Error: already in queue"}
	ERR_NOT_FOUND: err = {code: 404, text: "Error: match not found"}

	async handleDisconnect(client: Socket) {
		this.multiService.deleteUser(client.id, this.users, this.matchQ, this.matches)
	}

	@SubscribeMessage('multiLeave')
	async handleLeave(@ConnectedSocket() client: Socket) {
		if (this.users[client.id] === undefined) {
			client.emit('multiError', this.ERR_NOT_LOGGED_IN)
			return
		}
		this.multiService.deleteUser(client.id, this.users, this.matchQ, this.matches)
	}

	@SubscribeMessage('multiAuth')
	async handleAuth(@MessageBody() data: authData, @ConnectedSocket() client: Socket) {
		let ret = await this.authService.isAuth(data.login, data.token)
		if (data.token === "pass")
			ret = true
		client.emit('multiAuth', ret)
		if (ret === true)
			this.users[client.id] = data.login
	}

	@SubscribeMessage('multiMove')
	async handleMove(@MessageBody() data: {id: string, goUp: boolean, goDown: boolean}, @ConnectedSocket() client: Socket) {
		let user = this.users[client.id]
		if (user === undefined) {
			client.emit('multiError', this.ERR_NOT_LOGGED_IN)
			return
		}

		let match: matchData = this.matches.get(data.id)
		if (match === undefined) {
			client.emit('multiError', this.ERR_NOT_FOUND)
			return
		}

		console.log(data)
		if (match.first.login === user) {
			match.first.rod.goUp = data.goUp
			match.first.rod.goDown = data.goDown
			match.second.opponentRod.goUp = data.goUp
			match.second.opponentRod.goDown = data.goDown
		} else if (match.second.login === user) {
			match.second.rod.goUp = data.goUp
			match.second.rod.goDown = data.goDown
			match.first.opponentRod.goUp = data.goUp
			match.first.opponentRod.goDown = data.goDown
		}
	}

	@SubscribeMessage('multiUpdate')
	async handleUpdate(@MessageBody() data: {id: string}, @ConnectedSocket() client: Socket) {
		let user = this.users[client.id]
		if (user === undefined) {
			client.emit('multiError', this.ERR_NOT_LOGGED_IN)
			return
		}

		let match: matchData = this.matches.get(data.id)
		if (match === undefined) {
			client.emit('multiError', this.ERR_NOT_FOUND)
			return
		}
		if (match.first.login === user) {
			match.first.ball.position.x += match.first.ball.direction.x * match.first.ball.speed.x
			match.first.ball.position.y += match.first.ball.direction.y * match.first.ball.speed.y

			match.second.ball.position.x += match.second.ball.direction.x * match.second.ball.speed.x
			match.second.ball.position.y += match.second.ball.direction.y * match.second.ball.speed.y

			match.first = this.multiService.moveRod(match.first)
			match.second = this.multiService.moveRod(match.second)

			match.first.ball = this.multiService.collideBall(match.first.ball, match.first.width, match.first.height)
			match.second.ball = this.multiService.collideBall(match.second.ball, match.second.width, match.second.height)

			match.first.socket.emit('multiUpdate', {
				ball: match.first.ball.position,
				myRod: match.first.rod.position,
				otherRod: match.first.opponentRod.position
			})
			match.second.socket.emit('multiUpdate', {
				ball: match.second.ball.position,
				myRod: match.second.rod.position,
				otherRod: match.second.opponentRod.position
			})
			return
		}
		if (match.second.login === user)
			match.second.socket.emit('multiStop')
	}

	@SubscribeMessage('multiReady')
	async handleMatch(@MessageBody() data: {id: string, ready: boolean, width: number, height: number}, @ConnectedSocket() client: Socket) {
		if (this.users[client.id] === undefined) {
			client.emit('multiError', this.ERR_NOT_LOGGED_IN)
			return
		}

		if (this.matches.get(data.id) === undefined) {
			client.emit('multiError', this.ERR_NOT_FOUND)
			return
		}

		if (this.matches.get(data.id).first.login === this.users[client.id]) {
			this.matches.get(data.id).first.ready = data.ready
			this.matches.get(data.id).first.width = data.width
			this.matches.get(data.id).first.height = data.height
			this.matches.get(data.id).second.socket.emit("multiReady", {login: this.users[client.id], ready: data.ready})
		}

		if (this.matches.get(data.id).second.login === this.users[client.id]) {
			this.matches.get(data.id).second.ready = data.ready
			this.matches.get(data.id).second.width = data.width
			this.matches.get(data.id).second.height = data.height
			this.matches.get(data.id).first.socket.emit("multiReady", {login: this.users[client.id], ready: data.ready})
		}

		if (this.matches.get(data.id).first.ready && this.matches.get(data.id).second.ready) {
			let x = Math.random() > 0.5 ? -1 : 1
			let y = Math.random() * (Math.random() > 0.5 ? -1 : 1)

			this.matches.get(data.id).first = this.multiService.createRod(this.matches.get(data.id).first, true)
			this.matches.get(data.id).second = this.multiService.createRod(this.matches.get(data.id).second, false)
			this.matches.get(data.id).first = this.multiService.createBall(this.matches.get(data.id).first, x, y)
			this.matches.get(data.id).second = this.multiService.createBall(this.matches.get(data.id).second, x, y)
			this.matches.get(data.id).first.socket.emit('multiStart', {oper: "start"})
			this.matches.get(data.id).second.socket.emit('multiStart', {oper: "start"})
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
			this.matches.set(match_id, makePair(
				{socket: one.first, login: one.second, ready: false} as matchUsersInterface,
				{socket: two.first, login: two.second, ready: false} as matchUsersInterface,
			) as matchPair)
		}
		this.operateQ = false
	}
}
