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
    <desc id="terrace-desc">低地側で発生した火災が、台地の崖線と寺院の緑地に阻まれて谷中側へ広がらなかった様子を示す概念図。実際の地形の精密な縮尺ではない。</desc>
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
  <figcaption>低地から迫る火災は、台地の崖線と寺院の広い境内や樹木に遮られ、谷中の内側まで届きにくかった。図は地形の高低差と緑地の役割を示す概念図で、実際の街路の精密な形を表すものではない。</figcaption>
</figure>`;
}

// 実座標地図：zones.ts の緯度経度を単純な正距円筒図法（経度をcos(緯度)で補正）で
// 平面に投影する。zones.ts の注記のとおり、各地点の座標は日暮里駅・谷中霊園という
// 実座標2点を基準にした概算であり、測量精度ではない相対位置の目安。
// 地点名はSVG内テキストにせず、figure直下のHTML凡例に置くことで、
// viewBoxの拡大縮小の影響を受けない可読性を保証する。
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
    <desc id="ymap-desc">各地点の緯度経度から算出した相対位置を示す図。測量精度の地図ではなく、日暮里駅と谷中霊園を基準にした概算図。番号は下の凡例と対応する。</desc>
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
  <figcaption>被災エリア3地点・焼け残ったエリア3地点の位置関係を、各地点の緯度経度から算出して描いた図。座標は日暮里駅・谷中霊園という実座標2点を基準にした概算であり、測量精度ではない。</figcaption>
</figure>`;
}

const figures: Record<string, Figure> = {
  'kanto-earthquake': { html: buildTerraceFigure() },
  'yanaka-origin': { html: buildZoneMapSvg() },
};

export function figureHtml(articleId: string): string | null {
  return figures[articleId]?.html ?? null;
}
