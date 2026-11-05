/* プロフィールページの動き。外部のライブラリは使わない */
(function () {
  'use strict';
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia('(hover: none)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 名前を1文字ずつ出す */
  var name = $('.hero-name');
  if (name) {
    var txt = name.textContent;
    name.setAttribute('aria-label', txt);
    name.innerHTML = txt.split('').map(function (c, i) {
      return '<span class="ch" aria-hidden="true" style="--i:' + i + '">' + c + '</span>';
    }).join('');
  }

  /* 何をしている人か */
  var roles = $('.roles');
  if (roles && !calm) {
    var spans = $$('span', roles), ri = 0;
    window.setInterval(function () {
      ri = (ri + 1) % spans.length;
      spans.forEach(function (s) { s.style.transform = 'translateY(' + (-100 * ri) + '%)'; });
    }, 2600);
  }

  /* 写真の切り替え */
  var bgs = $$('.hx-bg i');
  if (bgs.length) {
    var bi = 0;
    bgs[0].classList.add('on');
    if (!calm && bgs.length > 1) {
      window.setInterval(function () {
        var o = bgs[bi];
        bi = (bi + 1) % bgs.length;
        bgs[bi].classList.add('on');
        o.classList.remove('on');
      }, 8000);
    }
  }

  /* 光がポインターについてくる */
  var hero = $('.hero.hx');
  if (hero && !touch && !calm) {
    hero.addEventListener('pointermove', function (e) {
      var b = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - b.left) / b.width * 100) + '%');
      hero.style.setProperty('--my', ((e.clientY - b.top) / b.height * 100) + '%');
    });
  }

  /* 節の後ろの大きな文字 */
  $$('section[id]').forEach(function (s) {
    var l = $('.label', s);
    if (!l) return;
    var g = document.createElement('div');
    g.className = 'ghost';
    g.setAttribute('aria-hidden', 'true');
    g.textContent = l.textContent;
    s.insertBefore(g, s.firstChild);
  });

  /* 順に現れる */
  var seen = 'IntersectionObserver' in window && !calm ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); seen.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -6% 0px' }) : null;
  function mark(root) {
    $$('.feature, .work, .fact, .link, .goods, .post, .embed, .tag, .soon, .support', root || document).forEach(function (el) {
      if (el.classList.contains('rv')) return;
      if (!seen) return;
      var sib = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
      el.style.setProperty('--d', Math.min(sib, 5) * .07 + 's');
      el.classList.add('rv');
      seen.observe(el);
    });
  }
  mark();
  ['blog-list', 'booth-grid'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && 'MutationObserver' in window) new MutationObserver(function () { mark(el); }).observe(el, { childList: true });
  });

  /* スクロールに合わせる */
  var nav = $('body > nav'), bar = $('.pgbar');
  var cue = $('.scue');
  var ghosts = $$('.ghost'), shots = $$('.feature-shot'), inner = $('.hero.hx .hero-inner');
  var spy = $$('.nav-links a[href^="#"]').map(function (a) { return { a: a, el: $(a.getAttribute('href')) }; }).filter(function (x) { return x.el; });
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.pageYOffset, vh = window.innerHeight, max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (nav) nav.classList.toggle('solid', y > (hero ? hero.offsetHeight - 70 : 20));
    var cur = null;
    spy.forEach(function (s) { if (s.el.getBoundingClientRect().top < vh * .4) cur = s; });
    spy.forEach(function (s) { s.a.classList.toggle('on', s === cur); });
    if (cue) cue.style.opacity = y > 30 ? '0' : '';
    if (calm) return;
    if (inner && y < vh * 1.2) {
      inner.style.transform = 'translate3d(0,' + y * .22 + 'px,0)';
      inner.style.opacity = String(Math.max(0, 1 - y / (vh * .75)));
    }
    ghosts.forEach(function (g, i) {
      var r = g.parentNode.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      g.style.transform = 'translate3d(' + (r.top / vh) * (i % 2 ? -7 : 7) + '%,0,0)';
    });
    shots.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      var ph = $('.phone', s), bg = s.firstElementChild;
      if (ph) ph.style.transform = 'translate3d(0,' + p * -26 + 'px,0)';
      if (bg) bg.style.transform = 'scale(1.08) translate3d(0,' + p * 14 + 'px,0)';
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* カードの傾き */
  if (!touch && !calm) {
    $$('.work').forEach(function (w) {
      w.addEventListener('pointermove', function (e) {
        var b = w.getBoundingClientRect();
        w.style.setProperty('--ry', ((e.clientX - b.left) / b.width - .5) * 5 + 'deg');
        w.style.setProperty('--rx', ((e.clientY - b.top) / b.height - .5) * -5 + 'deg');
      });
      w.addEventListener('pointerleave', function () {
        w.style.setProperty('--ry', '0deg');
        w.style.setProperty('--rx', '0deg');
      });
    });
  }

  /* 数字 */
  $$('.nums b[data-n]').forEach(function (b) {
    var end = +b.getAttribute('data-n');
    if (calm || !('IntersectionObserver' in window)) return;
    var o = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      o.disconnect();
      var t0 = performance.now();
      (function step(t) {
        var k = Math.min(1, (t - t0) / 900);
        b.textContent = String(Math.round(end * (1 - Math.pow(1 - k, 3))));
        if (k < 1) window.requestAnimationFrame(step);
      })(t0);
    }, { threshold: .4 });
    o.observe(b);
  });

  /* 横に流れる列の矢印 */
  $$('.rail').forEach(function (r) {
    var w = document.createElement('div');
    w.className = 'railw';
    r.parentNode.insertBefore(w, r);
    w.appendChild(r);
    var mk = function (c, t, d) {
      var b = document.createElement('button');
      b.className = 'railb ' + c;
      b.textContent = t;
      b.setAttribute('aria-label', c === 'p' ? '前へ' : '次へ');
      b.addEventListener('click', function () { r.scrollBy({ left: d * r.clientWidth * .8, behavior: calm ? 'auto' : 'smooth' }); });
      w.appendChild(b);
      return b;
    };
    var p = mk('p', '‹', -1), n = mk('n', '›', 1);
    var upd = function () {
      p.disabled = r.scrollLeft < 8;
      n.disabled = r.scrollLeft + r.clientWidth > r.scrollWidth - 8;
    };
    r.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    window.setTimeout(upd, 800);
    window.setTimeout(upd, 3000);
    upd();
  });
})();
