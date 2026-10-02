const photos = [...document.querySelectorAll('.polaroid')];
const box = document.querySelector('.lightbox');
const img = box.querySelector('img');
const caption = box.querySelector('figcaption');
let current = 0;
let opener = null;

function show(i) {
  current = (i + photos.length) % photos.length;
  const p = photos[current];
  const src = p.querySelector('img');
  img.src = src.src;
  img.alt = src.alt;
  caption.textContent = p.querySelector('span').textContent;
  const card = box.querySelector('.lb-card');
  card.style.animation = 'none';
  card.offsetWidth; // restart pop animation
  card.style.animation = '';
}

function open(i) {
  opener = photos[i];
  show(i);
  box.hidden = false;
  document.body.style.overflow = 'hidden';
  box.querySelector('.lb-next').focus();
}

function close() {
  box.hidden = true;
  document.body.style.overflow = '';
  if (opener) opener.focus();
}

photos.forEach((p, i) => p.addEventListener('click', () => open(i)));
box.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); show(current - 1); });
box.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); show(current + 1); });
box.addEventListener('click', e => { if (e.target === box) close(); });

document.addEventListener('keydown', e => {
  if (box.hidden) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});
