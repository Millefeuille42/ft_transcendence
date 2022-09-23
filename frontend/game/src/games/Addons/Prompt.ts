import IScreen from "../../interfaces/IScreen";
import P5 from "p5";
import net, {getOnlineText} from "../../net";
import {createButton, createPrompt} from "../../elements";

class Prompt implements IScreen {
	title: string
	action: Function
	input: P5.Element
	stop: boolean
	sendButton: P5.Element
	quitButton: P5.Element

	constructor(title: string, action: Function) {
		this.title = title
		this.action = action
		this.stop = false
	}

	screenLoop(p5: P5): boolean {
		if (this.stop) {
			this.sendButton.remove()
			this.quitButton.remove()
			this.input.remove()
			this.stop = false
			return true
		}

		p5.background(net.white ? "black" : "white")

		p5.fill(net.white ? "white" : "black")
		p5.stroke(net.white ? "black" : "white")
		p5.textSize(p5.width / 20)
		p5.text(this.title, 0, p5.height / 5, p5.width)

		p5.textSize(p5.width / 60)
		p5.text(getOnlineText(), p5.width - p5.width / 15, p5.height / 20)

		return false
	}

	loadScreen(p5: P5): void {
		this.screenPreload(p5)
		this.screenSetup(p5)
	}

	screenPreload(p5: P5): void {
	}

	screenSetup(p5: P5): void {
		this.input = createPrompt(p5)

		this.sendButton = createButton("SEND", p5)
		this.sendButton.position(((p5.windowWidth / 12) * 7) - p5.windowWidth / 14, p5.windowHeight - p5.windowHeight / 2.2)
		this.sendButton.mousePressed(() => {
			this.action(this.input.value())
			this.sendButton.remove()
			this.quitButton.remove()
			this.input.remove()
		})

		this.quitButton = createButton("QUIT", p5)
		this.quitButton.position(((p5.windowWidth / 12) * 5) - p5.windowWidth / 14, p5.windowHeight - p5.windowHeight / 2.2)
		this.quitButton.mousePressed(() => {this.stop = true})
	}

	setKeyPressed(p5: P5): void {
	}

	setKeyReleased(p5: P5): void {
	}
}

export default Prompt
