/* =========================================================================
   Versi frontend statis (untuk Vercel).
   Halaman ini hasil render dari versi PHP. Form tidak dikirim ke server;
   login demo langsung membuka dashboard, aksi lain menampilkan pemberitahuan.
   ========================================================================= */
(function () {
  function root() {
    var s = document.querySelector('script[src$="static-demo.js"]');
    return s ? s.getAttribute('src').replace('assets/js/static-demo.js', '') : '';
  }
  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'demo-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 10);
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 300); }, 3200);
  }
  var css = document.createElement('style');
  css.textContent = '.demo-toast{position:fixed;left:50%;bottom:96px;transform:translate(-50%,20px);opacity:0;z-index:9999;' +
    'background:#0F3D33;color:#fff;padding:12px 18px;border-radius:12px;font-size:.9rem;box-shadow:0 10px 24px rgba(0,0,0,.2);' +
    'transition:opacity .25s,transform .25s;max-width:90vw;text-align:center}.demo-toast.show{opacity:1;transform:translate(-50%,0)}';
  document.head.appendChild(css);

  document.addEventListener('submit', function (ev) {
    var form = ev.target;
    var action = form.getAttribute('action') || '';
    if (action.indexOf('#demo-') !== 0) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    var kind = action.slice(6);
    if (kind === 'login') {
      var email = (form.querySelector('[name=email]') || {}).value || '';
      location.href = root() + (email.indexOf('admin') === 0 ? 'admin/index.html' : 'dashboard.html');
    } else if (kind === 'register') {
      location.href = root() + 'dashboard.html';
    } else if (kind === 'logout') {
      location.href = root() + 'index.html';
    } else {
      toast('Ini versi tampilan (frontend). Fitur ini berjalan di versi PHP + MySQL.');
    }
  }, true);

  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href^="#demo-"]');
    if (!a) return;
    ev.preventDefault();
    toast('Ini versi tampilan (frontend). Fitur ini berjalan di versi PHP + MySQL.');
  }, true);
})();
