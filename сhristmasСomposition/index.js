import drawSnowman from './snowman.js';
import animateSnowflakes from './snow.js';

let clicked = false;
const formEl = document.querySelector('.form');
formEl.addEventListener('submit', e => {
	e.preventDefault();
	clicked = true;
	console.log('click');
});

function animate() {
	drawSnowman();

	if (clicked) {
		animateSnowflakes();
	}

	requestAnimationFrame(animate);
}

window.addEventListener('load', animate);
