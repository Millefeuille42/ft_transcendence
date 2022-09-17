import P5 from "p5";

export function createPrompt(p5: P5): P5.Element {
	let input = p5.createInput();
	input.position(p5.width / 2 - p5.width / 4, p5.height / 2 - p5.height / 40)
	input.style("width", (p5.width / 2).toString() + 'px')
	input.style("height", (p5.height / 20).toString() + 'px')
	input.style('font-size', '30px');
	input.style('background-color', 'black');
	input.style('color', 'white')
	input.style('border', '2px solid white')
	input.style('border-radius', '12px')
	input.style('text-align', 'center')
	return input
}

