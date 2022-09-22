import P5 from "p5"
import Button from "./classes/genericClasses/Button";
import LocalGame from "./games/LocalGame";
import Menu from "./classes/genericClasses/Menu";
import MultiGame from "./games/MultiGame";
import Prompt from "./classes/genericClasses/Prompt";

let MultiMenu: Menu
let MainMenu: Menu
let HostPrompt: Prompt

export const sketch = (p5: P5) => {
	let c_width = 200
	let c_height = 200

	p5.setup = () => {
		const parent = document.getElementById("app")
		if (parent !== null) {
			c_width = parent.clientWidth
			c_height = parent.clientHeight
		}

		const canvas = p5.createCanvas(c_width, c_height)
		canvas.parent("app")
		p5.frameRate(60)
		p5.background("black")
		p5.textAlign("center")

		HostPrompt = new Prompt("Enter room code", () => {})

		MultiMenu = new Menu("Multiplayer", [
			new Button("Play", 0, new MultiGame(), p5),
			new Button("Host", 1, new LocalGame(), p5),
			new Button("Join", 2, new LocalGame(), p5),
		])

		MainMenu = new Menu("Pong De Fou", [
			new Button("Local", 0, new LocalGame(), p5, false),
			new Button("Multiplayer", 1, MultiMenu, p5),
			new Button("Spectate", 2, HostPrompt, p5),
		])

		MainMenu.loadScreen(p5)
	}

	p5.draw = () => {
		MainMenu.screenLoop(p5)
	}

	p5.keyPressed = () => {
		MainMenu.setKeyPressed(p5)
	}

	p5.keyReleased = () => {
		MainMenu.setKeyReleased(p5)
	}
}

new P5(sketch);
