let lenis;
let percentage;

const progressBar = {
  element: document.querySelector('.section_bar'),
  line: document.querySelector('.section_bar_line_filled'),
  dots: document.querySelectorAll('.section_bar_line_dot'),
  labels: document.querySelectorAll('.section_bar_label_item'),
};

const progressBarOffset =
  (progressBar.element.getBoundingClientRect().left / window.innerWidth) * 100;

const video = document.querySelector('.section_bg_video');

const isMobile = window.matchMedia('(max-width: 768px)').matches;

const initLenis = () => {
  lenis = new Lenis({
    lerp: 0.05,
    smoothWheel: true,
    WheelMultiplier: 1,
    smoothTouch: true,
    touchMultiplier: 2,

    content: document.querySelector('.section_content'),
    orientation: isMobile ? 'vertical' : 'horizontal',
  });

  lenis.on('scroll', ({ scroll, limit }) => progress(scroll, limit));

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
};

const activeKeyPoints = (keypoints, element) => {
  if (percentage >= keypoints) {
    element.classList.add('--active');
  } else {
    element.classList.remove('--active');
  }
};

const progress = (scroll, limit) => {
  let keypoints = [];
  let scrollPercentage = (scroll / limit) * 100;

  progressBar.dots.forEach((dot) => {
    const dotPosition = dot.getBoundingClientRect().left;
    const keypointsPercentage =
      ((dotPosition - progressBarOffset) / window.innerWidth) * 100;

    keypoints.push(keypointsPercentage);
  });

  percentage = keypoints[0] + (scrollPercentage * (100 - keypoints[0])) / 100;
  progressBar.line.style.width = `${percentage}%`;
  progressBar.dots.forEach((dot, index) =>
    activeKeyPoints(keypoints[index], dot)
  );
  progressBar.labels.forEach((label, index) =>
    activeKeyPoints(keypoints[index], label)
  );
};

window.addEventListener('DOMContentLoaded', () => {
  initLenis();
  lenis.scrollTo(0);
  video.play();
});
