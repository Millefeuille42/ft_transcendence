import P5 from "p5";
import MyVector from "../genericClasses/MyVector";

class Rod {
	goUp: boolean = false
	goDown: boolean = false

	constructor(private texture: P5.Image) {}

	draw(p5:P5, pos: MyVector) {
		p5.image(this.texture, pos.x, pos.y, p5.width * 0.017, p5.height * 0.15)
	}
}

export default Rod
