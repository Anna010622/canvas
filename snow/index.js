const canvas = document.querySelector('#canvasSnow');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const PARTICLE_COUNT = 50;
const particles = [];

class Particle {
	constructor() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * -canvas.height;
		this.radius = Math.random() * 8 + 1;
		this.initialX = this.x;
		this.initialY = this.y;
		this.swayDirection = Math.random() > 0.5 ? -0.1 : 0.1;
		this.color = `rgba(255, 255, 255, ${Math.random() + 0.2})`;
		this.fallingSpeed = Math.random() + 0.5;
	}

	draw() {
		const { x, y, radius, color } = this;

		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fill();
	}

	update() {
		if (this.y > canvas.height) this.y = this.initialY;
		this.y += this.fallingSpeed;

		this.x += this.swayDirection;
		if (this.x > this.initialX + 10 || this.x < this.initialX - 10) {
			this.swayDirection *= -1;
		}
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
