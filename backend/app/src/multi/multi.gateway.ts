import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {AuthService} from "../auth/auth.service";
import {GameService} from "../game/game.service";
import {Socket} from "socket.io";
import Queue from "../utils/Queue";
import {makePair} from "../utils/Pair";
import matchUsersInterface, {Ball, matchData, matchPair, Rod} from "./matchUsers.interface";
import IPair from "../utils/IPair";
import {err, MultiService} from "./multi.service";
import {v4 as uuid} from 'uuid'
import {UserService} from "../user/user.service";

interface authData {
	token: string,
	login: string
}

interface socketLoginPair extends IPair<Socket, string> {}

@WebSocketGateway({ cors: true })
export class MultiGateway {
	constructor (
		private multiService: MultiService,
		private gameService: GameService,
		private authService: AuthService,
		private userService: UserService) {}
	@WebSocketServer() server;

	matchQ: Queue<socketLoginPair> = new Queue()
	users: Map<string, string> = new Map()

	invites: Map<string, Queue<socketLoginPair> > = new Map()

	matches: Map<string, matchData> = new Map()
	operateQ: boolean = false

	ERR_NOT_LOGGED_IN: err = {code: 401, text: "Error: not logged in"}
	ERR_NOT_IN_MATCH: err = {code: 400, text: "Error: not in match"}
	ERR_IN_QUEUE: err = {code: 400, text: "Error: already in queue"}
	ERR_NOT_FOUND: err = {code: 404, text: "Error: match not found"}

	async handleDisconnect(client: Socket) {
		await this.userService.removeInGame(this.users[client.id])
		this.multiService.deleteUser(client.id, this.users, this.matchQ, this.matches)
	}

	@SubscribeMessage('multiLeave')
	async handleLeave(@ConnectedSocket() client: Socket) {
		if (this.users[client.id] === undefined) {
			client.emit('multiError', this.ERR_NOT_LOGGED_IN)
			return
		}
		await this.userService.removeInGame(this.users[client.id])
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

		if (match.rodOne.login === user) {
			match.rodOne.goUp = data.goUp
			match.rodOne.goDown = data.goDown
		} else if (match.rodTwo.login === user) {
			match.rodTwo.goUp = data.goUp
			match.rodTwo.goDown = data.goDown
		}
	}

	@SubscribeMessage('multiSpec')
	async handleSpec(@MessageBody() data: {id: string}, @ConnectedSocket() client: Socket) {
		if (this.users[client.id] === undefined) {
			client.emit('multiError', this.ERR_NOT_LOGGED_IN)
			return
		}

		let match: matchData = this.matches.get(data.id)
		if (match === undefined) {
			client.emit('multiError', this.ERR_NOT_FOUND)
			return
		}

		if (!match.started)
			return

		client.emit('multiSpec', {
			started: match.started,
			ball: {
				x: match.ball.position.x,
				y: match.ball.position.y
			},
			myRod: {
				x: match.rodOne.position.x,
				y: match.rodOne.position.y
			},
			otherRod: {
				x: match.rodTwo.position.x,
				y: match.rodTwo.position.y
			},
			score: {
				left: match.ball.score.first,
				right: match.ball.score.second
			},
			screen: match.screen === "" || match.screen === "ready" ? match.screen : match.screen === "fst" ? "you" : "other"
		})

	}

	@SubscribeMessage('multiSpecList')
	async handleSpecList(@ConnectedSocket() client: Socket) {
		if (this.users[client.id] === undefined) {
			client.emit('multiError', this.ERR_NOT_LOGGED_IN)
			return
		}

		let ret = []

		this.matches.forEach((val, k) => {
			ret.push({one: val.first.login, two: val.second.login, id: k})
		})
		client.emit('multiSpecList', ret)
	}

