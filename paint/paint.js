const canvas = document.getElementById('canvasPain');
const cursor = document.querySelector('.cursor');
const drawingBoardEl = document.querySelector('.drawing-board');
const brushSizeEl = document.querySelector('#brush-size');
const resizeEl = document.querySelector('#resize');
const colorPickerEl = document.querySelector('#color-picker');
const clearBtnEl = document.querySelector('#clear-btn');
const backBtnEl = document.querySelector('#back-btn');
const forwardBtnEl = document.querySelector('#forward-btn');
const saveBtnEl = document.querySelector('#save-btn');
const toolsEl = document.querySelector('.tools');
const toggleBtnEl = document.querySelector('.toggle-btn');

const history = [];
const maxHistoryLength = 15;
const canvasBGColor = '#ffffff';
let canvasPosition = canvas.getBoundingClientRect();
let historyIndex;
let brushSize = resizeEl.value;
let color = colorPickerEl.value;
let isDrawing = false;
let selectedTool = 'pencil';
let initialCursorPositionX;
let initialCursorPositionY;
let lastSnapshot;

const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });

setCanvasSize();
setCanvasBackground();
setCursorSize();
setCursorBGColor();

window.addEventListener('resize', () => {
	if (
		drawingBoardEl.clientWidth > canvas.width ||
		drawingBoardEl.clientHeight > canvas.height
	) {
		setCanvasSize();
	}
	canvasPosition = canvas.getBoundingClientRect();
	setCanvasBackground();
	const imgData = history[history.length - 1];
	if (imgData) ctx.putImageData(imgData, 0, 0);

	if (window.innerWidth >= 1200) {
		toggleBtnEl.classList.remove('close');
	}
});

brushSizeEl.addEventListener('change', handleBrushSizeInput);
brushSizeEl.addEventListener('wheel', handleBrushSizeScroll);
resizeEl.addEventListener('change', handleBrushSizeInput);
colorPickerEl.addEventListener('input', updateColor);
toolsEl.addEventListener('click', setTool);

canvas.addEventListener('mousedown', e => {
	startDrawing(e.offsetX, e.offsetY);
	hideToggleBtn();
});
canvas.addEventListener('mousemove', e => {
	draw(e.offsetX, e.offsetY);
	drawCursor(e.offsetX, e.offsetY);
});
canvas.addEventListener('mouseup', e => {
	stopDrawing(e.offsetX, e.offsetY);
	showToggleBtn();
});
canvas.addEventListener('mouseout', e => {
	handleMouseout(e.offsetX, e.offsetY);
});
canvas.addEventListener('mouseenter', e => {
	handleMouseenter(e.offsetX, e.offsetY);
});

canvas.addEventListener('touchstart', e => {
	if (e.cancelable) e.preventDefault();
	startDrawing(
		e.changedTouches[0].pageX - canvasPosition.x,
		e.changedTouches[0].pageY - canvasPosition.y
	);
	hideToggleBtn();
});
canvas.addEventListener('touchend', e => {
	if (e.cancelable) e.preventDefault();
	stopDrawing(
		e.changedTouches[0].pageX - canvasPosition.x,
		e.changedTouches[0].pageY - canvasPosition.y
	);
	showToggleBtn();
});

canvas.addEventListener('touchmove', e => {
	if (e.cancelable) e.preventDefault();
	draw(
		e.changedTouches[0].pageX - canvasPosition.x,
		e.changedTouches[0].pageY - canvasPosition.y
	);
	hideToggleBtn();
});

clearBtnEl.addEventListener('click', clearCanvas);
backBtnEl.addEventListener('click', returnPreviousImage);
forwardBtnEl.addEventListener('click', returnNextImage);
saveBtnEl.addEventListener('click', saveImage);
toggleBtnEl.addEventListener('click', togglePanel);
document.addEventListener('keydown', e => {
	if (e.altKey && e.ctrlKey && e.code === 'KeyZ') {
		returnNextImage();
	} else if (e.code === 'KeyZ' && e.ctrlKey) {
		returnPreviousImage();
	}
});

function setCanvasSize() {
	canvas.width = drawingBoardEl.clientWidth;
	canvas.height = drawingBoardEl.clientHeight;
}

function setCanvasBackground() {
	ctx.fillStyle = canvasBGColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fill;
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	setCanvasBackground();
	history.length = 0;
}

function startDrawing(x, y) {
	isDrawing = true;
	lastSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
	initialCursorPositionX = x;
	initialCursorPositionY = y;

	if (
		selectedTool === 'brush' ||
		selectedTool === 'pencil' ||
		selectedTool === 'eraser'
	) {
		drawDot(x, y);
	}
	ctx.lineWidth = brushSize;
	ctx.strokeStyle = selectedTool === 'eraser' ? canvasBGColor : color;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.beginPath();
	ctx.moveTo(initialCursorPositionX, initialCursorPositionY);
}

