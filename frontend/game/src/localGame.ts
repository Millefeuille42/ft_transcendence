import Rod from "./Rod";
import {ballClass} from "./ball";
import P5 from "p5";

let c_width = 200
let c_height = 200

let playerOne: Rod
let playerTwo: Rod
let oneScore: number = 0
let twoScore: number = 0

let ball: ballClass

let goalLastTick: boolean
let sleeping: boolean
let end: boolean

let rod_image: P5.Image
let rod_image2: P5.Image
let ball_image: P5.Image

function autoResize(p5: P5) {
	let parent = document.getElementById("app")
	if (parent !== null) {
		if (c_width !== parent.clientWidth && c_height !== parent.clientHeight) {
			// TODO put player and ball to new position

			c_width = parent.clientWidth
			c_height = parent.clientHeight
			p5.resizeCanvas(c_width, c_height, true)
		}
	}
}

function displayGetReady(p5: P5) {
	p5.textSize(p5.width / 25)
	p5.text("Get Ready!", 0, p5.height / 4, p5.width)
}

function displayWinner(player: string, p5: P5) {
	p5.textSize(p5.width / 25)
	p5.text(player + " Won!", 0, p5.height / 4, p5.width)
}

function drawScene(p5: P5) {
	p5.background("black")

	playerOne.draw(p5)
	playerTwo.draw(p5)
	if (!goalLastTick)
		ball.draw(p5)

	p5.textSize(p5.width / 18)
	p5.text(oneScore, p5.width / 4, p5.height / 7)
	p5.text(twoScore, (p5.width / 4) * 3, p5.height / 7)
}

export class LocalGame {
	gamePreload(p5: P5) {
		ball_image = p5.loadImage("/balls/ball_bob.png")
		rod_image = p5.loadImage("/rods/rod_github.png")
		rod_image2 = p5.loadImage("/rods/rod_millefeuille.png")
	}

	private gameSetup(p5: P5) {
		playerOne = new Rod(p5, true)
		playerTwo = new Rod(p5, false)
		ball = new ballClass(p5.width / 2, p5.height / 2, p5.width * 0.007, p5.width * 0.007, p5, ball_image)

		goalLastTick = true
		sleeping = false
		end = false
		p5.fill("white")
		p5.textAlign("center")
		displayGetReady(p5)
	}

	gameLoop(p5: P5): boolean {
		if (end)
			return true

		autoResize(p5)

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

		let goal = ball.move(playerOne, playerTwo, p5)
		drawScene(p5)
		if (goal) {
			if (ball.direction.x > 0) {
				twoScore++
				ball = new ballClass(p5.width / 2, p5.height / 2, p5.width * 0.007, p5.width * 0.007, p5, ball_image)
				if (ball.direction.x < 0) {
					ball.direction.x *= -1
				}
			} else {
				oneScore++
				ball = new ballClass(p5.width / 2, p5.height / 2, p5.width * 0.007, p5.width * 0.007, p5, ball_image)
				if (ball.direction.x > 0) {
					ball.direction.x *= -1
				}
			}
			goalLastTick = true
			drawScene(p5)
		}
		return false
	}

	loadGame(p5: P5) {
		this.gamePreload(p5)
		this.gameSetup(p5)
	}

	setKeyPressed(p5: P5) {
		if (p5.key === "w") {
			playerOne.goUp = true
		} else if (p5.key === "s") {
			playerOne.goDown = true
		} else if (p5.key === "ArrowUp") {
			playerTwo.goUp = true
		} else if (p5.key === "ArrowDown") {
			playerTwo.goDown = true
		}
	}

	setKeyReleased(p5: P5) {
		if (p5.key === "w") {
			playerOne.goUp = false
		} else if (p5.key === "s") {
			playerOne.goDown = false
		} else if (p5.key === "ArrowUp") {
			playerTwo.goUp = false
		} else if (p5.key === "ArrowDown") {
			playerTwo.goDown = false
		}
	}
}
