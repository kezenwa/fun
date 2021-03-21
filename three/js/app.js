'use strict';

///////
// Bg3d
import Bg3d from './bg3d.js';

window.bg3d = new Bg3d(document.getElementById('bg'));

function render () {
	window.bg3d.render();
	requestAnimationFrame(render);
}

render();

////////////
// Splitting
Splitting({
	target: 'h1, h2',
	by: 'chars'
});

////////////
// Scrollspy
const scrollspyObserver = new IntersectionObserver(entries => entries.forEach(entry => {
	if (entry.isIntersecting) {
		entry.target.classList.add('in-view');
	}
	else {
		entry.target.classList.remove('in-view');
	}
}), {threshold: 0.25});

document.querySelectorAll('section').forEach(el => {
	scrollspyObserver.observe(el);
});

////////////
// Set theme
const allThemes = [];
const allThemeButtons = document.querySelectorAll('[data-set-theme]');

allThemeButtons.forEach(el => {
	const theme = el.dataset.setTheme;

	allThemes.push(theme);

	if (document.documentElement.classList.contains('theme-' + theme)) {
		el.classList.add('active');
	}

	el.addEventListener('click', e => {
		allThemes.forEach(t => document.documentElement.classList.remove('theme-' + t));
		allThemeButtons.forEach(tb => tb.classList.remove('active'));

		document.documentElement.classList.add('theme-' + theme);
		el.classList.add('active');
	});
});

////////////////////
// Highlight visible
document.querySelectorAll('[data-highlight-visible]').forEach(el => {
	const links = el.querySelectorAll('a[href^="#"]');
	const targets = document.querySelectorAll(Array.from(links).map(link => link.getAttribute('href')).join(', '));
	const observer = new IntersectionObserver(entries => entries.forEach(entry => {
		if (entry.isIntersecting) {
			links.forEach(l => l.classList.remove('active'));
			Array.from(links).filter(l => l.getAttribute('href') === '#' + entry.target.id)[0].classList.add('active');
		}
		else {
			Array.from(links).filter(l => l.getAttribute('href') === '#' + entry.target.id)[0].classList.remove('active');
		}
	}), {threshold: 0.25});

	targets.forEach(t => observer.observe(t));
});

document.documentElement.classList.add('loaded');
