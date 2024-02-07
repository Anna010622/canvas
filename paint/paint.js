const canvas = document.getElementById('canvasPain');
const drawingBoardEl = document.querySelector('.drawing-board');
const resizeEl = document.querySelector('#resize');
const colorPickerEl = document.querySelector('#color-picker');
const clearBtnEl = document.querySelector('#clear-btn');
const backBtnEl = document.querySelector('#back-btn');
const forwardBtnEl = document.querySelector('#forward-btn');
const saveBtnEl = document.querySelector('#save-btn');
const toolsEl = document.querySelector('.tools');

const history = [];
const maxHistoryLength = 15;
let historyIndex;
let brushSize = resizeEl.value;
let color = colorPickerEl.value;
let isDrawing = false;
let selectedTool = 'pencil';
let cursorX;
let cursorY;
let lastSnapshot;

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
forwardBtnEl.addEventListener('click', returnNextImage);
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
	isDrawing = true;
	lastSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
	cursorX = event.offsetX;
	cursorY = event.offsetY;
	if (
		selectedTool === 'brush' ||
		selectedTool === 'pencil' ||
		selectedTool === 'eraser'
	) {
		drawDot(event);
	}
	ctx.lineWidth = brushSize;
	ctx.strokeStyle = selectedTool === 'eraser' ? '#ffffff' : color;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.beginPath();
	ctx.moveTo(cursorX, cursorY);
}

function draw(event) {
	if (!isDrawing) return;
	if (selectedTool === 'pencil' || selectedTool === 'eraser') {
		ctx.lineTo(event.offsetX, event.offsetY);
		ctx.stroke();
	} else if (selectedTool === 'brush') {
		drawDot(event);
	} else if (selectedTool === 'rectangle') {
		ctx.putImageData(lastSnapshot, 0, 0);
		drawRectangle(event);
	} else if (selectedTool === 'line') {
		ctx.putImageData(lastSnapshot, 0, 0);
		drawLine(event);
	} else if (selectedTool === 'triangle') {
		ctx.putImageData(lastSnapshot, 0, 0);
		drawTriangle(event);
	} else if (selectedTool === 'circle') {
		ctx.putImageData(lastSnapshot, 0, 0);
		drawCircle(event);
	}
}

function stopDrawing() {
	isDrawing = false;
	history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
	if (history.length > maxHistoryLength) history.shift();
	historyIndex = history.length - 1;
}

function drawDot(event) {
	let x = event.offsetX;
	let y = event.offsetY;
	ctx.fillStyle = selectedTool === 'eraser' ? '#ffffff' : color;
	ctx.beginPath();
	ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
	ctx.fill();
}

function drawCircle(e) {
	const radius = Math.sqrt(
		Math.pow(cursorX - e.offsetX, 2) + Math.pow(cursorY - e.offsetY, 2)
	);
	ctx.beginPath();
	ctx.arc(cursorX, cursorY, radius, 0, Math.PI * 2);
	ctx.stroke();
}

function drawRectangle(e) {
	ctx.strokeRect(cursorX, cursorY, e.offsetX - cursorX, e.offsetY - cursorY);
}

function drawLine(e) {
	ctx.beginPath();
	ctx.moveTo(cursorX, cursorY);
	ctx.lineTo(e.offsetX, e.offsetY);
	ctx.stroke();
}

function drawTriangle(e) {
	ctx.beginPath();
	ctx.moveTo(cursorX, cursorY);
	ctx.lineTo(e.offsetX, e.offsetY);
	ctx.lineTo(cursorX * 2 - e.offsetX, e.offsetY);
	ctx.closePath();
	ctx.stroke();
}

function returnPreviousImage() {
	if (historyIndex >= 0) historyIndex -= 1;
	if (historyIndex === -1 && history.length < maxHistoryLength) {
		setCanvasBackground();
		return;
	} else if (historyIndex === -1) return;

	if (history.length === 0) return clearCanvas();

	ctx.putImageData(history[historyIndex], 0, 0);
}

function returnNextImage() {
	if (historyIndex < history.length - 1) {
		historyIndex += 1;
		ctx.putImageData(history[historyIndex], 0, 0);
	}
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
