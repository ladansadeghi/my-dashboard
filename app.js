/* ── Auth helpers ────────────────────────────────────────────── */

function saveSession(name, email) {
  sessionStorage.setItem('am_user', JSON.stringify({ name, email }));
}

function getSession() {
  const raw = sessionStorage.getItem('am_user');
  return raw ? JSON.parse(raw) : null;
}

function clearSession() {
  sessionStorage.removeItem('am_user');
}

/* ── Page: Login ─────────────────────────────────────────────── */
function initLogin() {
  const form = document.getElementById('loginForm');
  const errEl = document.getElementById('loginError');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showError(errEl, 'Please fill in all fields.');
      return;
    }

    // Simulate login — accept any credentials
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    saveSession(name, email);

    // Brief loading state
    const btn = form.querySelector('.btn-primary');
    btn.textContent = 'Signing in…';
    btn.disabled = true;
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 600);
  });
}

/* ── Page: Sign Up ───────────────────────────────────────────── */
function initSignup() {
  const form = document.getElementById('signupForm');
  const errEl = document.getElementById('signupError');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name     = document.getElementById('name').value.trim();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
      showError(errEl, 'Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      showError(errEl, 'Password must be at least 6 characters.');
      return;
    }

    saveSession(name, email);

    const btn = form.querySelector('.btn-primary');
    btn.textContent = 'Creating account…';
    btn.disabled = true;
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 700);
  });
}

/* ── Page: Dashboard ─────────────────────────────────────────── */
function initDashboard() {
  const user = getSession();
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  // Set avatar initials
  const initials = user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  document.querySelectorAll('.avatar').forEach(el => { el.textContent = initials; });

  // Greet
  const greetEl = document.getElementById('greetName');
  if (greetEl) greetEl.textContent = user.name.split(' ')[0];

  // Live date
  const dateEl = document.getElementById('headerDate');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', function () {
    clearSession();
    window.location.href = 'index.html';
  });

  // Sidebar nav
  document.querySelectorAll('.nav-item[data-section]').forEach(item => {
    item.addEventListener('click', function () {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      this.classList.add('active');

      const label = this.querySelector('.nav-label');
      if (label) {
        document.getElementById('sectionTitle').textContent = label.textContent;
      }

      // Close mobile sidebar
      closeSidebar();
    });
  });

  // Mobile sidebar toggle
  const toggle  = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  });

  overlay.addEventListener('click', closeSidebar);

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  }

  // Animate stat counters
  document.querySelectorAll('.count-up').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}

/* ── Utility ─────────────────────────────────────────────────── */
function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}
