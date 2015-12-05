/**
 * Slideshow
 */
var Slideshow = function (el) {
    var self = this;

    this.wrapper = el;
	this.slideshow = el.getElementsByTagName('ul')[0];

    /////////////////
    // Create bullets
    this.nav = document.createElement('nav');
    this.nav.className = 'bullets';

    this.generateBullets();

    // Add nav to wrapper
    this.wrapper.appendChild(this.nav);

    // Set active slide class
    this.nav.getElementsByTagName('a')[this.currPage() - 1].className = 'active';

    // Update active slide class
    this.onScrollEnd(function () {
        var currSelected = self.nav.querySelector('.active');

        if (currSelected) {
            currSelected.className = '';
        }

        self.nav.getElementsByTagName('a')[self.currPage() - 1].className = 'active';
    });

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

    //////////////////////////////////////
    // Snap to nearest slide on scroll end
    this.onScrollEnd(function () {
        self.gotoPage(self.currPage());
    });

    ///////////////////////////
    // Regenerate nav on resize
    // (as number of pages may have changed)
    // and snap to nearest page
    window.addEventListener('resize', function () {
        self.gotoPage(self.currPage());
        self.generateBullets();

        self.nav.getElementsByTagName('a')[self.currPage() - 1].className = 'active';
    });
};

/**
 * Generates the list of bullets
 */
Slideshow.prototype.generateBullets = function () {
    var info = this.getInfo();

    this.nav.innerHTML = '';

    for (var i = 1; i <= info.numPages; i++) {
        this.nav.innerHTML += '<a href="' + i + '">' + i + '</a>';
    }
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
	var totalWidth	= numSlides * slideWidth;
	var numPages	= Math.ceil(totalWidth / pageWidth);

	return {
		slides:		slides,
		numSlides:	numSlides,
		slideWidth:	slideWidth,
		pageWidth:	pageWidth,
		numPages:	numPages,
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
	var currPage = this.currPage();

	return currPage === info.numPages;
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

		timeout = setTimeout(cb, 100);
	});
};
