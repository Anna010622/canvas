const canvas = document.getElementById('canvasPain');
const drawingBoardEl = document.querySelector('.drawing-board');
const rangeEl = document.querySelector('#size');
const colorEl = document.querySelector('#color');
const ctx = canvas.getContext('2d');

let brushSize = 20;
let color = colorEl.value;

canvas.width = drawingBoardEl.clientWidth;
canvas.height = drawingBoardEl.clientHeight;

window.addEventListener('resize', () => {
	canvas.width = drawingBoardEl.clientWidth;
	canvas.height = drawingBoardEl.clientHeight;
});

canvas.addEventListener('mousemove', drawCircle);

rangeEl.addEventListener('input', event => {
	brushSize = event.target.value;
});

colorEl.addEventListener('input', event => {
	color = event.target.value;
	console.log(color);
});

function drawCircle(event) {
	const coordinates = {
		x: event.offsetX,
		y: event.offsetY,
	};
	createCircle(coordinates);
}

function createCircle({ x, y }) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
	ctx.fill();
}
