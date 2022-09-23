import P5 from "p5";
import net from "./net";

export function createPrompt(p5: P5): P5.Element {
	let input = p5.createInput();
	input.position(p5.windowWidth / 2 - p5.windowWidth / 6, p5.windowHeight / 2 - p5.windowHeight / 20)
	input.style("width", (p5.windowWidth / 3).toString() + 'px')
	input.style("height",  (p5.windowHeight / 20).toString() + 'px')
	input.style('font-size', '1vw');
	input.style('background-color', net.white ? "black" : "white");
	input.style('color', net.white ? "white" : "black")
	input.style('border', '2px solid white')
	input.style('border-radius', '12px')
	input.style('text-align', 'center')
	return input
}

export function createButton(value: string, p5: P5): P5.Element {
	let button = p5.createButton(value)

	button.style("width", '12vw')
	button.style("height", '4vh')
	button.style('font-size', '1vw');
	button.style('background-color', net.white ? "black" : "white");
	button.style('color', net.white ? "white" : "black")
	button.style('border', '2px solid white')
	button.style('border-radius', '12px')
	button.style('text-align', 'center')

	return button
}