function draw(x, y) {
	if (!isDrawing) return;
	if (selectedTool === 'pencil' || selectedTool === 'eraser') {
		ctx.lineTo(x, y);
		ctx.stroke();
	} else if (selectedTool === 'brush') {
		drawDot(x, y);
	} else if (selectedTool === 'rectangle') {
		ctx.putImageData(lastSnapshot, 0, 0);
		drawRectangle(x, y);
	} else if (selectedTool === 'line') {
		ctx.putImageData(lastSnapshot, 0, 0);
		drawLine(x, y);
	} else if (selectedTool === 'triangle') {
		ctx.putImageData(lastSnapshot, 0, 0);
		drawTriangle(x, y);
	} else if (selectedTool === 'circle') {
		ctx.putImageData(lastSnapshot, 0, 0);
		drawCircle(x, y);
	}
}

function stopDrawing() {
	isDrawing = false;
	history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
	if (history.length > maxHistoryLength) history.shift();
	historyIndex = history.length - 1;
}

function drawDot(x, y) {
	ctx.fillStyle = selectedTool === 'eraser' ? canvasBGColor : color;
	ctx.beginPath();
	ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
	ctx.fill();
}

function drawCircle(x, y) {
	const radius = Math.sqrt(
		Math.pow(initialCursorPositionX - x, 2) +
			Math.pow(initialCursorPositionY - y, 2)
	);
	ctx.beginPath();
	ctx.arc(
		initialCursorPositionX,
		initialCursorPositionY,
		radius,
		0,
		Math.PI * 2
	);
	ctx.stroke();
}

function drawRectangle(x, y) {
	ctx.strokeRect(
		initialCursorPositionX,
		initialCursorPositionY,
		x - initialCursorPositionX,
		y - initialCursorPositionY
	);
}

function drawLine(x, y) {
	ctx.beginPath();
	ctx.moveTo(initialCursorPositionX, initialCursorPositionY);
	ctx.lineTo(x, y);
	ctx.stroke();
}

function drawTriangle(x, y) {
	ctx.beginPath();
	ctx.moveTo(initialCursorPositionX, initialCursorPositionY);
	ctx.lineTo(x, y);
	ctx.lineTo(initialCursorPositionX * 2 - x, y);
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

function handleBrushSizeInput(event) {
	const value = Math.round(event.target.value);
	if (value < 1) {
		setBrushSize(1);
		return;
	} else if (value > 100) {
		setBrushSize(100);
		return;
	}
	setBrushSize(value);
}

function setBrushSize(value) {
	brushSize = value;
	brushSizeEl.value = value;
	resizeEl.value = value;
	setCursorSize();
}

function handleBrushSizeScroll(e) {
	e.preventDefault();
	let value = Number(e.target.value);

	if (e.deltaY > 0 && value < 100) {
		value += 1;
	} else if (e.deltaY < 0 && value > 1) {
		value -= 1;
	}

	if (brushSize !== value) setBrushSize(value);
}

function updateColor(event) {
	color = event.target.value;
	updateCursor();
}

function setTool(event) {
	const liElement = event.target.closest('li');
	if (!liElement) return;

	const toolId = liElement.id;
	if (toolId === selectedTool) return;
	const allToolElements = event.currentTarget.children;

	[...allToolElements].forEach(toolElement => {
		toolElement.classList.remove('active');
	});

	liElement.classList.add('active');
	selectedTool = toolId;

	updateCursor();
}

function handleMouseout() {
	cursor.style.opacity = 0;
	if (!isDrawing) return;
	document.addEventListener('mouseup', stopDrawing);
}

function handleMouseenter() {
	cursor.style.opacity = 1;
	if (isDrawing) ctx.beginPath();
	document.removeEventListener('mouseup', stopDrawing);
}

function drawCursor(x, y) {
	cursor.style.top = `${y - brushSize / 2}px`;
	cursor.style.left = `${x - brushSize / 2}px`;
}

function updateCursor() {
	if (
		selectedTool === 'rectangle' ||
		selectedTool === 'line' ||
		selectedTool === 'triangle' ||
		selectedTool === 'circle'
	) {
		canvas.style.cursor = 'crosshair';
		cursor.style.backgroundColor = color;
	} else if (selectedTool === 'eraser') {
		canvas.style.cursor = 'none';
		cursor.style.backgroundColor = canvasBGColor;
	} else {
		canvas.style.cursor = 'none';
		cursor.style.backgroundColor = color;
	}
}

function setCursorSize() {
	cursor.style.width = `${brushSize}px`;
	cursor.style.height = `${brushSize}px`;
}

function setCursorBGColor() {
	cursor.style.backgroundColor = color;
}

function togglePanel() {
	toggleBtnEl.classList.toggle('close');
}

function hideToggleBtn() {
	toggleBtnEl.classList.add('hidden');
}

function showToggleBtn() {
	toggleBtnEl.classList.remove('hidden');
}
