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
var autoThemeEnabled = true;
const allThemes = [];
const allThemeButtons = document.querySelectorAll('[data-set-theme]');

allThemeButtons.forEach(el => {
	const theme = el.dataset.setTheme;

	allThemes.push(theme);

	if (document.documentElement.classList.contains('theme-' + theme)) {
		el.classList.add('active');
	}

	el.addEventListener('click', e => {
		if (e.x !== 0 && e.y !== 0) {
			autoThemeEnabled = false;
		}

		allThemes.forEach(t => document.documentElement.classList.remove('theme-' + t));
		allThemeButtons.forEach(tb => tb.classList.remove('active'));

		document.documentElement.classList.add('theme-' + theme);
		el.classList.add('active');
	});
});

// Auto theme
const autoThemeObserver = new IntersectionObserver(entries => entries.forEach(entry => {
	if (entry.isIntersecting && autoThemeEnabled) {
		const active = Array.from(allThemeButtons).filter(tb => tb.dataset.setTheme === entry.target.dataset.autoTheme);

		if (active) {
			active[0].click();
		}
	}
}), {threshold: 0.25});

document.querySelectorAll('[data-auto-theme]').forEach(el => {
	autoThemeObserver.observe(el);
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
