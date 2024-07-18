class ScrollProgress {
  constructor() {
    this.lenis = null;
    this.percentage = 0;
    this.progressBar = {
      element: document.querySelector('.timeline-indicator'),
      line: document.querySelector('.timeline-progress__fill'),
      dots: document.querySelectorAll('.timeline-dot'),
      labels: document.querySelectorAll('.timeline-indicator-label'),
    };
    this.progressBarOffset =
      (this.progressBar.element.getBoundingClientRect().left /
        window.innerWidth) *
      100;
    this.video = document.querySelector('.video');
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    this.init();
  }

  init() {
    this.initLenis();
    this.lenis.scrollTo(0);
    this.video.play();
    window.addEventListener('DOMContentLoaded', this.initLenis.bind(this));
  }

  initLenis() {
    this.lenis = new Lenis({
      lerp: 0.05,
      smoothWheel: true,
      WheelMultiplier: 1,
      smoothTouch: true,
      touchMultiplier: 2,
      content: document.querySelector('.content'),
      orientation: this.isMobile ? 'vertical' : 'horizontal',
    });

    this.lenis.on('scroll', ({ scroll, limit }) =>
      this.progress(scroll, limit)
    );
    requestAnimationFrame(this.raf.bind(this));
  }

  raf(time) {
    this.lenis.raf(time);
    requestAnimationFrame(this.raf.bind(this));
  }

  activeKeyPoints(keypoints, element) {
    if (this.percentage >= keypoints) {
      element.classList.add('--active');
    } else {
      element.classList.remove('--active');
    }
  }

  progress(scroll, limit) {
    let keypoints = [];
    let scrollPercentage = (scroll / limit) * 100;

    this.progressBar.dots.forEach((dot) => {
      const dotPosition = dot.getBoundingClientRect().left;
      const keypointsPercentage =
        ((dotPosition - this.progressBarOffset) / window.innerWidth) * 100;

      keypoints.push(keypointsPercentage);
    });

    this.percentage =
      keypoints[0] + (scrollPercentage * (100 - keypoints[0])) / 100;
    this.progressBar.line.style.width = `${this.percentage}%`;
    this.progressBar.dots.forEach((dot, index) =>
      this.activeKeyPoints(keypoints[index], dot)
    );
    this.progressBar.labels.forEach((label, index) =>
      this.activeKeyPoints(keypoints[index], label)
    );
  }
}

new ScrollProgress();
