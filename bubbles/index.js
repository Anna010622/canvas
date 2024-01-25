const canvas = document.querySelector('#canvasConstellation');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const PARTICLE_COUNT = 100;
const particles = [];

class Particle {
	constructor() {
		this.radius = Math.random() * 30 + 1;
		this.x = Math.floor(
			Math.random() * (canvas.width - this.radius * 2) + this.radius
		);
		this.y = Math.floor(
			Math.random() * (canvas.height - this.radius * 2) + this.radius
		);
		this.dx = Math.random() > 0.5 ? 1 : -1;
		this.dy = Math.random() > 0.5 ? 1 : -1;
	}

	draw() {
		const { x, y, radius } = this;
		const gradient = ctx.createRadialGradient(
			x,
			y,
			radius,
			Math.floor(x + radius / 2),
			Math.floor(y - radius / 4),
			radius / 5
		);
		gradient.addColorStop(0, 'rgba(60,0,100,0.9)');
		gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
		gradient.addColorStop(1, 'rgba(255,255,255,0.9)');
		ctx.beginPath();
		ctx.fillStyle = gradient;
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fill();
	}

	update() {
		if (this.x + this.radius > canvas.width || this.x - this.radius < 0)
			this.dx *= -1;
		this.x += this.dx;

		if (this.y + this.radius > canvas.height || this.y - this.radius < 0)
			this.dy *= -1;
		this.y += this.dy;
	}
}

const createParticles = () => {
	for (var i = 0; i < PARTICLE_COUNT; i++) {
		particles.push(new Particle());
	}
};
createParticles();

const animate = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	particles.forEach(particle => {
		particle.update();
		particle.draw();
	});
	requestAnimationFrame(animate);
};
animate();

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	particles.length = 0;
	createParticles();
});
