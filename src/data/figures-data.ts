// 記事本文に付随する自作SVG模式図のSSOT。
// React版（ArticlePage.tsx）と prerender.ts が同じHTML文字列を共用する（figures-data方式）。

import { zones } from './zones';

export type Figure = { html: string };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ⚠️ viewBoxは390px幅のモバイル表示でも実効フォントが11px以上になるよう、
// 表示上限幅に近い値に抑えている（O-2-25の再発防止。svg-legibility.cjsと同じ
// 測定方法で実測済み）。
function buildTerraceFigure(): string {
  return `<figure class="fig">
  <svg viewBox="0 0 320 300" role="img" aria-labelledby="terrace-title terrace-desc">
    <title id="terrace-title">台地と低地の高低差が延焼を分けた模式図</title>
    <desc id="terrace-desc">低地側で発生した火災が、台地の崖線と寺院の緑地に阻まれて谷中側へ広がらなかった様子を示す概念図。実際の地形の精密な縮尺ではありません。</desc>
    <g transform="translate(14,14)">
      <rect x="0" y="0" width="292" height="80" fill="#e3cfa6" />
      <text x="10" y="22" font-size="13" fill="#2a2622">低地（浅草区、下谷区東部）</text>
      <text x="10" y="42" font-size="12" fill="#6b6259">ほぼ全域が焼失</text>
      <path d="M 20 62 L 70 50 L 120 62 L 170 46 L 220 64 L 270 48" fill="none" stroke="#b5533c" stroke-width="4" stroke-linecap="round" opacity="0.8" />
    </g>
    <g transform="translate(14,100)">
      <rect x="0" y="0" width="292" height="16" fill="#8a8072" />
      <text x="146" y="12" font-size="12" fill="#fff" text-anchor="middle">崖線</text>
    </g>
    <g transform="translate(14,124)">
      <rect x="0" y="0" width="292" height="150" fill="#d9b47c" opacity="0.5" />
      <text x="10" y="24" font-size="13" fill="#2a2622">台地（谷中）</text>
      <text x="10" y="44" font-size="12" fill="#6b6259">寺院の境内が緑地帯になる</text>
      <circle cx="50" cy="90" r="20" fill="#5c7a52" opacity="0.7" />
      <circle cx="110" cy="105" r="26" fill="#5c7a52" opacity="0.7" />
      <circle cx="185" cy="88" r="22" fill="#5c7a52" opacity="0.7" />
      <circle cx="245" cy="100" r="24" fill="#5c7a52" opacity="0.7" />
    </g>
  </svg>
  <figcaption>低地から迫る火災は、台地の崖線と寺院の広い境内や樹木に遮られ、谷中の内側まで届きにくいものでした。図は地形の高低差と緑地の役割を示す概念図で、実際の街路の精密な形を表すものではありません。</figcaption>
</figure>`;
}

