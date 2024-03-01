const canvas = document.getElementById('snowman');
const ctx = canvas.getContext('2d');

const snowmanBody = new Image();
snowmanBody.src = '../assets/christmas/snowman2.svg';
const snowmanNose = new Image();
snowmanNose.src = '../assets/christmas/nose.svg';

const scaleFactor = 2;
const snowmanWidth = 200 * scaleFactor;
const snowmanHeight = 250 * scaleFactor;

const eyeRadius = (snowmanWidth * 0.06) / 2;
let eyeX = snowmanWidth / 2;
let eyeY = snowmanHeight * 0.27;

const rangeXEye = eyeRadius * 3;
const minXEye = eyeX - eyeRadius * 1.5;
let percentageX = 0;

const rangeYEye = eyeRadius * 3.5;
const minYEye = eyeY - eyeRadius * 2;
let percentageY = 0;

let mouseMoved = false;
let lastMouseMoveTime = 0;

window.addEventListener('mousemove', event => {
	mouseMoved = true;
	percentageX = event.screenX / window.innerWidth;
	percentageY = event.screenY / window.innerHeight;

	lastMouseMoveTime = Date.now();
});

export function calculateEyePositionFromMouse() {
	const eyeXNew = mouseMoved ? minXEye + rangeXEye * percentageX : eyeX;
	const eyeYNew = mouseMoved ? minYEye + rangeYEye * percentageY : eyeY;
	return {
		eyeX: eyeXNew,
		eyeY: eyeYNew,
	};
}

export function drawEyes({ eyeX, eyeY }) {
	ctx.beginPath();
	ctx.fillStyle = 'black';
	ctx.arc(eyeX - eyeRadius * 4, eyeY, eyeRadius, 0, Math.PI * 2);
	ctx.arc(eyeX + eyeRadius * 4, eyeY, eyeRadius, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.fillStyle = 'white';
	ctx.arc(eyeX - eyeRadius * 4 + 4, eyeY - 4, eyeRadius / 4, 0, Math.PI * 2);
	ctx.arc(eyeX + eyeRadius * 4 + 4, eyeY - 4, eyeRadius / 4, 0, Math.PI * 2);
	ctx.fill();
}
export function drawEyesHappy() {
	ctx.beginPath();
	ctx.fillStyle = 'black';
	ctx.lineWidth = 4;
	ctx.arc(eyeX - eyeRadius * 4, eyeY, eyeRadius, 85, Math.PI * 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(eyeX + eyeRadius * 4, eyeY, eyeRadius, 85, Math.PI * 2);
	ctx.stroke();
}

function returnEyeToOriginPosition() {
	const currentTime = Date.now();
	if (mouseMoved && currentTime - lastMouseMoveTime > 1000) {
		mouseMoved = false;
	}
}

function calculateEyePositionFromInput(inputText) {
	const percentageT = inputText.length / 15;

	return {
		eyeX: minXEye + rangeXEye * percentageT,
		eyeY: eyeY + eyeRadius,
	};
}

function drawShadow() {
	ctx.beginPath();
	ctx.fillStyle = '#c4d0df';
	ctx.ellipse(
		snowmanWidth / 2,
		snowmanHeight - 15,
		15,
		150,
		77,
		0,
		Math.PI * 2
	);
	ctx.fill();
}

export default function drawSnowman(inputText) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawShadow();

	ctx.drawImage(snowmanBody, 0, 0, snowmanWidth, snowmanHeight);

	const eyeCoordinates =
		inputText?.length > 0
			? calculateEyePositionFromInput(inputText)
			: calculateEyePositionFromMouse();

	if (inputText.toLowerCase() === 'Merry Christmas'.toLowerCase()) {
		drawEyesHappy();
	} else drawEyes(eyeCoordinates);

	returnEyeToOriginPosition();

	ctx.drawImage(snowmanNose, 0, 0, snowmanWidth, snowmanHeight);
}
