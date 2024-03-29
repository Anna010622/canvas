const canvas = document.getElementById('snowman');
const ctx = canvas.getContext('2d');

const snowmanBody = new Image();
snowmanBody.src = '../assets/snowman/snowman1.svg';
const snowmanNose = new Image();
snowmanNose.src = '../assets/snowman/nose1.svg';

const scaleFactor = 1.3;
const snowmanWidth = 200 * scaleFactor;
const snowmanHeight = 250 * scaleFactor;

const x = canvas.width - (snowmanWidth + canvas.width * 0.1);
const y = canvas.height - (snowmanHeight + canvas.height * 0.1);

const eyeRadius = (snowmanWidth * 0.06) / 2;
const eyeX = x + snowmanWidth / 2 - eyeRadius * 2.5;
const eyeY = y + snowmanHeight * 0.3;

const rangeXEye = snowmanWidth * 0.08;
const minXEye = eyeX - rangeXEye / 2;
let percentageX = 0;

const rangeYEye = snowmanWidth * 0.08;
const minYEye = eyeY - rangeYEye / 2;
let percentageY = 0;

let mouseMoved = false;
let lastMouseMoveTime = 0;

canvas.addEventListener('mousemove', event => {
	mouseMoved = true;
	percentageX = event.offsetX / canvas.width;
	percentageY = event.offsetY / canvas.width;

	lastMouseMoveTime = Date.now();
});

function getEyeCoordinates() {
	const eyeXNew = mouseMoved ? minXEye + rangeXEye * percentageX : eyeX;
	const eyeYNew = mouseMoved ? minYEye + rangeYEye * percentageY : eyeY;
	return {
		eyeX: eyeXNew,
		eyeY: eyeYNew,
	};
}

function drawEyes({ eyeX, eyeY }) {
	ctx.beginPath();
	ctx.arc(eyeX - eyeRadius * 3, eyeY, eyeRadius, 0, Math.PI * 2);
	ctx.arc(eyeX + eyeRadius * 3, eyeY, eyeRadius, 0, Math.PI * 2);
	ctx.fill();
}

function returnEyeToOriginPosition() {
	const currentTime = Date.now();
	if (mouseMoved && currentTime - lastMouseMoveTime > 1000) {
		mouseMoved = false;
	}
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.drawImage(snowmanBody, x, y, snowmanWidth, snowmanHeight);

	const eyeCoordinates = getEyeCoordinates();
	drawEyes(eyeCoordinates);
	returnEyeToOriginPosition();

	ctx.drawImage(snowmanNose, x, y, snowmanWidth, snowmanHeight);

	requestAnimationFrame(animate);
}

snowmanBody.addEventListener('load', () => {
	animate();
});