// 実座標地図：zones.ts の緯度経度を単純な正距円筒図法（経度をcos(緯度)で補正）で
// 平面に投影する処理。zones.ts の注記のとおり、各地点の座標は日暮里駅・谷中霊園という
// 実座標2点を基準にした概算であり、測量精度ではない相対位置の目安。
// 地点名はSVG内テキストにせず、figure直下のHTML凡例に置くことで、
// viewBoxの拡大縮小の影響を受けない可読性を保証する構成。
function buildZoneMapSvg(): string {
  const allSpots = zones.flatMap((z) => z.spots.map((s) => ({ ...s, zoneId: z.id })));
  const R_EARTH_M = 111_320;
  const lat0 = allSpots.reduce((s, p) => s + p.lat, 0) / allSpots.length;
  const cosLat = Math.cos((lat0 * Math.PI) / 180);

  const toXY = (lat: number, lng: number) => ({
    x: lng * cosLat * R_EARTH_M,
    y: -lat * R_EARTH_M,
  });

  const pts = allSpots.map((s, i) => ({ ...s, num: i + 1, ...toXY(s.lat, s.lng) }));
  const minX = Math.min(...pts.map((p) => p.x));
  const maxX = Math.max(...pts.map((p) => p.x));
  const minY = Math.min(...pts.map((p) => p.y));
  const maxY = Math.max(...pts.map((p) => p.y));

  const PAD = 30;
  const W = 300;
  const H = 340;
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const scale = Math.min((W - PAD * 2) / spanX, (H - PAD * 2 - 30) / spanY);

  const px = (x: number) => PAD + (x - minX) * scale;
  const py = (y: number) => PAD + (y - minY) * scale;

  const dots = pts
    .map((p) => {
      const cx = px(p.x).toFixed(1);
      const cy = py(p.y).toFixed(1);
      const color = p.zoneId === 'damaged' ? '#6b6259' : '#9c6b2e';
      return `<g>
        <circle cx="${cx}" cy="${cy}" r="11" fill="${color}" stroke="#fff" stroke-width="2" />
        <text x="${cx}" y="${cy}" font-size="12" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="central">${p.num}</text>
      </g>`;
    })
    .join('\n');

  const barMeters = 200;
  const barPx = barMeters * scale;
  const barX0 = PAD;
  const barY = H - 34;

  const legendItems = pts
    .map((p) => `<li><span class="fig-map__dot fig-map__dot--${p.zoneId}">${p.num}</span>${esc(p.name)}</li>`)
    .join('\n      ');

  return `<figure class="fig fig--map">
  <svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="ymap-title ymap-desc">
    <title id="ymap-title">谷中の被災エリアと焼け残ったエリア、実座標にもとづく位置関係図</title>
    <desc id="ymap-desc">各地点の緯度経度から算出した相対位置を示す図。測量精度の地図ではなく、日暮里駅と谷中霊園を基準にした概算図。番号は下の凡例と対応しています。</desc>
    ${dots}
    <g transform="translate(${W - 26}, 22)">
      <line x1="0" y1="16" x2="0" y2="0" stroke="#2a2622" stroke-width="2" marker-end="url(#ymap-n-arrow)" />
      <text x="0" y="-4" font-size="13" text-anchor="middle" fill="#2a2622">N</text>
    </g>
    <g transform="translate(${barX0}, ${barY})">
      <line x1="0" y1="0" x2="${barPx.toFixed(1)}" y2="0" stroke="#2a2622" stroke-width="2" />
      <line x1="0" y1="-4" x2="0" y2="4" stroke="#2a2622" stroke-width="2" />
      <line x1="${barPx.toFixed(1)}" y1="-4" x2="${barPx.toFixed(1)}" y2="4" stroke="#2a2622" stroke-width="2" />
      <text x="${(barPx / 2).toFixed(1)}" y="16" font-size="11" text-anchor="middle" fill="#2a2622">${barMeters}m</text>
    </g>
    <defs>
      <marker id="ymap-n-arrow" markerWidth="8" markerHeight="8" refX="4" refY="1" orient="auto">
        <path d="M0,8 L4,0 L8,8 Z" fill="#2a2622" />
      </marker>
    </defs>
  </svg>
  <div class="fig-map__legend">
    <ol>
      ${legendItems}
    </ol>
    <p class="fig-map__key">
      <span class="fig-map__key-item"><span class="fig-map__dot fig-map__dot--damaged">●</span>被災したエリア</span>
      <span class="fig-map__key-item"><span class="fig-map__dot fig-map__dot--surviving">●</span>焼け残ったエリア</span>
    </p>
  </div>
  <figcaption>被災エリア3地点・焼け残ったエリア3地点の位置関係を、各地点の緯度経度から算出して描いた図。座標は日暮里駅・谷中霊園という実座標2点を基準にした概算であり、測量精度ではありません。</figcaption>
</figure>`;
}

// 3月10日の東京大空襲と3月4日の空襲、谷中への影響の対比
function buildMarch10Vs4Svg(): string {
  return `<figure class="fig">
  <svg viewBox="0 0 320 200" role="img" aria-labelledby="mar-title mar-desc">
    <title id="mar-title">3月10日の東京大空襲と3月4日の空襲、谷中への影響の違いを示す図</title>
    <desc id="mar-desc">3月10日は谷中の外側が標的になり被害を免れた一方、3月4日は谷中自身が空襲を受けたことを示す対比図。</desc>
    <g transform="translate(14,14)">
      <rect x="0" y="0" width="292" height="76" fill="#e3cfa6" opacity="0.6" />
      <text x="10" y="22" font-size="13" font-weight="700" fill="#2a2622">3月10日（東京大空襲）</text>
      <text x="10" y="42" font-size="12" fill="#6b6259">標的は浅草区・下谷区東部など低地</text>
      <text x="10" y="60" font-size="12" fill="#6b6259">谷中は主爆撃目標の外側＝ほぼ無傷</text>
    </g>
    <g transform="translate(14,100)">
      <rect x="0" y="0" width="292" height="76" fill="#d9b47c" opacity="0.6" />
      <text x="10" y="22" font-size="13" font-weight="700" fill="#2a2622">3月4日（谷中自身への空襲）</text>
      <text x="10" y="42" font-size="12" fill="#6b6259">谷中小学校周辺が直接被災</text>
      <text x="10" y="60" font-size="12" fill="#6b6259">死傷約500人・全半壊約200戸</text>
    </g>
  </svg>
  <figcaption>日付の近い2つの空襲は、谷中への影響がまったく異なります。3月10日の東京大空襲は谷中の外側を焼き、3月4日の空襲は谷中自身を直接焼きました。</figcaption>
</figure>`;
}

