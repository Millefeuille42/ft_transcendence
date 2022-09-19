import MyVector from "./classes/genericClasses/MyVector";
import P5 from "p5";

export class Rod {
	sceneHeight: number

	width: number
	height: number

	speed: number
	position: MyVector = new MyVector(0, 0)

	left: boolean

	goUp: boolean = false
	goDown: boolean = false

	constructor(p5:P5, left: boolean) {
		this.left = left
		this.sceneHeight = p5.height
		this.position.y = this.sceneHeight / 2 - (this.sceneHeight * 0.15 / 2)
		this.position.x = p5.width * 0.01
		if (!this.left)
			this.position.x = p5.width * 0.99 - p5.width * 0.017
		this.speed = this.sceneHeight * 0.02

		this.width = p5.width * 0.017
		this.height = this.sceneHeight * 0.15
	}

	up() {
		if (this.position.y - this.speed > 0)
			this.position.y -= this.speed
		else
			this.position.y = 0
	}

	down() {
		if (this.position.y + this.speed < this.sceneHeight - this.height)
			this.position.y += this.speed
		else
			this.position.y = this.sceneHeight - this.height
	}

	draw(p5: P5) {
		if (this.goUp)
			this.up()
		if (this.goDown)
			this.down()
		p5.rect(this.position.x, this.position.y, this.width, this.height)
	}
}
