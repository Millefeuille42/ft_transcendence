import P5 from "p5";
import MyVector from "./MyVector";

class Rod {
	width: number
	height: number
	speed: number

	position: MyVector = new MyVector

	goUp: boolean = false
	goDown: boolean = false
	left: boolean

	constructor(p5: P5, left: boolean) {
		this.position.y = p5.height / 2 - (p5.height * 0.15 / 2)
		this.position.x = p5.width * 0.99 - p5.width * 0.017
		if (left)
			this.position.x = p5.width * 0.01
		this.width = p5.width * 0.017
		this.height = p5.height * 0.15
		this.speed = p5.height * 0.02
		this.left = left
	}

	up() {
		if (this.position.y - this.speed > 0)
			this.position.y -= this.speed
		else
			this.position.y = 0
	}

	down(p5:P5) {
		if (this.position.y + this.speed < p5.height - this.height)
			this.position.y += this.speed
		else
			this.position.y = p5.height - this.height
	}

	move(p5) {
		if (this.goUp)
			this.up()
		if (this.goDown)
			this.down(p5)
	}

	draw(p5:P5) {
		p5.rect(this.position.x, this.position.y, this.width, this.height)
	}

	update(p5:P5) {
		this.move(p5)
	}
}

export default Rod
