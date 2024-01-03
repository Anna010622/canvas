const canvas = document.querySelector('#canvasSnow');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particleCount = 50;
const particles = [];

class Particle {
	constructor() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * -canvas.height;
		this.radius = Math.random() * 10;
		this.directionX = this.x;
		this.directionY = this.y;
		this.speed = Math.random() > 0.5 ? -0.1 : 0.1;
	}

	draw() {
		const { x, y, radius } = this;
		ctx.fillStyle = '#ffffff';
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fill();
	}

	update() {
		if (this.y > canvas.height) this.y = this.directionY;
		this.y += 1;

		this.x = this.x + this.speed;
		if (this.x > this.directionX + 10) this.speed *= -1;
		if (this.x < this.directionX - 10) this.speed *= -1;
	}
}

const createParticles = () => {
	for (var i = 0; i < particleCount; i++) {
		particles.push(new Particle());
	}
};
createParticles();

const drawParticles = () => {
	particles.forEach(particle => {
		particle.update();
		particle.draw();
	});
};

const animate = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawParticles();
	requestAnimationFrame(animate);
};
animate();

const button = document.querySelector('button');
button.addEventListener('click', () => {
	console.log('click');
});

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});
