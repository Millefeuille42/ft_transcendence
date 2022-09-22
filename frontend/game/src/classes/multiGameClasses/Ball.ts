import P5 from "p5";
import net from "../../net";
import Rod from "./Rod";

class Ball {

	constructor(p5:P5, left: boolean, private texture: P5.Image) {
	}

	move() {
		if (net.ask)
			net.socket.emit('multiUpdate', {id: net.match.id})
	}

	draw(p5:P5) {
		p5.image(this.texture, net.ball.x, net.ball.y, p5.width * 0.015, p5.height * 0.015)
	}

	update(rod: Rod): boolean {
		net.socket.emit('multiMove', {
			id: net.match.id,
			goUp: rod.goUp,
			goDown: rod.goDown
		})
		this.move()
		return false
	}
}

export default Ball