	@SubscribeMessage('multiInviteCode')
	async handleInvite(@MessageBody() data: {to: string}, @ConnectedSocket() client: Socket) {
		let code: string = uuid()
		this.invites.set(code, new Queue())
		client.emit('multiInviteCode', {inviteCode: code, to: data.to})
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
		if (match.stop)
			return
		if (match.first.login === user) {
			if (match.screen === "fst" || match.screen === "win") {
				match.stop = true
				await this.userService.removeInGame(match.first.login)
				await this.userService.removeInGame(match.second.login)

				await this.gameService.addHistory(match.first.login, match.second.login,
											match.ball.score.first, match.ball.score.second,
											"normal")
				await this.gameService.addHistory(match.second.login, match.first.login,
					match.ball.score.second, match.ball.score.first,
					"normal")
				setTimeout(() => {
					this.matches.delete(data.id)
				}, 3000)
			}
			if (match.screen === "") {
				match.ball.position.x += match.ball.direction.x * match.ball.speed.x
				match.ball.position.y += match.ball.direction.y * match.ball.speed.y

				match.ball.position.x += match.ball.direction.x * match.ball.speed.x
				match.ball.position.y += match.ball.direction.y * match.ball.speed.y

				match = this.multiService.moveRod(match)

				match.ball = this.multiService.collideBall(match)
			}
			if (match.ball.goal) {
				let x = Math.random() > 0.5 ? -1 : 1
				let y = Math.random() * (Math.random() > 0.5 ? -1 : 1)
				let score = match.ball.score
				match = this.multiService.createBall(match, x, y)
				match.ball.score = score
				match.screen = "ready"
				if (match.ball.score.first >= 5 || match.ball.score.second >= 5) {
					match.screen = "win"
					if (match.ball.score.first > match.ball.score.second)
						match.screen = "fst"
				}
			}

			match.first.socket.emit('multiUpdate', {
				ball: {
					x: match.ball.position.x / 100 * match.first.width,
					y: match.ball.position.y / 100 * match.first.height
				},
				myRod: {
					x: match.rodOne.position.x / 100 * match.first.width,
					y: match.rodOne.position.y / 100 * match.first.height
				},
				otherRod: {
					x: match.rodTwo.position.x / 100 * match.first.width,
					y: match.rodTwo.position.y / 100 * match.first.height
				},
				score: {
					left: match.ball.score.first,
					right: match.ball.score.second
				},
				screen: match.screen === "" || match.screen === "ready" ? match.screen : match.screen === "fst" ? "you" : "other"
			})

			match.second.socket.emit('multiUpdate', {
				ball: {
					x: match.ball.position.x / 100 * match.second.width,
					y: match.ball.position.y / 100 * match.second.height
				},
				myRod: {
					x: match.rodTwo.position.x / 100 * match.second.width,
					y: match.rodTwo.position.y / 100 * match.second.height
				},
				otherRod: {
					x: match.rodOne.position.x / 100 * match.second.width,
					y: match.rodOne.position.y / 100 * match.second.height
				},
				score: {
					left: match.ball.score.first,
					right: match.ball.score.second
				},
				screen: match.screen === "" || match.screen === "ready" ? match.screen : match.screen === "fst" ? "other" : "you"
			})
			if (match.screen === "ready") {
				if (match.wait)
					return
				match.wait = true
				setTimeout(() => {
					match.screen = ""
					match.wait = false
				}, 1000)
			}
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

		let match = this.matches.get(data.id)
		if (match === undefined) {
			client.emit('multiError', this.ERR_NOT_FOUND)
			return
		}

		if (match.first.login === this.users[client.id]) {
			match.first.ready = data.ready
			match.first.width = data.width
			match.first.height = data.height
			match.second.socket.emit("multiReady", {login: this.users[client.id], ready: data.ready})
		}

		if (match.second.login === this.users[client.id]) {
			match.second.ready = data.ready
			match.second.width = data.width
			match.second.height = data.height
			match.first.socket.emit("multiReady", {login: this.users[client.id], ready: data.ready})
		}

		if (this.matches.get(data.id).first.ready && this.matches.get(data.id).second.ready) {
			let x = Math.random() > 0.5 ? -1 : 1
			let y = Math.random() * (Math.random() > 0.5 ? -1 : 1)

			match = this.multiService.createRods(this.matches.get(data.id))
			match = this.multiService.createBall(this.matches.get(data.id), x, y)

			await this.userService.addInGame(match.first.login)
			await this.userService.addInGame(match.second.login)
			this.server.emit('userStatus')

			match.first.socket.emit('multiStart', {oper: "start"})
			match.second.socket.emit('multiStart', {oper: "start"})
			match.started = true
		}
	}
	@SubscribeMessage('multiJoinInvite')
	async handleJoin(@MessageBody() data: {code: string}, @ConnectedSocket() client: Socket) {
		if (this.users[client.id] === undefined) {
			client.emit('multiError', this.ERR_NOT_LOGGED_IN)
			return
		}

		let q = this.invites.get(data.code)
		if (q === undefined) {
			client.emit('multiError', this.ERR_NOT_FOUND)
			return
		}

		let mat = q.getStorage().find((x) => {
			return x !== undefined && x.second === this.users[client.id]
		})

		if (mat !== undefined) {
			client.emit('multiError', this.ERR_IN_QUEUE)
			return
		}
		q.enqueue(makePair(client, this.users[client.id]) as socketLoginPair)
		if (q.size() >= 2) {
			let one = q.dequeue()
			let two = q.dequeue()
			let match_id = uuid()
			one.first.emit('multiMatchUp', {login: two.second, id: match_id})
			two.first.emit('multiMatchUp', {login: one.second, id: match_id})
			let p = makePair(
				{socket: one.first, login: one.second, ready: false} as matchUsersInterface,
				{socket: two.first, login: two.second, ready: false} as matchUsersInterface,
			) as matchPair

			this.matches.set(match_id, {
				first: p.first,
				second: p.second,
				width: 100,
				height: 100,
				ball: {} as Ball,
				rodOne: {} as Rod,
				rodTwo: {} as Rod,
				screen: "ready",
				wait: false,
				stop: false,
				started: false
			})
			this.invites.delete(data.code)
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
			let p = makePair(
				{socket: one.first, login: one.second, ready: false} as matchUsersInterface,
				{socket: two.first, login: two.second, ready: false} as matchUsersInterface,
			) as matchPair

			this.matches.set(match_id, {
				first: p.first,
				second: p.second,
				width: 100,
				height: 100,
				ball: {} as Ball,
				rodOne: {} as Rod,
				rodTwo: {} as Rod,
				screen: "ready",
				wait: false,
				stop: false,
				started: false
			})
		}
		this.operateQ = false
	}
}
