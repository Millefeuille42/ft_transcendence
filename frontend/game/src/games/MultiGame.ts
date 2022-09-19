import IScreen from "../interfaces/IScreen";
import P5 from "p5";

class MultiGame implements IScreen {

	screenPreload(p5: P5): void {
	}

	screenSetup(p5: P5): void {
	}

	loadScreen(p5: P5): void {
		this.screenPreload(p5)
		this.screenSetup(p5)
	}

	screenLoop(p5: P5): boolean {
		return false;
	}

	setKeyPressed(p5: P5): void {
	}

	setKeyReleased(p5: P5): void {
	}

}

export default MultiGame
