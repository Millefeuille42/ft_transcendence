import P5 from "p5";
import MyVector from "../genericClasses/MyVector";

class Rod {
	width: number
	height: number
	speed: number

	position: MyVector = new MyVector

	goUp: boolean = false
	goDown: boolean = false
	left: boolean

	constructor(p5: P5, left: boolean, private texture: P5.Image) {
	}

	up() {
	}

	down(p5:P5) {
	}

	move(p5) {
		if (this.goUp)
			this.up()
		if (this.goDown)
			this.down(p5)
	}

	draw(p5:P5) {
		p5.image(this.texture, this.position.x, this.position.y, this.width, this.height)
	}

	update(p5:P5) {
		this.move(p5)
	}
}

export default Rod