// 天王寺境内地→谷中墓地→谷中霊園の年表と、五重塔の運命
function buildCemeteryTimelineSvg(): string {
  const node = (x: number, year: string, label: string, color: string) =>
    `<circle cx="${x}" cy="54" r="9" fill="${color}"/>` +
    `<text x="${x}" y="34" font-size="12.5" font-weight="700" fill="#2a2622" text-anchor="middle">${year}</text>` +
    `<text x="${x}" y="80" font-size="12" fill="#2a2622" text-anchor="middle">${label.split('|')[0]}</text>` +
    (label.includes('|') ? `<text x="${x}" y="92" font-size="12" fill="#2a2622" text-anchor="middle">${label.split('|')[1]}</text>` : '');
  return `<figure class="fig">
  <svg viewBox="0 0 320 110" role="img" aria-labelledby="cem-title cem-desc">
    <title id="cem-title">天王寺境内地から谷中霊園への年表と五重塔の運命を示す図</title>
    <desc id="cem-desc">天王寺の境内地が谷中墓地、谷中霊園へと変わっていった経緯と、五重塔が災厄を越えて1957年に焼失した経緯を示す年表。</desc>
    <rect width="320" height="110" fill="#f3efe6"/>
    <line x1="30" y1="54" x2="290" y2="54" stroke="#a89f92" stroke-width="2.2"/>
    <path d="M290 54 l-8 -4 M290 54 l-8 4" stroke="#a89f92" stroke-width="2.2" fill="none"/>
    ${node(45, '1874', '天王寺境内地を|「谷中墓地」に', '#9c6b2e')}
    ${node(125, '1935', '「谷中霊園」|へ改称', '#5c7a52')}
    ${node(205, '1957', '五重塔が|放火事件で焼失', '#b5533c')}
    ${node(270, '今', '心礎と礎石|のみ現存', '#2a2622')}
  </svg>
  <figcaption>天王寺の境内地は明治7年（1874年）に「谷中墓地」となり、昭和10年（1935年）に「谷中霊園」へ改称されました。震災・空襲を耐えた五重塔は、昭和32年（1957年）の放火心中事件で失われています。</figcaption>
</figure>`;
}

// 谷根千の創刊から住民運動の広がりまでの年表
function buildPreservationTimelineSvg(): string {
  const node = (x: number, year: string, label: string, color: string) =>
    `<circle cx="${x}" cy="54" r="9" fill="${color}"/>` +
    `<text x="${x}" y="34" font-size="12.5" font-weight="700" fill="#2a2622" text-anchor="middle">${year}</text>` +
    `<text x="${x}" y="80" font-size="12" fill="#2a2622" text-anchor="middle">${label.split('|')[0]}</text>` +
    (label.includes('|') ? `<text x="${x}" y="92" font-size="12" fill="#2a2622" text-anchor="middle">${label.split('|')[1]}</text>` : '');
  return `<figure class="fig">
  <svg viewBox="0 0 320 110" role="img" aria-labelledby="pres-title pres-desc">
    <title id="pres-title">谷根千の創刊から住民運動の広がりまでの年表の図</title>
    <desc id="pres-desc">戦火を免れた町並みを守った住民運動の広がりを、地域雑誌『谷根千』創刊から現在までの年表で示す図。</desc>
    <rect width="320" height="110" fill="#f3efe6"/>
    <line x1="34" y1="54" x2="286" y2="54" stroke="#a89f92" stroke-width="2.2"/>
    <path d="M286 54 l-8 -4 M286 54 l-8 4" stroke="#a89f92" stroke-width="2.2" fill="none"/>
    ${node(50, '1984', '地域雑誌|『谷根千』創刊', '#9c6b2e')}
    ${node(150, '1989', 'まちづくり|「谷学校」設立', '#5c7a52')}
    ${node(250, '2000年代〜', '歴史都市研究会が|古建物を再生', '#2a2622')}
  </svg>
  <figcaption>焼け残った町並みは、昭和59年（1984年）の地域雑誌『谷根千』創刊、平成元年（1989年）の「谷学校」設立を経て、2000年代以降はNPO法人による古建物の再生・活用へとつながっています。</figcaption>
</figure>`;
}

