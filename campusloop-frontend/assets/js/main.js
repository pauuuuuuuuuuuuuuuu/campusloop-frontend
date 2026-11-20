/* ==========================================================================
   CampusLoop — main.js
   Interaksi tampilan: menu, validasi form, tab, upload, voucher, LoopGuide.
   Semua memakai DOM (getElementById / querySelector) dan event (onclick,
   onchange, onkeyup, onsubmit) seperti di materi Session 5–6.
   Validasi di sini hanya untuk kenyamanan user; PHP tetap wajib memvalidasi ulang.
   ========================================================================== */

/* ---------- 1. Menu mobile ---------- */
var navToggle = document.getElementById('navToggle');
if (navToggle) {
  navToggle.onclick = function () {
    var header = document.getElementById('siteHeader');
    header.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', header.classList.contains('open'));
  };
}

var sideToggle = document.getElementById('sideToggle');
if (sideToggle) {
  sideToggle.onclick = function (event) {
    event.stopPropagation();
    var app = document.getElementById('app');
    app.classList.toggle('side-open');
    sideToggle.setAttribute('aria-expanded', app.classList.contains('side-open'));
  };
  // Klik di luar sidebar menutup menu (layar kecil)
  document.querySelector('.app-main').onclick = function () {
    document.getElementById('app').classList.remove('side-open');
  };
}

/* ---------- 2. Tampilkan / sembunyikan password ---------- */
function togglePassword(inputId, button) {
  var input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    button.setAttribute('aria-label', 'Sembunyikan password');
  } else {
    input.type = 'password';
    button.setAttribute('aria-label', 'Tampilkan password');
  }
}

