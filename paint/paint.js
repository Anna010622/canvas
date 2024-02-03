const canvas = document.getElementById('canvasPain');
const drawingBoardEl = document.querySelector('.drawing-board');
const resizeEl = document.querySelector('#resize');
const colorPickerEl = document.querySelector('#color-picker');
const clearBtnEl = document.querySelector('#clear-btn');
const backBtnEl = document.querySelector('#back-btn');
const saveBtnEl = document.querySelector('#save-btn');
const toolsEl = document.querySelector('.tools');

const history = [];

let brushSize = 20;
let color = colorPickerEl.value;
let isDrawing = false;
let selectedTool = 'pencil';

const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });

setCanvasSize();
setCanvasBackground();

window.addEventListener('resize', () => {
	setCanvasSize();
	setCanvasBackground();
});

resizeEl.addEventListener('input', updateBruchSize);
colorPickerEl.addEventListener('input', updateColor);
toolsEl.addEventListener('click', setTool);

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

function setCanvasSize() {
	canvas.width = drawingBoardEl.clientWidth;
	canvas.height = drawingBoardEl.clientHeight;
}

function setCanvasBackground() {
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fill;
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	setCanvasBackground();
	history.length = 0;
}

function startDrawing(event) {
	drawCircle(event);
	isDrawing = true;
	ctx.lineWidth = brushSize;
	ctx.strokeStyle = selectedTool === 'eraser' ? '#ffffff' : color;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.beginPath();
}

function draw(event) {
	if (!isDrawing) return;

	if (selectedTool === 'pencil' || selectedTool === 'eraser') {
		ctx.lineTo(event.offsetX, event.offsetY);
		ctx.stroke();
	} else if (selectedTool === 'brush') {
		drawCircle(event);
	}
}

function stopDrawing() {
	isDrawing = false;
	history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function drawCircle(event) {
	let x = event.offsetX;
	let y = event.offsetY;
	ctx.fillStyle = selectedTool === 'eraser' ? '#ffffff' : color;
	ctx.beginPath();
	ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
	ctx.fill();
}

function returnPreviousImage() {
	history.pop();
	if (history.length === 0) return clearCanvas();
	ctx.putImageData(history[history.length - 1], 0, 0);
}

function saveImage() {
	const data = canvas.toDataURL('image/jpg');
	saveBtnEl.setAttribute('href', data);
	saveBtnEl.setAttribute('download', `${Date.now()}.jpg`);
}

function updateBruchSize(event) {
	brushSize = event.target.value;
}

function updateColor(event) {
	color = event.target.value;
}

function setTool(event) {
	const liElement = event.target.closest('li');
	if (!liElement) return;

	const toolId = liElement.id;
	const allToolElements = event.currentTarget.children;

	[...allToolElements].forEach(toolElement => {
		toolElement.classList.remove('active');
	});

	liElement.classList.add('active');
	selectedTool = toolId;
}
