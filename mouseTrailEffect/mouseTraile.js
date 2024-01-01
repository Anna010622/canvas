const canvas = document.getElementById('canvas3');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const circles = [];
let hue = 0;

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

const mouseCoordinates = {
	x: 0,
	y: 0,
};

canvas.addEventListener('click', function (event) {
	mouseCoordinates.x = event.x;
	mouseCoordinates.y = event.y;
	for (let i = 0; i < 10; i++) {
		circles.push(new Circle());
	}
});

canvas.addEventListener('mousemove', function (event) {
	mouseCoordinates.x = event.x;
	mouseCoordinates.y = event.y;
	for (let i = 0; i < 5; i++) {
		circles.push(new Circle());
	}
});

class Circle {
	constructor() {
		this.x = mouseCoordinates.x;
		this.y = mouseCoordinates.y;
		this.radius = Math.random() * 15 + 5;
		this.directionX = Math.random() * 3 - 1.5;
		this.directionY = Math.random() * 3 - 1.5;
		this.color = `hsl(${hue}, 100%, 50%)`;
	}

	updateCoordinates() {
		this.x += this.directionX;
		this.y += this.directionY;
	}

	updateSize() {
		if (this.radius > 0.1) this.radius -= 0.1;
	}

	draw() {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
	}
}

function drawAllCircles() {
	circles.forEach((circle, index) => {
		circle.updateCoordinates();
		circle.updateSize();
		circle.draw();
		if (circles[index].radius <= 0.2) {
			circles.splice(index, 1);
		}
	});
}

function animate() {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawAllCircles();
	if (hue < 361) {
		hue++;
	} else hue = 1;

	requestAnimationFrame(animate);
}
animate();
