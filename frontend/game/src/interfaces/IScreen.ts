import P5 from "p5";

interface IScreen {
	screenPreload(p5:P5): void
	screenSetup(p5:P5): void
	screenLoop(p5:P5): boolean
	loadScreen(p5:P5): void
	setKeyPressed(p5:P5): void
	setKeyReleased(p5:P5): void
}

export default IScreen
