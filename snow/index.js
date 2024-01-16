const canvas = document.querySelector('#canvasSnow');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particles = [];
const image = document.querySelector('.snowflake');
const frameSize = 500;
let particleCount = 0;

const changeParticleCount = () => {
	if (canvas.width < 768) particleCount = 15;
	if (canvas.width >= 768) particleCount = 25;
	if (canvas.width >= 1200) particleCount = 35;
};
changeParticleCount();

class Particle {
	constructor() {
		this.size = Math.floor(Math.random() * 35 + 10);
		this.x = Math.floor(
			Math.random() * (canvas.width - this.size / 2) + this.size / 2
		);
		this.y = Math.floor(Math.random() * -canvas.height);
		this.initialX = this.x;
		this.initialY = this.y;
		this.sway = Math.random() > 0.5 ? -0.01 : 0.01;
		this.swayAngle = 0;
		this.fallingSpeed = Math.random() + 0.5;
		this.angle = 0;
		this.spin = Math.random() > 0.5 ? 0.3 : -0.3;
		this.frameX = Math.floor(Math.random() * 2) * frameSize;
		this.frameY = Math.floor(Math.random() * 3) * frameSize;
		this.center = -this.size / 2;
	}

	draw() {
		const { x, y, size, frameX, frameY, angle, center } = this;

		ctx.save();
		ctx.translate(x, y);
		ctx.rotate((angle * Math.PI) / 180);
		ctx.drawImage(
			image,
			frameX,
			frameY,
			frameSize,
			frameSize,
			center,
			center,
			size,
			size
		);
		ctx.restore();
	}

	update() {
		if (this.y > canvas.height + this.size) this.y = this.initialY;
		this.y += this.fallingSpeed;

		this.x = this.x + Math.sin(this.swayAngle) / 2;
		this.swayAngle += this.sway;

		this.angle += this.spin;
	}
}

const createParticles = () => {
	for (var i = 0; i < particleCount; i++) {
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
	changeParticleCount();
	createParticles();
});
