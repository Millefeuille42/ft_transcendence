import Rod from "../classes/localGameClasses/Rod";
import Ball from "../classes/localGameClasses/Ball";
import P5 from "p5";
import IScreen from "../interfaces/IScreen";
import net from "../net";

let playerOne: Rod
let playerTwo: Rod
let oneScore: number = 0
let twoScore: number = 0

let ball: Ball

let goalLastTick: boolean
let sleeping: boolean
let end: boolean

let rod_image: P5.Image
let rod_image2: P5.Image
let ball_image: P5.Image

function displayGetReady(p5: P5) {
	p5.textSize(p5.width / 25)
	p5.text("Get Ready!", 0, p5.height / 4, p5.width)
}

function displayWinner(player: string, p5: P5) {
	p5.textSize(p5.width / 25)
	p5.text(player + " Won!", 0, p5.height / 4, p5.width)
}

function drawScene(p5: P5) {
	p5.background(net.white ? "black" : "white")

	playerOne.draw(p5)
	playerTwo.draw(p5)
	if (!goalLastTick)
		ball.draw(p5)

	p5.textSize(p5.width / 18)
	p5.text(oneScore, p5.width / 4, p5.height / 7)
	p5.text(twoScore, (p5.width / 4) * 3, p5.height / 7)
}

class LocalGame implements IScreen {
	screenPreload(p5: P5) {
		ball_image = p5.loadImage("/balls/ball_bob.png")
		rod_image = p5.loadImage("/rods/rod_github.png")
		rod_image2 = p5.loadImage("/rods/rod_millefeuille.png")
	}

	screenSetup(p5: P5) {
		playerOne = new Rod(p5, true)
		playerTwo = new Rod(p5, false)
		ball = new Ball(p5, p5.random(-1, 1) > 0)

		goalLastTick = true
		sleeping = false
		end = false
		p5.fill(net.white ? "white" : "black")
		p5.textAlign("center")
		displayGetReady(p5)
	}

	screenLoop(p5: P5): boolean {
		if (end)
			return true

		if (oneScore >= 5 || twoScore >= 5) {
			if (oneScore > twoScore) {
				displayWinner("Player one", p5)
			} else {
				displayWinner("Player two", p5)
			}
			if (sleeping)
				return false
			sleeping = true
			setTimeout(() => {
				oneScore = 0
				twoScore = 0
				sleeping = false
				end = true
			}, 5000)
			return false
		}

		if (goalLastTick) {
			drawScene(p5)
			displayGetReady(p5)
			if (sleeping)
				return false
			sleeping = true
			displayGetReady(p5)
			setTimeout(() => {
				sleeping = false
				goalLastTick = false
			}, 1000)
			return false
		}

		playerOne.update(p5)
		playerTwo.update(p5)
		let goal = ball.update(p5, playerOne, playerTwo)
		drawScene(p5)
		if (goal) {
			if (ball.direction.x > 0) {
				oneScore++
				ball = new Ball(p5, true)
			} else {
				twoScore++
				ball = new Ball(p5, false)
			}
			goalLastTick = true
			drawScene(p5)
		}
		return false
	}

	loadScreen(p5: P5) {
		this.screenPreload(p5)
		this.screenSetup(p5)
	}

	setKeyPressed(p5: P5) {
		if (p5.key === "w" || p5.key == "z") {
			if (net.white)
				playerOne.goUp = true
			else
				playerOne.goDown = true
		} else if (p5.key === "s") {
			if (net.white)
				playerOne.goDown = true
			else
				playerOne.goUp = true
		} else if (p5.key === "ArrowUp") {
			if (net.white)
				playerTwo.goUp = true
			else
				playerTwo.goDown = true
		} else if (p5.key === "ArrowDown") {
			if (net.white)
				playerTwo.goDown = true
			else
				playerTwo.goUp = true
		}
	}

	setKeyReleased(p5: P5) {
		if (p5.key === "w" || p5.key == "z") {
			if (net.white)
				playerOne.goUp = false
			else
				playerOne.goDown = false
		} else if (p5.key === "s") {
			if (net.white)
				playerOne.goDown = false
			else
				playerOne.goUp = false
		} else if (p5.key === "ArrowUp") {
			if (net.white)
				playerTwo.goUp = false
			else
				playerTwo.goDown = false
		} else if (p5.key === "ArrowDown") {
			if (net.white)
				playerTwo.goDown = false
			else
				playerTwo.goUp = false
		}
	}
}

export default LocalGame