/* ---------- 3. Bantuan validasi ---------- */
function setError(inputId, message) {
  var input = document.getElementById(inputId);
  var errorBox = document.getElementById(inputId + 'Error');
  if (message) {
    input.classList.add('is-invalid');
    if (errorBox) { errorBox.textContent = message; errorBox.classList.remove('hidden'); }
    return false;
  }
  input.classList.remove('is-invalid');
  if (errorBox) { errorBox.textContent = ''; errorBox.classList.add('hidden'); }
  return true;
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/* Register: dipanggil lewat onsubmit="return validateRegister()" */
function validateRegister() {
  var ok = true;
  var name = document.getElementById('name').value.trim();
  var email = document.getElementById('email').value.trim();
  var nim = document.getElementById('student_id').value.trim();
  var pass = document.getElementById('password').value;
  var confirmPass = document.getElementById('password_confirm').value;
  var agree = document.getElementById('agree').checked;

  ok = setError('name', name.length < 3 ? 'Nama minimal 3 karakter.' : '') && ok;
  ok = setError('email', !isEmail(email) ? 'Format email belum benar.' : '') && ok;
  ok = setError('student_id', !/^[0-9]{10}$/.test(nim) ? 'NIM harus 10 digit angka.' : '') && ok;
  ok = setError('password', pass.length < 8 ? 'Password minimal 8 karakter.' : '') && ok;
  ok = setError('password_confirm', pass !== confirmPass ? 'Konfirmasi password tidak sama.' : '') && ok;
  ok = setError('agree', !agree ? 'Centang persetujuan untuk melanjutkan.' : '') && ok;
  return ok;
}

/* Login */
function validateLogin() {
  var ok = true;
  ok = setError('email', !isEmail(document.getElementById('email').value.trim()) ? 'Masukkan email yang valid.' : '') && ok;
  ok = setError('password', document.getElementById('password').value === '' ? 'Password wajib diisi.' : '') && ok;
  return ok;
}

/* Kekuatan password (onkeyup) */
function checkStrength(value) {
  var text = document.getElementById('passStrength');
  if (!text) return;
  var score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  var labels = ['Terlalu pendek', 'Lemah', 'Cukup', 'Kuat'];
  text.textContent = value.length === 0 ? 'Minimal 8 karakter.' : 'Kekuatan: ' + labels[score];
}

/* ---------- 4. Penghitung karakter (onkeyup) ---------- */
function countChars(input, counterId, max) {
  var counter = document.getElementById(counterId);
  counter.textContent = input.value.length + '/' + max;
}

/* ---------- 5. Form listing: field berubah sesuai tipe ---------- */
function updateTypeFields() {
  var checked = document.querySelector('input[name="listing_type"]:checked');
  if (!checked) return;
  var type = checked.value;
  document.getElementById('sellFields').classList.toggle('hidden', type !== 'sell');
  document.getElementById('borrowFields').classList.toggle('hidden', type !== 'borrow');
  document.getElementById('donateInfo').classList.toggle('hidden', type !== 'donate');
  document.getElementById('price').required = (type === 'sell');
  document.getElementById('max_borrow_days').required = (type === 'borrow');
}

function validateListing() {
  var ok = true;
  var type = document.querySelector('input[name="listing_type"]:checked').value;
  ok = setError('title', document.getElementById('title').value.trim().length < 5 ? 'Judul minimal 5 karakter.' : '') && ok;
  ok = setError('category_id', document.getElementById('category_id').value === '' ? 'Pilih kategori.' : '') && ok;
  ok = setError('description', document.getElementById('description').value.trim().length < 20 ? 'Deskripsi minimal 20 karakter agar jelas.' : '') && ok;
  ok = setError('location', document.getElementById('location').value.trim() === '' ? 'Isi lokasi ketemuan.' : '') && ok;
  if (type === 'sell') {
    var price = Number(document.getElementById('price').value);
    ok = setError('price', !(price > 0) ? 'Harga harus lebih dari 0.' : '') && ok;
    var transfer = document.getElementById('accepts_transfer').checked;
    var cod = document.getElementById('accepts_cod').checked;
    ok = setError('accepts_transfer', !transfer && !cod ? 'Pilih minimal satu metode pembayaran.' : '') && ok;
  }
  if (type === 'borrow') {
    var days = Number(document.getElementById('max_borrow_days').value);
    ok = setError('max_borrow_days', !(days >= 1 && days <= 60) ? 'Durasi pinjam 1 sampai 60 hari.' : '') && ok;
  }
  return ok;
}

/* ---------- 6. Upload file: cek tipe & ukuran (maks. 2 MB) ---------- */
function checkFile(input, infoId, allowPdf) {
  var info = document.getElementById(infoId);
  var file = input.files[0];
  if (!file) { info.classList.add('hidden'); return; }

  var allowed = ['image/jpeg', 'image/png'];
  if (allowPdf) allowed.push('application/pdf');
  var maxSize = 2 * 1024 * 1024;

  info.classList.remove('hidden');
  if (allowed.indexOf(file.type) === -1) {
    info.innerHTML = '<span class="error-text">Format tidak didukung. Gunakan JPG, PNG' + (allowPdf ? ', atau PDF' : '') + '.</span>';
    input.value = '';
    return;
  }
  if (file.size > maxSize) {
    info.innerHTML = '<span class="error-text">Ukuran file ' + (file.size / 1024 / 1024).toFixed(1) + ' MB. Maksimal 2 MB.</span>';
    input.value = '';
    return;
  }
  info.innerHTML = '<strong>' + file.name + '</strong> <span class="muted small">(' + Math.round(file.size / 1024) + ' KB) siap dikirim</span>';
}

/* ---------- 7. Tab ---------- */
function showTab(button, panelId) {
  var group = button.parentElement;
  var buttons = group.querySelectorAll('.tab-btn');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('active');
    buttons[i].setAttribute('aria-selected', 'false');
    document.getElementById(buttons[i].getAttribute('data-panel')).classList.add('hidden');
  }
  button.classList.add('active');
  button.setAttribute('aria-selected', 'true');
  document.getElementById(panelId).classList.remove('hidden');
}

