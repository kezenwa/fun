/**
 * Slideshow
 */
var Slideshow = function (el) {
    var self = this;

    this.wrapper = el;
	this.slideshow = el.getElementsByTagName('ul')[0];

    ///////////////////////////
    // Create prev/next buttons
    this.prev = document.createElement('a');
    this.next = document.createElement('a');

    // Allow keyboard navigation/triggering
    this.prev.setAttribute('href', '#');
    this.next.setAttribute('href', '#');

    // For styling
    this.prev.className = 'prev';
    this.prev.innerHTML = '&lt;';
    this.next.className = 'next';
    this.next.innerHTML = '&gt;';

    // Add them to the wrapper
    this.wrapper.appendChild(this.prev);
    this.wrapper.appendChild(this.next);

    /////////////////
    // Create bullets
    this.nav = document.createElement('nav');
    this.nav.className = 'bullets';

    var info = this.getInfo();

    for (var i = 1; i <= info.numPages; i++) {
        this.nav.innerHTML += '<a href="' + i + '">' + i + '</a>';
    }

    // Add nav to wrapper
    this.wrapper.appendChild(this.nav);

    // Set active slide class
    this.nav.getElementsByTagName('a')[this.currPage() - 1].className = 'active';

    // Update active slide class
    this.onScrollEnd(function () {
        self.nav.querySelector('.active').className = '';
        self.nav.getElementsByTagName('a')[self.currPage() - 1].className = 'active';
    });

    ///////////////
    // Click events
    this.wrapper.addEventListener('click', function (e) {
        var clicked = e.target;

        // Prev
        if (clicked.className === 'prev') {
            e.preventDefault();
            self.prevPage();
        }
        else if (clicked.className === 'next') {
            e.preventDefault();
            self.nextPage();
        }
        else if (clicked.parentNode.className === 'bullets') {
            e.preventDefault();
            self.gotoPage(clicked.getAttribute('href'));
        }
    });
};

/**
 * Returns a bunch of data about the slider;
 * Number of pages and slides, their widths etc
 */
Slideshow.prototype.getInfo = function () {
	var slides		= this.slideshow.children;
	var numSlides	= slides.length;
	var slideWidth	= slides[0].getBoundingClientRect().width; // All slides are assumed to be same width
	var pageWidth	= this.slideshow.getBoundingClientRect().width;
	var numPages	= 0;
	var totalWidth	= numSlides * slideWidth;

	return {
		slides:		slides,
		numSlides:	numSlides,
		slideWidth:	slideWidth,
		pageWidth:	pageWidth,
		numPages:	totalWidth / pageWidth,
		totalWidth:	totalWidth
	};
};

/**
 * Scroll the slider (with or without JS animation depending on CSS support)
 */
Slideshow.prototype.scroll = function (x, y) {
	if (!('scrollBehavior' in document.body.style)) {
		if (typeof createjs != 'undefined' && typeof createjs.Tween != 'undefined') {
			createjs.Tween.get(this.slideshow).to({scrollLeft: x}, 200);

			return;
		}
	}

	this.slideshow.scrollLeft = x;
};

/**
 * Goes to page [num]
 */
Slideshow.prototype.gotoPage = function (num) {
	var info = this.getInfo();

	this.scroll((num - 1) * info.pageWidth);
};

/**
 * Goes to the previous page - or last if on first page
 */
Slideshow.prototype.prevPage = function () {
	if (this.isFirstPage()) {
		this.lastPage();
	}
	else {
		this.gotoPage(this.currPage() - 1);
	}
};

/**
 * Goes to the next page - or first if on last page
 */
Slideshow.prototype.nextPage = function () {
	if (this.isLastPage()) {
		this.firstPage();
	}
	else {
		this.gotoPage(this.currPage() + 1);
	}
};

/**
 * Goes to the first page
 */
Slideshow.prototype.firstPage = function () {
	this.scroll(0);
};

/**
 * Goes to the last page
 */
Slideshow.prototype.lastPage = function () {
	var info = this.getInfo();

	this.scroll(info.totalWidth - info.pageWidth);
};

/**
 * Snaps to nearest page (can be run if user scrolls slider manually)
 */
Slideshow.prototype.snapToPage = function () {
	this.gotoPage(this.currPage());
};

/**
 * Returns which page the slider is on
 */
Slideshow.prototype.currPage = function () {
	var info = this.getInfo();
	var left = this.slideshow.scrollLeft;

	return left ? Math.round(left / info.pageWidth) + 1 : 1;
};

/**
 * Checks whether slider is on first page
 */
Slideshow.prototype.isFirstPage = function () {
	return !this.slideshow.scrollLeft;
};

/**
 * Checks whether slider is at the very end
 * (currPage can still return the last page EVEN if the slider isn't exactly at the end)
 */
Slideshow.prototype.isLastPage = function () {
	var info = this.getInfo();
	var left = this.slideshow.scrollLeft;

	return left == info.totalWidth - info.pageWidth;
};

/**
 * Detects when user has stopped scrolling
 */
Slideshow.prototype.onScrollEnd = function (cb) {
	var timeout = false;

	this.slideshow.addEventListener('scroll', function () {
		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(cb, 250);
	});
};
