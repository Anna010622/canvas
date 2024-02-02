const canvas = document.getElementById('canvasPain');
const drawingBoardEl = document.querySelector('.drawing-board');
const resizeEl = document.querySelector('#resize');
const colorPickerEl = document.querySelector('#color-picker');
const clearBtnEl = document.querySelector('#clear-btn');
const backBtnEl = document.querySelector('#back-btn');
const saveBtnEl = document.querySelector('#save-btn');

const history = [];

let brushSize = 20;
let color = colorPickerEl.value;
let isDrawing = false;

const ctx = canvas.getContext('2d', { willReadFrequently: true });

setCanvasSize();
window.addEventListener('resize', setCanvasSize);

resizeEl.addEventListener('input', updateBruchSize);
colorPickerEl.addEventListener('input', updateColor);
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', () => {
	if (!isDrawing) return;
	document.addEventListener('mouseup', stopDrawing);
});
canvas.addEventListener('mouseenter', () => {
	if (isDrawing) ctx.beginPath();
	document.removeEventListener('mouseup', stopDrawing);
});
clearBtnEl.addEventListener('click', clearCanvas);
backBtnEl.addEventListener('click', returnPreviousImage);
saveBtnEl.addEventListener('click', saveImage);

function startDrawing(event) {
	drawCircle(event);
	isDrawing = true;
	ctx.lineWidth = brushSize;
	ctx.strokeStyle = color;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.moveTo(event.offsetX, event.offsetY);
	ctx.beginPath();
}

function draw(event) {
	if (!isDrawing) return;
	ctx.lineTo(event.offsetX, event.offsetY);
	ctx.stroke();
}

function stopDrawing() {
	isDrawing = false;
	history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	history.length = 0;
}

function returnPreviousImage() {
	history.pop();
	if (history.length === 0) return clearCanvas();
	ctx.putImageData(history[history.length - 1], 0, 0);
}

function saveImage() {
	const data = canvas.toDataURL('image/jpg');
	saveBtnEl.setAttribute('href', data);
	saveBtnEl.setAttribute('download', 'image.jpg');
}

function updateBruchSize(event) {
	brushSize = event.target.value;
}

function updateColor(event) {
	color = event.target.value;
}

function setCanvasSize() {
	canvas.width = drawingBoardEl.clientWidth;
	canvas.height = drawingBoardEl.clientHeight;
}

function drawCircle(event) {
	let x = event.offsetX;
	let y = event.offsetY;
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
	ctx.fill();
}
