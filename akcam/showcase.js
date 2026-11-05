/* AK CAMERA トップ・作例・仕様の動き。外部のライブラリは使わない */
(function () {
  'use strict';
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* スクロールで現れる */
  var targets = $$('.rv, .rv-img');
  if ('IntersectionObserver' in window && !calm) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .05 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }

  /* ナビと現在地 */
  var nav = $('.sc-nav');
  var spy = $$('.sc-links a[href^="#"], .pf-tabs a[href^="#"]').map(function (a) {
    return { a: a, el: $(a.getAttribute('href')) };
  }).filter(function (x) { return x.el; });
  var heroBottom = function () { var h = $('.hero2'); return h ? h.offsetHeight - 80 : 40; };

  /* 大きい文字と全面写真はスクロールに合わせて動かす */
  var words = $$('.bigword span');
  var bleeds = $$('.bleed > img');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.pageYOffset, vh = window.innerHeight;
    if (nav) nav.classList.toggle('solid', y > heroBottom());
    var cur = null;
    spy.forEach(function (s) { if (s.el.getBoundingClientRect().top < vh * .4) cur = s; });
    spy.forEach(function (s) {
      var on = s === cur;
      if (on && !s.a.classList.contains('on')) {
        var ul = s.a.closest('ul');
        if (ul && ul.scrollWidth > ul.clientWidth) ul.scrollTo({ left: s.a.parentNode.offsetLeft - 24, behavior: 'smooth' });
      }
      s.a.classList.toggle('on', on);
    });
    if (calm) return;
    words.forEach(function (w, i) {
      var r = w.parentNode.getBoundingClientRect();
      if (r.bottom < -40 || r.top > vh + 40) return;
      var p = (r.top - vh / 2) / vh;
      w.style.transform = 'translate3d(' + (p * (i % 2 ? -22 : 22) - 6) + '%,0,0)';
    });
    bleeds.forEach(function (b) {
      var r = b.parentNode.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      b.style.transform = 'translate3d(0,' + (p * -6) + '%,0)';
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* トップの写真の切り替えと撮影情報 */
  var slides = $$('.hero2 .slide');
  if (slides.length) {
    var info = $('.vf .data'), af = $('.af'), si = 0;
    var show = function (i) {
      slides[si].classList.remove('on');
      si = i;
      var s = slides[si], c = s.firstElementChild, n = c.cloneNode(true);
      s.replaceChild(n, c); // 動きを最初からやり直す
      s.classList.add('on');
      if (info) info.textContent = s.getAttribute('data-info');
      if (af) {
        af.classList.remove('lock');
        window.setTimeout(function () { af.classList.add('lock'); }, 700);
      }
    };
    show(0);
    if (!calm && slides.length > 1) window.setInterval(function () { show((si + 1) % slides.length); }, 7000);
  }

  /* 数字 */
  $$('.stat b[data-n]').forEach(function (b) {
    var end = parseInt(b.getAttribute('data-n'), 10);
    if (calm || !end || !('IntersectionObserver' in window)) return;
    var o = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      o.disconnect();
      var t0 = performance.now(), d = 1100;
      (function step(t) {
        var k = Math.min(1, (t - t0) / d);
        b.textContent = String(Math.round(end * (1 - Math.pow(1 - k, 3))));
        if (k < 1) window.requestAnimationFrame(step);
      })(t0);
    }, { threshold: .4 });
    o.observe(b);
  });

  /* ルックの切り替え */
  $$('[data-looker]').forEach(function (w) {
    var imgs = $$('.looker img', w), cap = $('.looker .cap', w), btns = $$('.chips button', w);
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        imgs.forEach(function (m, k) {
          if (k === i && m.getAttribute('data-src')) { m.src = m.getAttribute('data-src'); m.removeAttribute('data-src'); }
          m.classList.toggle('on', k === i);
        });
        btns.forEach(function (x, k) { x.classList.toggle('on', k === i); x.setAttribute('aria-pressed', k === i); });
        cap.textContent = b.getAttribute('data-cap');
      });
    });
  });

  /* 比べるスライダー */
  $$('.cmp').forEach(function (c) {
    var r = $('input', c), drag = false;
    var set = function (p) {
      p = Math.max(0, Math.min(100, p));
      c.style.setProperty('--x', p + '%');
      if (r) r.value = p;
    };
    var at = function (e) { var b = c.getBoundingClientRect(); set((e.clientX - b.left) / b.width * 100); };
    c.addEventListener('pointerdown', function (e) { drag = true; at(e); });
    window.addEventListener('pointermove', function (e) { if (drag) at(e); });
    window.addEventListener('pointerup', function () { drag = false; });
    window.addEventListener('pointercancel', function () { drag = false; });
    if (r) r.addEventListener('input', function () { set(+r.value); });
    if (!calm && 'IntersectionObserver' in window) {
      var o = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        o.disconnect();
        var t0 = performance.now();
        (function step(t) {
          if (drag) return;
          var k = Math.min(1, (t - t0) / 1800);
          set(50 + Math.sin(k * Math.PI * 2) * 22);
          if (k < 1) window.requestAnimationFrame(step);
        })(t0);
      }, { threshold: .6 });
      o.observe(c);
    }
  });

  /* 等倍ルーペ。元の写真はルーペを初めて使うときに読む */
  $$('.loupe').forEach(function (l) {
    var lens = $('.lens', l), full = l.getAttribute('data-full'), W = +l.getAttribute('data-w'), H = +l.getAttribute('data-h'), loaded = false;
    var move = function (e) {
      var b = l.getBoundingClientRect();
      var x = Math.max(0, Math.min(1, (e.clientX - b.left) / b.width)), y = Math.max(0, Math.min(1, (e.clientY - b.top) / b.height));
      if (!loaded) { loaded = true; lens.style.backgroundImage = 'url(' + full + ')'; }
      lens.style.left = x * 100 + '%';
      lens.style.top = y * 100 + '%';
      var s = lens.offsetWidth;
      lens.style.backgroundSize = W + 'px ' + H + 'px';
      lens.style.backgroundPosition = (s / 2 - x * W) + 'px ' + (s / 2 - y * H) + 'px';
      l.classList.add('on');
    };
    l.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') move(e); });
    l.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') l.classList.remove('on'); });
    l.addEventListener('click', move);
  });

  /* 画面写真の切り替え */
  $$('[data-tabs]').forEach(function (w) {
    var imgs = $$('.phone img', w), btns = $$('.chips button', w), text = $('[data-tabtext]', w);
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        imgs.forEach(function (m, k) { m.classList.toggle('on', k === i); });
        btns.forEach(function (x, k) { x.classList.toggle('on', k === i); x.setAttribute('aria-pressed', k === i); });
        if (text) text.textContent = b.getAttribute('data-cap');
      });
    });
  });

  /* 横送り */
  $$('.car').forEach(function (c) {
    var track = $('.car-track', c), figs = $$('figure', track), th = $$('.car-thumbs button', c), cur = 0;
    var mark = function (i) {
      cur = i;
      th.forEach(function (b, k) { b.classList.toggle('on', k === i); });
      if (th[i]) { var p = th[i].parentNode; p.scrollTo({ left: th[i].offsetLeft - p.clientWidth / 2 + 42, behavior: 'smooth' }); }
    };
    var go = function (i) {
      i = (i + figs.length) % figs.length;
      track.scrollTo({ left: figs[i].offsetLeft - track.offsetLeft, behavior: calm ? 'auto' : 'smooth' });
      mark(i);
    };
    th.forEach(function (b, i) { b.addEventListener('click', function () { go(i); }); });
    var p = $('.car-arrow.p', c), n = $('.car-arrow.n', c);
    if (p) p.addEventListener('click', function () { go(cur - 1); });
    if (n) n.addEventListener('click', function () { go(cur + 1); });
    var t;
    track.addEventListener('scroll', function () {
      window.clearTimeout(t);
      t = window.setTimeout(function () {
        var i = Math.round(track.scrollLeft / (figs[0].offsetWidth + 10));
        if (i !== cur) mark(Math.min(i, figs.length - 1));
      }, 120);
    }, { passive: true });
    mark(0);
  });

  /* 拡大表示 */
  var links = $$('a.zoom');
  if (links.length) {
    var box = document.createElement('div');
    box.id = 'lb2';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', '写真の拡大表示');
    box.innerHTML = '<div class="stage"><img alt=""></div><div class="bar"><button class="p" aria-label="前の写真">‹</button><button class="n" aria-label="次の写真">›</button><span></span><button class="x" aria-label="閉じる">×</button></div>';
    document.body.appendChild(box);
    var im = $('img', box), label = $('span', box), idx = 0;
    var open = function (i) {
      idx = (i + links.length) % links.length;
      var a = links[idx], cap = a.parentNode.querySelector('figcaption');
      im.src = a.getAttribute('href');
      im.alt = a.querySelector('img').alt;
      label.textContent = (idx + 1) + ' / ' + links.length + (cap ? '　' + cap.textContent : '');
      box.classList.add('on');
      document.documentElement.style.overflow = 'hidden';
    };
    var close = function () {
      box.classList.remove('on');
      document.documentElement.style.overflow = '';
      im.removeAttribute('src');
    };
    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) { e.preventDefault(); open(i); });
    });
    $('.x', box).addEventListener('click', close);
    $('.p', box).addEventListener('click', function () { open(idx - 1); });
    $('.n', box).addEventListener('click', function () { open(idx + 1); });
    $('.stage', box).addEventListener('click', function (e) { if (e.target !== im) close(); });
    var sx = null;
    box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      sx = null;
      if (Math.abs(dx) > 50) open(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('on')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(idx - 1);
      if (e.key === 'ArrowRight') open(idx + 1);
    });
  }
})();
