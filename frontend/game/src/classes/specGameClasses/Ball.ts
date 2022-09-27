import P5 from "p5";
import net from "../../net";
import Rod from "./Rod";

class Ball {
	texture: P5.Image

	constructor(texture: P5.Image) {this.texture = texture}

	move() {
		if (net.ask)
			net.socket.emit('multiSpec', {id: net.match.id})
	}

	draw(p5:P5) {
		p5.image(this.texture,
			net.ball.x / 100 * p5.width,
			net.ball.y / 100 * p5.height,
			p5.width * 0.015, p5.height * 0.015)
	}

	update(rod: Rod): boolean {
		this.move()
		return false
	}
}

export default Ball