// 日本美術院の谷中開院から記念公園までの年表
function buildOkakuraTimelineSvg(): string {
  const node = (x: number, year: string, label: string, color: string) =>
    `<circle cx="${x}" cy="54" r="9" fill="${color}"/>` +
    `<text x="${x}" y="34" font-size="12.5" font-weight="700" fill="#2a2622" text-anchor="middle">${year}</text>` +
    `<text x="${x}" y="80" font-size="12" fill="#2a2622" text-anchor="middle">${label.split('|')[0]}</text>` +
    (label.includes('|') ? `<text x="${x}" y="92" font-size="12" fill="#2a2622" text-anchor="middle">${label.split('|')[1]}</text>` : '');
  return `<figure class="fig">
  <svg viewBox="0 0 320 110" role="img" aria-labelledby="okakura-title okakura-desc">
    <title id="okakura-title">日本美術院の谷中開院から記念公園までの年表の図</title>
    <desc id="okakura-desc">岡倉天心が谷中初音町に日本美術院を開いてから、五浦への移転、跡地の記念公園整備までの年表。</desc>
    <rect width="320" height="110" fill="#f3efe6"/>
    <line x1="34" y1="54" x2="286" y2="54" stroke="#a89f92" stroke-width="2.2"/>
    <path d="M286 54 l-8 -4 M286 54 l-8 4" stroke="#a89f92" stroke-width="2.2" fill="none"/>
    ${node(50, '1898.7', '日本美術院を|創設', '#9c6b2e')}
    ${node(150, '1898.10', '谷中初音町で|落成開院', '#5c7a52')}
    ${node(250, '1906', '茨城県|五浦へ移転', '#2a2622')}
  </svg>
  <figcaption>岡倉天心は明治31年（1898年）7月に日本美術院を創設し、同年10月に谷中初音町の自邸内で落成開院しました。明治39年（1906年）に茨城県五浦へ移転し、跡地は昭和42年（1967年）に岡倉天心記念公園として整備されています。</figcaption>
</figure>`;
}

// 正岡子規の子規庵の年表
function buildShikiTimelineSvg(): string {
  const node = (x: number, year: string, label: string, color: string) =>
    `<circle cx="${x}" cy="54" r="9" fill="${color}"/>` +
    `<text x="${x}" y="34" font-size="12" font-weight="700" fill="#2a2622" text-anchor="middle">${year}</text>` +
    `<text x="${x}" y="80" font-size="11.5" fill="#2a2622" text-anchor="middle">${label.split('|')[0]}</text>` +
    (label.includes('|') ? `<text x="${x}" y="92" font-size="11.5" fill="#2a2622" text-anchor="middle">${label.split('|')[1]}</text>` : '');
  return `<figure class="fig">
  <svg viewBox="0 0 320 110" role="img" aria-labelledby="shiki-title shiki-desc">
    <title id="shiki-title">正岡子規の子規庵の年表の図</title>
    <desc id="shiki-desc">正岡子規が下根岸の借家に転居してから没するまでの8年半、空襲での焼失、間取りのままの再建までの年表。</desc>
    <rect width="320" height="110" fill="#f3efe6"/>
    <line x1="30" y1="54" x2="290" y2="54" stroke="#a89f92" stroke-width="2.2"/>
    <path d="M290 54 l-8 -4 M290 54 l-8 4" stroke="#a89f92" stroke-width="2.2" fill="none"/>
    ${node(45, '1894', '下根岸の|借家へ転居', '#9c6b2e')}
    ${node(135, '1902', '子規庵で|没する', '#2a2622')}
    ${node(225, '1945', '空襲で|焼失', '#b5533c')}
    ${node(275, '1950', '間取りのまま|再建', '#5c7a52')}
  </svg>
  <figcaption>正岡子規は明治27年（1894年）から明治35年（1902年）に没するまでの8年半、下根岸の借家「子規庵」で句会・歌会を主宰しました。建物は昭和20年（1945年）の空襲で焼失しましたが、5年後に当時の間取りのまま再建されています。</figcaption>
</figure>`;
}

