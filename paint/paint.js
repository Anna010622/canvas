const canvas = document.getElementById('canvas2');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

canvas.addEventListener('mousemove', drawCircle);

function drawCircle(event) {
	const coordinates = {
		x: event.x,
		y: event.y,
	};
	createCircle(coordinates);
}

function createCircle({ x, y }) {
	ctx.beginPath();
	ctx.fillStyle = '#9fb6fe';
	ctx.strokeStyle = '#B6FE9F';
	ctx.lineWidth = 5;
	ctx.arc(x, y, 10, 0, Math.PI * 2);
	ctx.fill();
	ctx.stroke();
}
