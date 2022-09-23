import IScreen from "../interfaces/IScreen";
import P5 from "p5";
import Rod from "../classes/multiGameClasses/Rod";
import Ball from "../classes/multiGameClasses/Ball";
import {gameUserData} from "../queries";
import net from "../net";

let playerOne: Rod
let playerTwo: Rod

let ball: Ball

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

class MultiGame implements IScreen {
	sleep: boolean = false

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
		ball = new Ball(ball_image)

		p5.fill(net.white ? "white" : "black")
		p5.textAlign("center")
	}

	screenLoop(p5: P5): boolean {
		p5.background(net.white ? "black" : "white")
		ball.update(playerOne)
		playerOne.draw(p5, net.myRod)
		playerTwo.draw(p5, net.otherRod)
		p5.textSize(p5.width / 18)
		p5.text(net.score.left, p5.width / 4, p5.height / 7)
		p5.text(net.score.right, (p5.width / 4) * 3, p5.height / 7)
		if (net.screen === "") {
			ball.draw(p5)
		} else {
			if (net.screen === "ready")
				displayGetReady(p5)
			else {
				let winner = net.screen === "you" ? this.me.data.username : this.opponent.data.username
				console.log(net.screen, this.me.data.username, this.opponent.data.username)
				displayWinner(winner, p5)
				if (this.sleep)
					return false
				this.sleep = true
				setTimeout(() => {
					window.location.reload()
					this.sleep = false
				}, 2000)
			}
		}
		return false
	}

	loadScreen(p5: P5) {
		this.screenPreload(p5)
		this.screenSetup(p5)
	}

	setKeyPressed(p5: P5) {
		if (p5.key === "w" || p5.key == "z" || p5.key === "ArrowUp") {
			if (net.white)
				playerOne.goUp = true
			else
				playerOne.goDown = true
		} else if (p5.key === "s" || p5.key === "ArrowDown") {
			if (net.white)
				playerOne.goDown = true
			else
				playerOne.goUp = true
		}
	}

	setKeyReleased(p5: P5) {
		if (p5.key === "w" || p5.key == "z" || p5.key === "ArrowUp") {
			if (net.white)
				playerOne.goUp = false
			else
				playerOne.goDown = false
		} else if (p5.key === "s" || p5.key === "ArrowDown") {
			if (net.white)
				playerOne.goDown = false
			else
				playerOne.goUp = false
		}
	}
}

export default MultiGame