// 旧吉田屋酒店の年表
function buildYoshidayaTimelineSvg(): string {
  const node = (x: number, year: string, label: string, color: string) =>
    `<circle cx="${x}" cy="54" r="9" fill="${color}"/>` +
    `<text x="${x}" y="34" font-size="12.5" font-weight="700" fill="#2a2622" text-anchor="middle">${year}</text>` +
    `<text x="${x}" y="80" font-size="12" fill="#2a2622" text-anchor="middle">${label.split('|')[0]}</text>` +
    (label.includes('|') ? `<text x="${x}" y="92" font-size="12" fill="#2a2622" text-anchor="middle">${label.split('|')[1]}</text>` : '');
  return `<figure class="fig">
  <svg viewBox="0 0 320 110" role="img" aria-labelledby="yoshidaya-title yoshidaya-desc">
    <title id="yoshidaya-title">旧吉田屋酒店の年表の図</title>
    <desc id="yoshidaya-desc">旧吉田屋酒店の創業伝承から、現店舗の建築、上野桜木への移築までの年表。</desc>
    <rect width="320" height="110" fill="#f3efe6"/>
    <line x1="34" y1="54" x2="286" y2="54" stroke="#a89f92" stroke-width="2.2"/>
    <path d="M286 54 l-8 -4 M286 54 l-8 4" stroke="#a89f92" stroke-width="2.2" fill="none"/>
    ${node(50, '1769以前', '創業と|伝わる', '#9c6b2e')}
    ${node(150, '1910', '現店舗が|建築される', '#5c7a52')}
    ${node(250, '1987', '上野桜木へ|移築・公開', '#2a2622')}
  </svg>
  <figcaption>旧吉田屋酒店は明和6年（1769年）以前の創業と伝わる老舗の酒屋で、明治43年（1910年）建築の店舗が今に残ります。昭和62年（1987年）に上野桜木へ移築され、台東区指定有形民俗文化財として公開されています。</figcaption>
</figure>`;
}

// 天王寺（感応寺から天台宗寺院へ）の年表
function buildTennojiTimelineSvg(): string {
  const node = (x: number, year: string, label: string, color: string) =>
    `<circle cx="${x}" cy="54" r="9" fill="${color}"/>` +
    `<text x="${x}" y="34" font-size="12.5" font-weight="700" fill="#2a2622" text-anchor="middle">${year}</text>` +
    `<text x="${x}" y="80" font-size="12" fill="#2a2622" text-anchor="middle">${label.split('|')[0]}</text>` +
    (label.includes('|') ? `<text x="${x}" y="92" font-size="12" fill="#2a2622" text-anchor="middle">${label.split('|')[1]}</text>` : '');
  return `<figure class="fig">
  <svg viewBox="0 0 320 110" role="img" aria-labelledby="tennoji-title tennoji-desc">
    <title id="tennoji-title">天王寺の年表の図</title>
    <desc id="tennoji-desc">日蓮宗の感応寺が天台宗へ強制改宗させられてから、江戸三富と呼ばれるにぎわいを得るまでの年表。</desc>
    <rect width="320" height="110" fill="#f3efe6"/>
    <line x1="34" y1="54" x2="286" y2="54" stroke="#a89f92" stroke-width="2.2"/>
    <path d="M286 54 l-8 -4 M286 54 l-8 4" stroke="#a89f92" stroke-width="2.2" fill="none"/>
    ${node(50, '1698', '感応寺から|天台宗へ改宗', '#b5533c')}
    ${node(150, '1699', '毘沙門天を|本尊に', '#9c6b2e')}
    ${node(250, '1700', '富くじ興行を|公認（江戸三富）', '#5c7a52')}
  </svg>
  <figcaption>天王寺はもと日蓮宗の感応寺でしたが、不受不施派への弾圧により元禄11年（1698年）に天台宗へ強制改宗させられました。翌年に毘沙門天を本尊とし、元禄13年（1700年）には富くじ興行を公認され、目黒不動・湯島天神とともに「江戸三富」と呼ばれるにぎわいを得ています。</figcaption>
</figure>`;
}

const figures: Record<string, Figure> = {
  'kanto-earthquake': { html: buildTerraceFigure() },
  'yanaka-origin': { html: buildZoneMapSvg() },
  'march10-vs-march4': { html: buildMarch10Vs4Svg() },
  'yanaka-cemetery': { html: buildCemeteryTimelineSvg() },
  'yanesen-preservation': { html: buildPreservationTimelineSvg() },
  'okakura-tenshin': { html: buildOkakuraTimelineSvg() },
  'masaoka-shiki': { html: buildShikiTimelineSvg() },
  tennoji: { html: buildTennojiTimelineSvg() },
  industry: { html: buildYoshidayaTimelineSvg() },
};

export function figureHtml(articleId: string): string | null {
  return figures[articleId]?.html ?? null;
}
