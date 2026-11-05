/* AK CAMERA 説明書の目次・前後の移動・検索。章の並びはここだけに書く */
(function () {
  'use strict';
  var DATA = {"groups": [["はじめに", ["screen"]], ["撮る", ["shoot", "viewer"]], ["色と明るさ", ["look", "sheets", "mode"]], ["設定", ["settings", "set-shoot", "set-look", "set-bokeh", "set-view", "set-sound", "set-save", "set-setup", "set-app", "set-dev"]], ["こんなときは", ["recipes", "save", "trouble"]]], "pages": [{"id": "screen", "t": "撮影画面の見かた", "g": "はじめに", "k": []}, {"id": "shoot", "t": "撮る（ピント・ズーム・動画）", "g": "撮る", "k": ["ピントと明るさ", "ズームとレンズ", "指でできること（まとめ）", "シャッターを押したあと", "手を使わずに撮る", "動画"]}, {"id": "viewer", "t": "撮った写真を見る", "g": "撮る", "k": []}, {"id": "look", "t": "色を決める", "g": "色と明るさ", "k": ["ルック（21種類）", "仕上げ", "階調カーブ（DR）", "ボケの量", "明瞭度", "シャープ"]}, {"id": "sheets", "t": "露出・フラッシュ・撮影補助", "g": "色と明るさ", "k": ["露出", "露出モード", "露出補正", "シャッター速度 / ISO 感度", "ホワイトバランス", "フラッシュ", "撮影補助", "合成", "HDR", "セルフタイマー", "構図グリッド・水準器", "動画", "フォーカス（プロ表示のとき）", "ピント合わせ", "ピーキング", "合焦しないとき", "撮影後にピントを戻すまで（秒）"]}, {"id": "mode", "t": "表示モードを変える", "g": "色と明るさ", "k": []}, {"id": "settings", "t": "設定画面の見かた", "g": "設定", "k": []}, {"id": "set-shoot", "t": "撮影", "g": "設定", "k": ["写真の形と画質", "アスペクト比", "画質", "画質：最大解像度（実験的）", "シャッターの優先度", "端末の画像処理（拡大時の描写）", "露出（明るさの決め方）", "露出モード", "露出補正", "M：シャッター速度 / M：ISO / M：フォーカス", "逆光・暗い被写体を自動で持ち上げる", "SS優先で確保する最低シャッター速度", "暗所で伸ばしてよいシャッター速度の上限（単写）", "同・多枚合成のとき", "ISO上限（ノイズ許容）", "低ノイズ優先ISO", "ピント", "AF動作", "AFエリアの大きさ", "AFが合わないときの撮影", "撮影後にAFロックを解除するまで", "合成・HDR・フラッシュ・そのほか", "多枚合成スタック", "HDR", "セルフタイマー", "フラッシュ", "弱フィルの光量", "音量ボタン", "使用レンズの戻し先", "手ブレ補正（OIS／動画EIS）", "ナイトモード（実験的）"]}, {"id": "set-look", "t": "画作り", "g": "設定", "k": ["選択中のルック", "ホワイトバランス", "ダイナミックレンジ優先", "色の濃さ（彩度）", "明瞭度（質感の立体感）", "仕上げシャープネス", "ミストフィルター ／ ミスト強度", "空気感（ルック適用強度）", "エフェクトの並び順", "ルックの表示・非表示"]}, {"id": "set-bokeh", "t": "ボケ", "g": "設定", "k": ["ボケ量・プリセット", "ボケをプレビューに反映", "顔にピント・露出を合わせる（自撮り向け）"]}, {"id": "set-view", "t": "表示", "g": "設定", "k": ["画面デザイン", "表示モード（縦持ち）", "利き手", "言語 / Language", "操作ガイドをもう一度見る", "フォーカスピーキング", "構図グリッドの種類", "水準器を表示", "プレビューを実際の写真と同じ色にする", "シャッター時の画面切替色"]}, {"id": "set-sound", "t": "音", "g": "設定", "k": ["シャッター音量", "シャッター音の種類"]}, {"id": "set-save", "t": "保存", "g": "設定", "k": ["元画像も保存（未処理JPEG・RAW代替）", "RAW(DNG)も保存", "位置情報を写真に記録", "位置情報の有効期限", "透かし（署名帯＋署名＋日付）", "透かしの帯を写真の中に重ねる", "ロゴ表示", "署名", "ブランドメッセージ", "透かしの要素と配置", "署名帯の色"]}, {"id": "set-setup", "t": "設定", "g": "設定", "k": ["設定をエクスポート / 設定をインポート"]}, {"id": "set-app", "t": "アプリ", "g": "設定", "k": ["バージョン", "使い方とサイト", "連絡先", "開発を支援する", "権利表記 / オープンソースソフトウェア"]}, {"id": "set-dev", "t": "開発", "g": "設定", "k": ["診断レポート", "カメラを既定設定で起動（セーフモード）", "この端末で速度優先を使わない（緑写真の回避）", "プレビュー効果を使わない / プレビューを別方式で描く（切り分け用）"]}, {"id": "recipes", "t": "場面別のおすすめ", "g": "こんなときは", "k": ["暗い室内・夜景", "子ども・ペット・乗りもの（動くもの）", "逆光（窓際・夕方の空を背にした人）", "料理", "自撮り・人物", "拡大して細部まで見たい", "電池を持たせたい・動作が重い・熱くなる", "SNS に載せる", "あとで自分で仕上げたい"]}, {"id": "save", "t": "撮った写真はどこに入るか", "g": "こんなときは", "k": []}, {"id": "trouble", "t": "うまくいかないとき", "g": "こんなときは", "k": ["カメラが開かない", "落ちた・写真が保存されなかった", "設定をいじりすぎて分からなくなった"]}]};
  var body = document.body;
  var base = body.getAttribute('data-base') || '';
  var pid = body.getAttribute('data-page');
  var man = base + 'manual/';
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var byId = {};
  DATA.pages.forEach(function (p) { byId[p.id] = p; });
  var order = DATA.pages.map(function (p) { return p.id; });

  function sideHtml() {
    var h = '<div class="ti">目次</div>';
    DATA.groups.forEach(function (g) {
      var cur = g[1].indexOf(pid) >= 0;
      h += '<button class="g' + (cur ? ' on open' : '') + '" aria-expanded="' + cur + '">' + esc(g[0]) + '</button><ul>';
      g[1].forEach(function (i) {
        h += '<li><a href="' + man + i + '.html"' + (i === pid ? ' class="on" aria-current="page"' : '') + '>' + esc(byId[i].t) + '</a></li>';
      });
      h += '</ul>';
    });
    h += '<div class="ext"><a href="' + base + 'start.html">はじめかた</a><a href="' + base + 'faq.html">よくある質問</a><a href="' + base + 'spec.html">仕様</a></div>';
    return h;
  }

  /* 上の帯 */
  var head = document.createElement('header');
  head.className = 'mh';
  head.innerHTML = '<a class="b" href="' + base + 'index.html">AK CAMERA</a><a class="s" href="' + base + 'guide.html">説明書</a><span class="sp"></span><a class="top" href="' + base + 'gallery.html">作例</a><a class="top" href="' + base + 'spec.html">仕様</a>' + (pid ? '<button aria-label="目次を開く">目次</button>' : '');
  body.insertBefore(head, body.firstChild);

  var main = document.querySelector('.man-main');
  if (main) {
    var wrap = document.createElement('div');
    wrap.className = 'mw';
    main.parentNode.insertBefore(wrap, main);
    wrap.appendChild(main);
    var toc = document.createElement('aside');
    toc.className = 'toc';
    toc.setAttribute('aria-label', '目次');
    toc.innerHTML = sideHtml();
    wrap.appendChild(toc);
    var scrim = document.createElement('div');
    scrim.className = 'scrim';
    body.appendChild(scrim);
    var setOpen = function (v) { toc.classList.toggle('open', v); scrim.classList.toggle('open', v); };
    head.querySelector('button').addEventListener('click', function () { setOpen(!toc.classList.contains('open')); });
    scrim.addEventListener('click', function () { setOpen(false); });
    toc.addEventListener('click', function (e) {
      if (!e.target.classList.contains('g')) return;
      var v = e.target.classList.toggle('open');
      e.target.setAttribute('aria-expanded', v);
    });

    /* パンくず */
    var p = byId[pid];
    var cr = document.createElement('ol');
    cr.className = 'crumb';
    cr.innerHTML = '<li><a href="' + base + 'guide.html">説明書</a></li><li>' + esc(p.g) + '</li><li>' + esc(p.t) + '</li>';
    main.insertBefore(cr, main.firstChild);

    /* このページの見出しへ飛ぶ */
    var heads = Array.prototype.slice.call(main.querySelectorAll('h3, details > summary'));
    if (heads.length > 2) {
      var ul = document.createElement('ul');
      ul.className = 'jump';
      heads.forEach(function (h, i) {
        var box = h.tagName === 'SUMMARY' ? h.parentNode : h;
        box.id = box.id || 's' + (i + 1);
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + box.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        ul.appendChild(li);
      });
      main.insertBefore(ul, main.querySelector('h1').nextSibling);
    }
    var openHash = function () {
      if (!location.hash) return;
      var t = document.getElementById(location.hash.slice(1));
      if (t && t.tagName === 'DETAILS') t.open = true;
    };
    window.addEventListener('hashchange', openHash);
    openHash();

    /* 前後のページ */
    var n = order.indexOf(pid), nav = document.createElement('nav');
    nav.className = 'mnav';
    nav.setAttribute('aria-label', '前後のページ');
    var h2 = '';
    if (n > 0) h2 += '<a class="p" href="' + order[n - 1] + '.html"><small>‹ 前へ</small>' + esc(byId[order[n - 1]].t) + '</a>';
    if (n < order.length - 1) h2 += '<a class="n" href="' + order[n + 1] + '.html"><small>次へ ›</small>' + esc(byId[order[n + 1]].t) + '</a>';
    nav.innerHTML = h2;
    main.appendChild(nav);
  }

  /* 目次ページ */
  var hub = document.getElementById('hub');
  if (hub) {
    var h3 = '';
    DATA.groups.forEach(function (g) {
      h3 += '<section class="hubc"><h2>' + esc(g[0]) + '</h2><ul>';
      g[1].forEach(function (i) { h3 += '<li><a href="manual/' + i + '.html">' + esc(byId[i].t) + '</a></li>'; });
      h3 += '</ul></section>';
    });
    hub.innerHTML = h3;
    var q = document.getElementById('hubq'), res = document.getElementById('hubr');
    q.addEventListener('input', function () {
      var v = q.value.trim().toLowerCase();
      hub.style.display = v ? 'none' : '';
      if (!v) { res.innerHTML = ''; return; }
      var out = [];
      DATA.pages.forEach(function (p) {
        if (p.t.toLowerCase().indexOf(v) >= 0) out.push({ p: p, k: '' });
        p.k.forEach(function (k) { if (k.toLowerCase().indexOf(v) >= 0) out.push({ p: p, k: k }); });
      });
      res.innerHTML = out.length ? out.slice(0, 30).map(function (o) {
        return '<a href="manual/' + o.p.id + '.html">' + esc(o.k || o.p.t) + '<small>' + esc(o.p.g) + ' › ' + esc(o.p.t) + '</small></a>';
      }).join('') : '<p class="muted">見つかりませんでした。別の言葉で探すか、<a href="faq.html">よくある質問</a>をご覧ください。</p>';
    });
  }
})();