/* ---------- 8. Salin teks (nomor rekening, kode voucher) ---------- */
function copyText(text, button) {
  var original = button.innerHTML;
  function done() {
    button.innerHTML = 'Tersalin';
    setTimeout(function () { button.innerHTML = original; }, 1500);
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(done, function () { window.prompt('Salin manual:', text); });
  } else {
    window.prompt('Salin manual:', text);
  }
}

/* ---------- 9. Voucher: hitung ulang total (diskon maks. 50%) ---------- */
function applyVoucher(select, price) {
  var discount = Number(select.value === '' ? 0 : select.options[select.selectedIndex].getAttribute('data-amount'));
  var maxDiscount = price * 0.5;
  var note = document.getElementById('voucherNote');
  if (discount > maxDiscount) {
    discount = maxDiscount;
    note.textContent = 'Potongan dibatasi 50% dari harga.';
  } else {
    note.textContent = discount > 0 ? 'Voucher akan terpakai setelah kamu menyimpan.' : '';
  }
  document.getElementById('discountText').textContent = '-' + formatRupiah(discount);
  document.getElementById('totalText').textContent = formatRupiah(price - discount);
}

function formatRupiah(n) {
  return 'Rp' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/* ---------- 10. Tolak bukti bayar: alasan wajib diisi ---------- */
function showRejectForm() {
  document.getElementById('rejectForm').classList.remove('hidden');
  document.getElementById('rejection_reason').focus();
}

function validateReject() {
  return setError('rejection_reason', document.getElementById('rejection_reason').value.trim().length < 10 ? 'Tulis alasan minimal 10 karakter agar pembeli paham.' : '');
}

/* ---------- 11. Filter browse: rentang harga hanya untuk tipe Jual ---------- */
function updatePriceFilter() {
  var type = document.querySelector('input[name="type"]:checked');
  var box = document.getElementById('priceFilter');
  if (box && type) box.classList.toggle('hidden', !(type.value === '' || type.value === 'sell'));
}

/* ---------- 12. LoopGuide: kirim pertanyaan ke PHP tanpa reload (fetch) ----------
   Alur: JS -> actions/loopguide.php -> (API AI atau pembaca kalimat PHP) -> query MySQL
   -> balasan JSON -> ditampilkan di sini. Jika JS mati, form tetap terkirim biasa. */
function askGuide(text) {
  document.getElementById('guideInput').value = text;
  return sendGuide();
}

function addBubble(type, html) {
  var body = document.getElementById('chatBody');
  var bubble = document.createElement('div');
  bubble.className = 'msg ' + type;
  bubble.innerHTML = html;
  body.appendChild(bubble);
  body.scrollTop = body.scrollHeight;
  return bubble;
}

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function sendGuide() {
  var input = document.getElementById('guideInput');
  var form = document.getElementById('guideForm');
  var text = input.value.trim();
  if (text === '') return false;
  if (!window.fetch) return true; // browser lama: kirim form biasa

  addBubble('user', escapeHtml(text));
  input.value = '';
  var waiting = addBubble('bot typing', 'Sedang mencari...');

  var data = new FormData(form);
  data.set('message', text);
  data.set('ajax', '1');

  fetch(form.getAttribute('action'), { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
    .then(function (res) { return res.json(); })
    .then(function (json) {
      waiting.className = 'msg bot';
      waiting.innerHTML = json.html;   // HTML sudah di-escape di PHP
      document.getElementById('chatBody').scrollTop = 99999;
    })
    .catch(function () {
      waiting.className = 'msg bot';
      waiting.innerHTML = 'LoopGuide sedang tidak bisa dihubungi. Coba <a href="browse.php">filter pencarian biasa</a>.';
    });
  return false;
}

/* ---------- 13. Carousel info & promo ----------
   - Tombol panah & titik: scrollTo ke slide tujuan
   - Titik aktif diperbarui saat track digeser (event scroll)
   - Autoplay tiap 6 detik, berhenti saat kursor di atas / disentuh / tab tidak aktif
   - Drag dengan mouse di desktop (pointer events); di HP cukup swipe biasa */
function initSlider(root) {
  var track = root.querySelector('.promo-track');
  var slides = root.querySelectorAll('.promo-slide');
  var dots = root.querySelectorAll('.promo-dot');
  var arrows = root.querySelectorAll('.promo-arrow');
  var current = 0;
  var timer = null;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function updateDots() {
    var closest = 0, best = Infinity;
    for (var i = 0; i < slides.length; i++) {
      var distance = Math.abs(slides[i].offsetLeft - track.offsetLeft - track.scrollLeft);
      if (distance < best) { best = distance; closest = i; }
    }
    current = closest;
    for (var j = 0; j < dots.length; j++) {
      dots[j].classList.toggle('active', j === current);
      dots[j].setAttribute('aria-selected', j === current ? 'true' : 'false');
    }
  }

  function start() {
    if (reduceMotion || timer) return;
    timer = setInterval(function () { goTo(current + 1); }, 6000);
  }
  function stop() { clearInterval(timer); timer = null; }

  for (var a = 0; a < arrows.length; a++) {
    arrows[a].onclick = function () { stop(); goTo(current + Number(this.getAttribute('data-dir'))); };
  }
  for (var d = 0; d < dots.length; d++) {
    dots[d].onclick = function () { stop(); goTo(Number(this.getAttribute('data-index'))); };
  }

  var scrollWait;
  track.addEventListener('scroll', function () {
    clearTimeout(scrollWait);
    scrollWait = setTimeout(updateDots, 60);
  });

  // keyboard: panah kiri/kanan saat track fokus
  track.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') { stop(); goTo(current + 1); event.preventDefault(); }
    if (event.key === 'ArrowLeft') { stop(); goTo(current - 1); event.preventDefault(); }
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  track.addEventListener('touchstart', stop, { passive: true });
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

  // drag dengan mouse
  var dragging = false, startX = 0, startScroll = 0, moved = 0;
  track.addEventListener('pointerdown', function (event) {
    if (event.pointerType !== 'mouse') return;
    dragging = true; moved = 0;
    startX = event.clientX; startScroll = track.scrollLeft;
    stop();
  });
  window.addEventListener('pointermove', function (event) {
    if (!dragging) return;
    moved = event.clientX - startX;
    if (Math.abs(moved) > 4) track.classList.add('dragging');
    track.scrollLeft = startScroll - moved;
  });
  window.addEventListener('pointerup', function () {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('dragging');
    var next = current;
    if (moved < -50) next = current + 1;
    if (moved > 50) next = current - 1;
    goTo(Math.max(0, Math.min(slides.length - 1, next)));
  });
  // cegah klik link setelah drag
  track.addEventListener('click', function (event) {
    if (Math.abs(moved) > 6) { event.preventDefault(); moved = 0; }
  }, true);

  start();
}

var sliders = document.querySelectorAll('[data-slider]');
for (var s = 0; s < sliders.length; s++) initSlider(sliders[s]);

/* ---------- 14. Form request pinjam: batasi tanggal kembali ---------- */
function checkBorrowDate(input, maxDays) {
  var chosen = new Date(input.value);
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var diff = Math.round((chosen - today) / 86400000);
  return setError(input.id, !(diff >= 1 && diff <= maxDays) ? 'Pilih tanggal 1 sampai ' + maxDays + ' hari dari hari ini.' : '');
}

/* ---------- 15. Pratinjau foto listing sebelum upload ---------- */
function previewImage(input, boxId) {
  var box = document.getElementById(boxId);
  if (!box || !input.files[0] || !input.files[0].type.match(/^image\//)) return;
  var reader = new FileReader();
  reader.onload = function (event) {
    box.innerHTML = '<img src="' + event.target.result + '" alt="Pratinjau foto">';
    box.classList.remove('hidden');
  };
  reader.readAsDataURL(input.files[0]);
}
