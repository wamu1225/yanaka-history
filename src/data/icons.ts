// 記事の主題を見分けるための線画アイコン（2026-11-08 ユーザー「アイコン使うとか」）。
// 絵文字は使いません。どれも 24×24、線の太さ1.8、currentColor で、同じ描き方にそろえます。
export const ICON_PATHS: Record<string, string> = {
  // 地名＝地図のピン
  pin: '<path d="M12 21s-6-5.6-6-10.2A6 6 0 0 1 18 10.8C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',
  // 寺＝反りのある寺の屋根
  temple: '<path d="M2 10c4 0 7-2 10-5 3 3 6 5 10 5"/><path d="M5 10v10M19 10v10"/><path d="M3 20h18"/><path d="M9 20v-6h6v6"/>',
  // 築地塀＝屋根をのせた塀と、横に走る瓦の筋
  wall: '<path d="M2 8h20"/><path d="M3 8l1-2h16l1 2"/><rect x="3" y="8" width="18" height="12"/><path d="M3 12h18M3 16h18"/>',
  // 神社＝鳥居
  torii: '<path d="M3 6c3 1 15 1 18 0"/><path d="M5 9h14"/><path d="M7 7v13M17 7v13"/><path d="M11 9v3h2V9"/>',
  // 震災と空襲＝炎
  flame: '<path d="M12 21c-4 0-7-2.8-7-6.6 0-3.4 2.4-5.4 3.6-8.4.8 1.6 1.6 2.6 2.8 3.2C11.8 6 13 4 15 3c-.4 3 4 5.6 4 11.4 0 3.8-3 6.6-7 6.6z"/><path d="M12 21c-1.7 0-3-1.2-3-3 0-1.6 1.2-2.6 2-4 .9 1.4 4 2 4 4 0 1.8-1.3 3-3 3z"/>',
  // 焼け残り＝家と盾
  'house-shield': '<path d="M3 11l7-6 7 6"/><path d="M5 9.5V19h7"/><path d="M17 13l4 1.5V17c0 2.2-1.7 3.6-4 4.5-2.3-.9-4-2.3-4-4.5v-2.5z"/>',
  // 霊園＝墓石
  grave: '<path d="M8 20V7a4 4 0 0 1 8 0v13"/><path d="M5 20h14"/><path d="M10.5 10h3M12 8.5v5"/>',
  // 雑誌『谷根千』＝開いた冊子
  magazine: '<path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5z"/><path d="M12 6v14"/>',
  // 名物＝串団子
  dango: '<path d="M5 21L19 3"/><circle cx="9" cy="15.5" r="2.6"/><circle cx="12" cy="11.6" r="2.6"/><circle cx="15" cy="7.7" r="2.6"/>',
  // 酒屋＝徳利
  tokkuri: '<path d="M10 3h4"/><path d="M10.5 3v3c0 1.5-4.5 4-4.5 8.5C6 18.5 8.5 21 12 21s6-2.5 6-6.5c0-4.5-4.5-7-4.5-8.5V3"/><path d="M7 14h10"/>',
  // 美術＝筆
  brush: '<path d="M20 4L10.5 13.5"/><path d="M10.5 13.5c-1.5-1.5-4-1-5 1.5-.7 1.8-1.5 3.5-3 4.5 3 .5 6-.5 7.5-2 1.3-1.3 1.8-2.7.5-4z"/>',
  // 俳句＝短冊
  tanzaku: '<rect x="8" y="3" width="8" height="18" rx="1"/><path d="M12 3V1.5"/><path d="M11 7v3M13 9v5M11 13v4"/>',
  // 落語＝扇子
  sensu: '<path d="M12 20L3 9a12 12 0 0 1 18 0z"/><path d="M12 20L7 6.3M12 20V5.5M12 20l5-13.7"/>',
  // 幽霊画＝掛け軸
  scroll: '<path d="M5 3h14"/><path d="M6 3v16h12V3"/><path d="M5 19h14"/><path d="M12 1v2"/><path d="M9 7h6v8H9z"/>',
  // 石段＝階段
  stairs: '<path d="M3 20h5v-4h4v-4h4V8h5"/><path d="M3 20h18"/>',
  // 見どころを歩く＝足あと
  steps: '<path d="M7 14c-1.5 0-2.5-1.5-2.5-3.5S5.5 6 7 6s2.5 1.5 2.5 4.5S8.5 14 7 14z"/><path d="M5.5 16.5h3"/><path d="M17 10c-1.5 0-2.5-1.5-2.5-3.5S15.5 2 17 2s2.5 1.5 2.5 4.5S18.5 10 17 10z"/><path d="M15.5 12.5h3"/>',
  // よくある誤解＝問い
  question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7v.5"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
};

// 記事ごとのアイコン
export const ARTICLE_ICON: Record<string, string> = {
  chimei: 'pin', 'yanaka-origin': 'temple', tennoji: 'temple', zuirinji: 'temple', kannonji: 'wall', 'suwa-jinja': 'torii',
  'kanto-earthquake': 'flame', 'march10-vs-march4': 'flame', 'damaged-area': 'flame',
  'surviving-area': 'house-shield', 'why-yanaka-survived': 'house-shield',
  'yanesen-preservation': 'magazine', industry: 'tokkuri', food: 'dango',
  'okakura-tenshin': 'brush', 'masaoka-shiki': 'tanzaku', encho: 'sensu', 'yanaka-cemetery': 'grave',
  meisho: 'steps', 'yanaka-faq': 'question',
};

export function iconSvg(name: string, size = 24): string {
  const p = ICON_PATHS[name];
  if (!p) return '';
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
}
