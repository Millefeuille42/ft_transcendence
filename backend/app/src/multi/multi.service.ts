import { Injectable } from '@nestjs/common';
import matchUsersInterface, {Ball, matchPair} from "./matchUsers.interface";
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

	collideBall(ball: Ball, width: number, height: number): Ball {
		// Left Right walls, do not collide but return goal
		if (ball.position.x - ball.size.x <= 0 || ball.position.x + ball.size.x >= width) {
			ball.direction.x *= -1
			//return true
		}

		// Top Down walls, invert y direction
		if (ball.position.y - ball.size.y <= 0 || ball.position.y + ball.size.y >= height) {
			ball.direction.y *= -1
		}
		return ball
	}

	createBall(player: matchUsersInterface, x: number, y: number): matchUsersInterface {
		player.ball = {
			speed: {
				x: player.width * 0.01,
				y: player.height * 0.01,
			},
			size: {
				x: player.width * 0.015,
				y: player.height * 0.015,
			},
			position: {
				x:player.width / 2,
				y:player.height / 2
			},
			direction: {
				x: x,
				y: y
			}
		}
		return player
	}

	createRod(player: matchUsersInterface, left: boolean): matchUsersInterface {
		let rx = player.width * 0.99 - player.width * 0.017
		let lx = player.width * 0.01
		player.rod = {
			width: player.width * 0.017,
			height: player.height * 0.15,
			speed: player.height * 0.02,
			goUp: false,
			goDown: false,
			position: {
				x: left ? lx : rx,
				y: player.height / 2 - (player.height * 0.15 / 2),
			},
		}
		player.opponentRod = {
			width: player.width * 0.017,
			height: player.height * 0.15,
			speed: player.height * 0.02,
			goUp: false,
			goDown: false,
			position: {
				x: left ? rx : lx,
				y: player.height / 2 - (player.height * 0.15 / 2),
			},
		}
		return player
	}

	moveRod(player: matchUsersInterface): matchUsersInterface {
		if (player.rod.goUp) {
			if (player.rod.position.y - player.rod.speed > 0)
				player.rod.position.y -= player.rod.speed
			else
				player.rod.position.y = 0
		}
		if (player.rod.goDown) {
			if (player.rod.position.y + player.rod.speed < player.height - player.rod.height)
				player.rod.position.y += player.rod.speed
			else
				player.rod.position.y = player.height - player.rod.height
		}
		if (player.opponentRod.goUp) {
			if (player.opponentRod.position.y - player.opponentRod.speed > 0)
				player.opponentRod.position.y -= player.opponentRod.speed
			else
				player.opponentRod.position.y = 0
		}
		if (player.opponentRod.goDown) {
			if (player.opponentRod.position.y + player.opponentRod.speed < player.height - player.opponentRod.height)
				player.opponentRod.position.y += player.opponentRod.speed
			else
				player.opponentRod.position.y = player.height - player.opponentRod.height
		}
		return player
	}
}
