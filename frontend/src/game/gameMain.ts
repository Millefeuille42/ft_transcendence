import P5 from "p5"
import {LocalGame} from "@/game/localGame";

class button {
	selected: boolean = false
	x: number
	y: number
	w: number
	h: number
	text_y: number
	text: string
	act: LocalGame

	constructor(text: string, y: number, act: LocalGame, p5: P5) {
		this.w = p5.width / 4
		this.h = p5.height / 15

		this.x = p5.width / 2 - this.w / 2
		this.y = y - this.h / 2

		this.text_y = y - this.h / 4

		this.text = text

		this.act = act
	}

	draw(p5: P5) {
		if (!this.selected) {
			p5.fill("black")
			p5.stroke("white")
		} else {
			p5.fill("white")
			p5.strokeWeight(0)
			p5.stroke("black")
		}
		p5.strokeWeight(5)
		p5.rect(this.x, this.y, this.w, this.h)

		if (!this.selected) {
			p5.fill("white")
			p5.strokeWeight(0)
			p5.stroke("black")
		} else {
			p5.fill("black")
			p5.stroke("white")
		}
		p5.textSize(p5.width / 35)
		p5.text(this.text, this.x, this.text_y, this.w, this.h)
	}
}

export const sketch = (p5: P5) => {

	let c_width = 200
	let c_height = 200
	let local: LocalGame = new LocalGame()
	let loaded = false
	let buttons: button[] = []
	let buttonIndex: number = 0

	p5.setup = () => {
		const parent = document.getElementById("game")
		if (parent !== null) {
			c_width = parent.clientWidth
			c_height = parent.clientHeight
		}

		const canvas = p5.createCanvas(c_width, c_height)
		canvas.parent("game")
		p5.frameRate(60)
		p5.background("black")
		p5.textAlign("center")

		buttons.push(new button("Local", p5.height / 24 * 10, local, p5))
		buttons.push(new button("Multiplayer", p5.height / 24 * 13, new LocalGame(), p5))
		buttons.push(new button("Spectate", p5.height / 24 * 16, new LocalGame(), p5))

		buttons[buttonIndex].selected = true
	}

	p5.draw = () => {
		if (!loaded) {
			p5.background("black")

			p5.fill("white")
			p5.stroke("black")
			p5.textSize(p5.width / 20)
			p5.text("Pong De Fou", 0, p5.height / 10, p5.width)

			for (let bi in buttons) {
				buttons[bi].draw(p5)
			}
		} else {
			if (local.gameLoop(p5)) {
				loaded = false
			}
		}
	}

	p5.keyPressed = () => {
		if (loaded) {
			local.setKeyPressed(p5)
			return
		}

		if (p5.key === "Enter") {
			if (loaded)
				return
			buttons[buttonIndex].act.loadGame(p5)
			loaded = true
			return
		}

		buttons[buttonIndex].selected = false
		if (p5.key === "ArrowUp") {
			buttonIndex--
			if (buttonIndex === -1)
				buttonIndex = buttons.length - 1
		} else if (p5.key === "ArrowDown") {
			buttonIndex = (buttonIndex + 1) % buttons.length
		}
		buttons[buttonIndex].selected = true
	}

	p5.keyReleased = () => {
		if (loaded)
			local.setKeyReleased(p5)
	}
}

//if (!loaded) {
//	local.loadGame(p5)
//	loaded = true
//	return
//}
//local.gameLoop(p5)
