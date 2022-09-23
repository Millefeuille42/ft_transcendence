import { Injectable } from '@nestjs/common';
import {Ball, matchData, matchPair, Rod} from "./matchUsers.interface";
import Queue from "../utils/Queue";
import {Socket} from "socket.io";
import IPair from "../utils/IPair";
import {makePair} from "../utils/Pair";

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

	collideWithRod(ball: Ball, rod: Rod): Ball {
		let x = ball.position.x + (ball.size.x / (rod.left ? -2 : 2))

		if (
			x > rod.position.x &&
			x < rod.position.x + rod.width &&
			ball.position.y > rod.position.y &&
			ball.position.y < rod.position.y + rod.height
		) {
			ball.direction.x = Math.abs(ball.direction.x) * (rod.left ? 1 : -1);
			ball.direction.y = ((ball.position.y - rod.position.y) / rod.height) - 0.5;
		}
		return ball
	}

	collideBall(match: matchData): Ball {
		// Left Right walls, do not collide but return goal
		if (match.ball.position.x <= 0) {
			match.ball.goal = true
			match.ball.score.second++
		}

		if (match.ball.position.x + match.ball.size.x >= match.width) {
			match.ball.goal = true
			match.ball.score.first++
		}

		// Top Down walls, invert y direction
		if (match.ball.position.y - match.ball.size.y <= 0 || match.ball.position.y + match.ball.size.y >= match.height) {
			match.ball.direction.y *= -1
		}

		match.ball = this.collideWithRod(match.ball, match.rodOne)
		match.ball = this.collideWithRod(match.ball, match.rodTwo)
		return match.ball
	}

	createBall(match: matchData, x: number, y: number): matchData {
		match.ball = {
			score: makePair(0, 0),
			speed: {
				x: match.width * 0.006,
				y: match.height * 0.006,
			},
			size: { // TODO transmit size to client
				x: match.width * 0.015,
				y: match.height * 0.015,
			},
			position: {
				x: match.width / 2,
				y: match.height / 2
			},
			direction: {
				x: x,
				y: y
			},
			goal: false
		}
		return match
	}

	createRods(match: matchData): matchData {
		match.rodOne = {
			width: match.width * 0.017,
			height: match.height * 0.15,
			speed: match.height * 0.02,
			goUp: false,
			goDown: false,
			position: {
				x: match.width * 0.01,
				y: match.height / 2 - (match.height * 0.15 / 2),
			},
			left: true,
			login: match.first.login
		}
		match.rodTwo = {
			width: match.width * 0.017,
			height: match.height * 0.15,
			speed: match.height * 0.02,
			goUp: false,
			goDown: false,
			position: {
				x: match.width * 0.99 - match.width * 0.017,
				y: match.height / 2 - (match.height * 0.15 / 2),
			},
			left: false,
			login: match.second.login
		}
		return match
	}

	moveRod(match: matchData): matchData {
		if (match.rodOne.goUp) {
			if (match.rodOne.position.y - match.rodOne.speed > 0)
				match.rodOne.position.y -= match.rodOne.speed
			else
				match.rodOne.position.y = 0
		}
		if (match.rodOne.goDown) {
			if (match.rodOne.position.y + match.rodOne.speed < match.height - match.rodOne.height)
				match.rodOne.position.y += match.rodOne.speed
			else
				match.rodOne.position.y = match.height - match.rodOne.height
		}
		if (match.rodTwo.goUp) {
			if (match.rodTwo.position.y - match.rodTwo.speed > 0)
				match.rodTwo.position.y -= match.rodTwo.speed
			else
				match.rodTwo.position.y = 0
		}
		if (match.rodTwo.goDown) {
			if (match.rodTwo.position.y + match.rodTwo.speed < match.height - match.rodTwo.height)
				match.rodTwo.position.y += match.rodTwo.speed
			else
				match.rodTwo.position.y = match.height - match.rodTwo.height
		}
		return match
	}
}
