if (document.querySelector('#gallery-grid') && document.querySelector('#gallery-extra')) {
const gallery = [
  ['burger', 'Burger combo'], ['friedshrimp', 'Fried shrimp'],
  ['fried-rice', 'Shrimp fried rice'], ['lomein', 'Lo mein'],
  ['friedfish', 'Fried fish'], ['philly', 'Philly cheesesteak'],
  ['philly-combo', 'Philly combo'], ['hibachi', 'Hibachi'],
  ['fried-fish', 'Fish with rice'], ['wings', 'Chicken wings'],
  ['wings-combo-rice', 'Wings with fried rice'], ['wing-combo-fries', 'Wings with fries']
];
const dialog = document.querySelector('#photo-dialog');
let lastPhotoButton;
gallery.forEach(([file, title], index) => {
  const button = document.createElement('button');
  button.className = 'gallery-item';
  button.type = 'button';
  button.setAttribute('aria-label', `View photo: ${title}`);
  button.innerHTML = `<span class="gallery-image"><img src="assets/gallery-${file}.webp" alt="${title}" width="400" height="400" loading="lazy"><span class="expand-icon" aria-hidden="true">+</span></span><span class="gallery-title">${title}</span>`;
  button.addEventListener('click', () => {
    lastPhotoButton = button;
    document.querySelector('#dialog-image').src = `assets/gallery-${file}.webp`;
    document.querySelector('#dialog-image').alt = title;
    document.querySelector('#photo-title').textContent = title;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
  document.querySelector(index < 4 ? '#gallery-grid' : '#gallery-extra').append(button);
});
const more = document.querySelector('#gallery-more');
more.addEventListener('click', () => {
  const expanded = more.getAttribute('aria-expanded') === 'true';
  more.setAttribute('aria-expanded', String(!expanded));
  document.querySelector('#gallery-extra').hidden = expanded;
  more.innerHTML = expanded ? 'MORE FROM THE KITCHEN <span aria-hidden="true">+</span>' : 'SHOW FEWER PHOTOS <span aria-hidden="true">−</span>';
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  lastPhotoButton?.focus();
});
}

const toggle = document.querySelector('.mobile-toggle');
const nav = document.querySelector('#mobile-nav');
if (toggle && nav) {
function closeNav() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  nav.hidden = true;
}
toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  toggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  nav.hidden = expanded;
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !nav.hidden) { closeNav(); toggle.focus(); }
});
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function createRotation({ root, controls, count, delay, render, pauseLabel, playLabel }) {
  let index = 0;
  let paused = reducedMotion.matches;
  let hovered = false;
  let focused = false;
  let visible = false;
  let timer;
  const pauseButton = controls.querySelector('[data-pause]');
  controls.hidden = false;

  function schedule() {
    clearTimeout(timer);
    pauseButton.textContent = paused ? playLabel : pauseLabel;
    if (!paused && !hovered && !focused && visible && !document.hidden) {
      timer = setTimeout(() => {
        index = (index + 1) % count;
        render(index);
        schedule();
      }, delay);
    }
  }
  function select(next) {
    paused = true;
    index = (next + count) % count;
    render(index);
    schedule();
  }
  controls.querySelector('[data-prev]').addEventListener('click', () => select(index - 1));
  controls.querySelector('[data-next]').addEventListener('click', () => select(index + 1));
  pauseButton.addEventListener('click', () => { paused = !paused; schedule(); });
  root.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') { hovered = true; schedule(); }
  });
  root.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  root.addEventListener('focusin', () => { focused = true; schedule(); });
  root.addEventListener('focusout', event => {
    focused = root.contains(event.relatedTarget);
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; schedule(); });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    schedule();
  }, { threshold: 0.15 }).observe(root);
  render(index);
  schedule();
  return { select };
}

const menu = document.querySelector('#menu');
const menuGroups = Array.from(menu.querySelectorAll('.menu-group'));
const groupButtons = Array.from(menu.querySelectorAll('[data-menu-group]'));
const menuRotation = createRotation({
  root: menu,
  controls: menu.querySelector('.menu-controls'),
  count: menuGroups.length,
  delay: 9000,
  pauseLabel: 'Pause rotation',
  playLabel: 'Play rotation',
  render(index) {
    menuGroups.forEach((group, i) => { group.hidden = i !== index; });
    groupButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  }
});
groupButtons.forEach(button => button.addEventListener('click', () => menuRotation.select(Number(button.dataset.menuGroup))));

const story = document.querySelector('#story');
const storyImage = story.querySelector('.story-photo > img');
const featuredDishes = [
  { image: 'assets/gallery-philly-combo.webp', name: 'PHILLY COMBO', alt: 'Philly sandwich, crinkle-cut fries, and Coca-Cola' },
  ...Array.from(menu.querySelectorAll('.food-card')).map(card => ({
    image: card.querySelector('img').getAttribute('src'),
    name: card.querySelector('h3').textContent,
    alt: card.querySelector('img').alt
  }))
];
createRotation({
  root: story,
  controls: story.querySelector('.story-controls'),
  count: featuredDishes.length,
  delay: 6000,
  pauseLabel: 'Pause photos',
  playLabel: 'Play photos',
  render(index) {
    const dish = featuredDishes[index];
    storyImage.src = dish.image;
    storyImage.alt = dish.alt;
    story.querySelector('#story-item-name').textContent = dish.name;
    story.querySelector('.story-order-name').textContent = dish.name;
    story.querySelector('.story-order').setAttribute('aria-label', `Order ${dish.name.toLowerCase()}`);
  }
});
