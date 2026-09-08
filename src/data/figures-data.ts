// 記事本文に付随する自作SVG模式図のSSOT。
// React版（ArticlePage.tsx）と prerender.ts が同じHTML文字列を共用する（figures-data方式）。
// 精密な地図ではなく、既に検証済みの事実（台地と低地の高低差が延焼を分けた）を示す概念図。

export type Figure = { html: string };

const figures: Record<string, Figure> = {
  'kanto-earthquake': {
    html: `<figure class="fig">
  <svg viewBox="0 0 640 220" role="img" aria-labelledby="terrace-title terrace-desc">
    <title id="terrace-title">台地と低地の高低差が延焼を分けた模式図</title>
    <desc id="terrace-desc">低地側で発生した火災が、台地の崖線と寺院の緑地に阻まれて谷中側へ広がらなかった様子を示す概念図。実際の地形の精密な縮尺ではない。</desc>
    <g transform="translate(20,30)">
      <rect x="0" y="80" width="260" height="70" fill="#e3cfa6" />
      <text x="10" y="105" font-size="13" fill="#2a2622">低地（浅草区、下谷区東部）</text>
      <text x="10" y="125" font-size="12" fill="#6b6259">ほぼ全域が焼失</text>
      <path d="M 20 95 L 60 85 L 100 95 L 140 82 L 180 96 L 220 84" fill="none" stroke="#b5533c" stroke-width="4" stroke-linecap="round" opacity="0.8" />
    </g>
    <g transform="translate(300,10)">
      <rect x="0" y="0" width="20" height="150" fill="#8a8072" />
      <text x="26" y="20" font-size="12" fill="#6b6259">崖線</text>
    </g>
    <g transform="translate(360,0)">
      <rect x="0" y="10" width="260" height="120" fill="#d9b47c" opacity="0.5" />
      <text x="10" y="35" font-size="13" fill="#2a2622">台地（谷中）</text>
      <text x="10" y="55" font-size="12" fill="#6b6259">寺院の境内が緑地帯になる</text>
      <circle cx="40" cy="90" r="14" fill="#5c7a52" opacity="0.7" />
      <circle cx="90" cy="100" r="18" fill="#5c7a52" opacity="0.7" />
      <circle cx="150" cy="88" r="15" fill="#5c7a52" opacity="0.7" />
      <circle cx="205" cy="98" r="17" fill="#5c7a52" opacity="0.7" />
    </g>
  </svg>
  <figcaption>低地から迫る火災は、台地の崖線と寺院の広い境内や樹木に遮られ、谷中の内側まで届きにくかった。図は地形の高低差と緑地の役割を示す概念図で、実際の街路の精密な形を表すものではない。</figcaption>
</figure>`,
  },
};

export function figureHtml(articleId: string): string | null {
  return figures[articleId]?.html ?? null;
}
