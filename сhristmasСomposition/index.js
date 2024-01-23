import drawSnowman from './snowman.js';
import animateSnowflakes from './snow.js';

const formEl = document.querySelector('.form');
const titleEl = document.querySelector('.title');

let clicked = false;
let inputText = '';

formEl.addEventListener('submit', e => {
	e.preventDefault();
	if (formEl[0].value.toLowerCase() === 'Merry Christmas'.toLowerCase()) {
		clicked = true;
		titleEl.className = 'hidden';
		formEl.className = 'hidden';
		// inputText = '';
	}
	console.log(formEl[0].value);
});

function animate() {
	drawSnowman(inputText);

	if (clicked) {
		animateSnowflakes();
	}

	requestAnimationFrame(animate);
}

window.addEventListener('load', animate);

formEl[0].addEventListener('input', event => {
	inputText = event.target.value;
});
