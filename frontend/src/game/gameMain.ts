import P5 from "p5"
import Font from "p5"
import {rod} from "./rod"
import {myVector} from "@/game/vector";
import {ballClass} from "@/game/ball";

export const sketch = (p5: P5) => {
	let c_width = 200
	let c_height = 200

	let playerOne: rod
	let oneScore: number = 0
	let twoScore: number = 0
	let playerTwo: rod

	let ball: ballClass

	let f: P5.Font

	function autoResize() {
		let parent = document.getElementById("game")
		if (parent !== null) {
			if (c_width !== parent.clientWidth && c_height !== parent.clientHeight) {
				// TODO put player and ball to new position
				playerOne = new rod(playerOne.position.x, playerOne.position.y, p5)
				playerTwo = new rod(playerTwo.position.x, playerTwo.position.y, p5)


				c_width = parent.clientWidth
				c_height = parent.clientHeight
				p5.resizeCanvas(c_width, c_height, true)
			}
		}
	}

	function drawScene() {
		p5.background("black")
		playerOne.draw(p5)
		playerTwo.draw(p5)
		ball.draw(p5)

		p5.text(oneScore, p5.width / 3, 100)
		p5.text(twoScore, (p5.width /3) * 2, 100)
	}

	p5.setup = () => {
		const parent = document.getElementById("game")
		if (parent !== null) {
			console.log(parent)
			c_width = parent.clientWidth
			c_height = parent.clientHeight
		}

		const canvas = p5.createCanvas(c_width, c_height)
		canvas.parent("game")

		playerOne = new rod(p5.width * 0.01, p5.height * 0.069, p5)
		playerTwo = new rod(p5.width * 0.99 - p5.width * 0.017, p5.height * 0.069, p5)
		ball = new ballClass(p5.width / 2, p5.height / 2, p5.width * 0.007, p5.width * 0.007, p5)

		f = p5.loadFont("Arial")

		p5.frameRate(60)
		drawScene()
	}

	p5.draw = () => {
		autoResize()
		let goal = ball.move(playerOne, playerTwo, p5)
		drawScene()
		if (goal) {
			if (ball.direction.x > 0) {
				oneScore++
				ball = new ballClass(p5.width / 2, p5.height / 2, p5.width * 0.007, p5.width * 0.007, p5)
				if (ball.direction.x < 0) {
					ball.direction.x *= -1
				}
			} else {
				twoScore++
				ball = new ballClass(p5.width / 2, p5.height / 2, p5.width * 0.007, p5.width * 0.007, p5)
				if (ball.direction.x > 0) {
					ball.direction.x *= -1
				}
			}
			drawScene()
		}
	}

	p5.keyPressed = () => {
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

	p5.keyReleased = () => {
		if (p5.key === "w") {
			playerOne.goUp = false
		} else if (p5.key === "s") {
			playerOne.goDown = false
		} else if (p5.key === "ArrowUp") {
			playerTwo.goUp = false
		} else if (p5.key === "ArrowDown") {
			playerTwo.goDown = false
		}	}
}
