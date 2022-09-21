import MyVector from "../genericClasses/MyVector";
import P5 from "p5";
import Rod from "./Rod";
import net from "../../net";

class Ball {
	speed: number
	size: number
	position: MyVector = new MyVector
	direction: MyVector = new MyVector

	constructor(p5:P5, left: boolean, private texture: P5.Image) {
	}

	randomize(p5:P5) {
		this.direction.y = p5.random(-1, 1)
	}

	move() {
		if (net.ask)
			net.socket.emit('multiUpdate', {id: net.match.id})
	}

	draw(p5:P5) {
		p5.image(this.texture, net.ball.x, net.ball.y, p5.width * 0.015, p5.height * 0.015)
	}

	update(): boolean {
		this.move()
		return false
	}
}

export default Ball
