const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const circles = [];

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

class Circle {
	constructor() {
		this.radius = Math.random() * 15 + 5;
		this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
		this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius;
		this.directionX = Math.random() * 3 - 1.5;
		this.directionY = Math.random() * 3 - 1.5;
		this.size = Math.random() > 0.5 ? 1 : -1;
	}

	updateCoordinates() {
		if (this.x < 0 + this.radius || this.x > canvas.width - this.radius) {
			this.directionX *= -1;
		}
		if (this.y < 0 + this.radius || this.y > canvas.height - this.radius) {
			this.directionY *= -1;
		}
		this.x += this.directionX;
		this.y += this.directionY;
	}

	updateSize() {
		if (this.radius < 1 || this.radius >= 20) {
			this.size *= -1;
		}

		if (this.size === 1) {
			this.radius -= 0.1;
			return;
		}
		if (this.size < 1) {
			this.radius += 0.1;
		}
	}

	draw() {
		ctx.fillStyle = '#57FF00';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
	}
}

function createCircleArray() {
	for (let i = 0; i < 100; i++) {
		circles.push(new Circle());
	}
}
createCircleArray();

function drawAllCircles() {
	circles.forEach(circle => {
		circle.updateCoordinates();
		circle.updateSize();
		circle.draw();
	});
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawAllCircles();
	requestAnimationFrame(animate);
}
animate();
