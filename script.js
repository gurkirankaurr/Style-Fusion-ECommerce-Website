/* ── Hamburger Toggle ── */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
    });
  }

  /* ── Cart Badge ── */
  updateCartBadge();

  /* ── Reviews (index page only) ── */
  if (document.getElementById('reviewsContainer')) {
    loadReviews();
  }

  /* ── Scroll-to-top visibility ── */
  window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollToTop');
    if (btn) btn.style.display = window.scrollY > 200 ? 'block' : 'none';
  });
});

/* ── Toast Notification ── */
function showToast(msg, type = 'success') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = msg;
  toast.className = 'toast toast-' + type;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

/* ── Cart Helpers ── */
function getCart() {
  return JSON.parse(localStorage.getItem('sfCart')) || [];
}
function saveCart(cart) {
  localStorage.setItem('sfCart', JSON.stringify(cart));
  updateCartBadge();
}
function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-block' : 'none';
  });
}
function addToCart(name, price, img) {
  const cart = getCart();
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, img, qty: 1 });
  }
  saveCart(cart);
  showToast(`"${name}" added to cart! 🛒`);
}

/* ── Reviews ── */
function submitReview() {
  const name = document.getElementById('reviewName').value.trim();
  const rating = parseInt(document.getElementById('rating').value);
  const text = document.getElementById('review').value.trim();
  if (!name || !text) { showToast('Please fill all review fields.', 'error'); return false; }
  const review = { name, rating, text, date: new Date().toLocaleDateString() };
  const reviews = JSON.parse(localStorage.getItem('sfReviews')) || [];
  reviews.push(review);
  localStorage.setItem('sfReviews', JSON.stringify(reviews));
  displayReview(review);
  document.getElementById('reviewForm').reset();
  showToast('Thanks for your review! ⭐');
  return false;
}
function loadReviews() {
  const reviews = JSON.parse(localStorage.getItem('sfReviews')) || [];
  reviews.forEach(displayReview);
}
function displayReview(review) {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'review-item';
  div.innerHTML = `
    <div class="review-header">
      <strong>${review.name}</strong>
      <span class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
      <small>${review.date}</small>
    </div>
    <p>${review.text}</p>`;
  container.appendChild(div);
}

/* ── Scroll to Top ── */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Contact Form Validation ── */
function validateContactForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !email || !message) { showToast('Please fill all fields.', 'error'); return false; }
  if (!emailPattern.test(email)) { showToast('Please enter a valid email.', 'error'); return false; }
  showToast('Message sent successfully! We\'ll get back to you soon. ✅');
  document.getElementById('contactForm').reset();
  return false;
}

/* ── Search ── */
function filterProducts() {
  const q = document.getElementById('search-bar').value.toLowerCase();
  document.querySelectorAll('.product[data-name]').forEach(p => {
    p.style.display = p.dataset.name.toLowerCase().includes(q) ? '' : 'none';
  });
}
