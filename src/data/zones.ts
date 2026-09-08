export interface Spot {
  id: string;
  name: string;
  note: string;
}

export interface Zone {
  id: 'damaged' | 'surviving';
  label: string;
  summary: string;
  articleId: string;
  spots: Spot[];
}

export const zones: Zone[] = [
  {
    id: 'damaged',
    label: '被災したエリア',
    summary:
      '1945年3月4日の空襲で、谷中小学校周辺の低地寄りの一角が局地的に被災した。死傷約500人、全半壊家屋約200戸。',
    articleId: 'damaged-area',
    spots: [
      { id: 'sanshin-jizo', name: '三四真地蔵尊', note: '1948年、三崎町、初音町4丁目、真島町の3町の有志が、3町の戦災死者70余名を供養するために建立。名前は3町の頭文字から。' },
      { id: 'honryuji', name: '本龍寺', note: '本堂下の防空壕に避難していた住民が犠牲になったと伝えられる。' },
      { id: 'kashimayu', name: '鹿島湯跡（不忍通り沿い）', note: 'かつての銭湯。石炭倉庫を防空壕代わりに使っていた住民が犠牲になったと伝えられる。' },
    ],
  },
  {
    id: 'surviving',
    label: '焼け残ったエリア',
    summary:
      '谷中4〜6丁目、谷中霊園の周辺、谷中銀座となる一帯は、震災でも空襲でも壊滅的な延焼を免れ、戦前の木造家屋や寺町の景観が今も残る。',
    articleId: 'surviving-area',
    spots: [
      { id: 'yanaka-ginza', name: '谷中銀座商店街', note: '戦後の闇市や露店群を起源とする商店街。全長約170mに約60店舗が並ぶ。' },
      { id: 'yanaka-cemetery', name: '谷中霊園', note: '面積約10万平方メートル。広大な緑地が延焼を遮る役割を果たしたとされる。' },
      { id: 'temple-town', name: '寺町一帯（経王寺ほか）', note: '明暦の大火後に移転してきた寺院が今も密集する。境内の樹木に戦災の輻射熱による変色の跡が残る寺もある。' },
    ],
  },
];
