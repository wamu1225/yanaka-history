// 記事一覧の まとまり（読む順）。一覧のページと prerender の両方が使う（2026-11-07 監督）
export const ARTICLE_GROUPS: { title: string; lead: string; ids: string[] }[] = [
  { title: '寺町の成り立ち', lead: '地名と、寺が集まった理由。主な寺と神社。', ids: ['chimei', 'yanaka-origin', 'tennoji', 'zuirinji', 'kannonji', 'suwa-jinja'] },
  { title: '震災と空襲', lead: 'なぜ谷中の町並みは焼け残ったのか。', ids: ['kanto-earthquake', 'march10-vs-march4', 'damaged-area', 'surviving-area', 'why-yanaka-survived'] },
  { title: '戦後の保存と暮らし', lead: '谷根千の保存運動と、町の仕事と名物。', ids: ['yanesen-preservation', 'industry', 'food'] },
  { title: '谷中にいた人たち', lead: '美術、俳句、落語、そして慶喜の墓。', ids: ['okakura-tenshin', 'masaoka-shiki', 'encho', 'yanaka-cemetery'] },
  { title: '歩く', lead: '見どころと、よくある取りちがえ。', ids: ['meisho', 'yanaka-faq'] },
];
