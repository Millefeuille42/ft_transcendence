import IScreen from "../interfaces/IScreen";
import P5 from "p5";
import Rod from "../classes/multiGameClasses/Rod";
import Ball from "../classes/multiGameClasses/Ball";
import {gameUserData} from "../queries";
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
let ball_image2: P5.Image

function displayGetReady(p5: P5) {
	p5.textSize(p5.width / 25)
	p5.text("Get Ready!", 0, p5.height / 4, p5.width)
}

function displayWinner(player: string, p5: P5) {
	p5.textSize(p5.width / 25)
	p5.text(player + " Won!", 0, p5.height / 4, p5.width)
}

function drawScene(p5: P5) {
	if (!goalLastTick)
		ball.draw(p5)

	p5.textSize(p5.width / 18)
	p5.text(oneScore, p5.width / 4, p5.height / 7)
	p5.text(twoScore, (p5.width / 4) * 3, p5.height / 7)
}


class MultiGame implements IScreen {

	constructor(private me: gameUserData, private opponent: gameUserData) {}

	screenPreload(p5: P5) {
		ball_image = p5.loadImage(this.me.assets.ball.description)
		ball_image2 = p5.loadImage(this.opponent.assets.ball.description)
		rod_image = p5.loadImage(this.me.assets.rod.description)
		rod_image2 = p5.loadImage(this.opponent.assets.rod.description)
	}

	screenSetup(p5: P5) {
		playerOne = new Rod(rod_image)
		playerTwo = new Rod(rod_image2)
		ball = new Ball(p5, p5.random(-1, 1) > 0, ball_image)

		goalLastTick = true
		sleeping = false
		end = false
		p5.fill("white")
		p5.textAlign("center")
		displayGetReady(p5)
	}

	screenLoop(p5: P5): boolean {
		if (end) {
			return true
		}
		p5.background("black")
		ball.update(playerOne)
		ball.draw(p5)
		playerOne.draw(p5, net.myRod)
		playerTwo.draw(p5, net.otherRod)
		return false
	}

	loadScreen(p5: P5) {
		this.screenPreload(p5)
		this.screenSetup(p5)
	}

	setKeyPressed(p5: P5) {
		if (p5.key === "w" || p5.key == "z" || p5.key === "ArrowUp") {
			playerOne.goUp = true
		} else if (p5.key === "s" || p5.key === "ArrowDown") {
			playerOne.goDown = true
		}
	}

	setKeyReleased(p5: P5) {
		if (p5.key === "w" || p5.key == "z" || p5.key === "ArrowUp") {
			playerOne.goUp = false
		} else if (p5.key === "s" || p5.key === "ArrowDown") {
			playerOne.goDown = false
		}
	}
}

export default MultiGame
