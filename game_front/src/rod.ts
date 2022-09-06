import P5 from "p5";
import {myVector} from "./vector";

export class rod {
	position: myVector
	height: number
	width: number
	goUp: boolean = false
	goDown: boolean = false
	texture: P5.Image

	constructor(x: number, y: number, p5: P5, texture: P5.Image) {
		this.position = new myVector(x, y)
		this.height = p5.height * 0.15
		this.width = p5.width * 0.017
		this.texture = texture
	}

	draw(p5: P5) {
		if (this.goUp)
			this.up(p5)
		if (this.goDown)
			this.down(p5)
		p5.rect(this.position.x, this.position.y, this.width, this.height)
	}

	up(p5: P5) {
		if (this.position.y - p5.height * 0.02 > 0)
			this.position.y -= p5.height * 0.02
		else
			this.position.y = 0
	}

	down(p5: P5) {
		if (this.position.y + p5.height * 0.02 < p5.height - this.height)
			this.position.y += p5.height * 0.02
		else
			this.position.y = p5.height - this.height
	}
}
