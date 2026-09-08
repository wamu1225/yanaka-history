// scripts/generate-ogp.ts — OGP画像（1200×630）を public/ogp.png に生成する。
// 実行: npx tsx scripts/generate-ogp.ts
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const FONT_SANS = "'Yu Gothic','Hiragino Kaku Gothic ProN','Hiragino Sans',Meiryo,'Noto Sans JP',sans-serif";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f3efe6"/>
  <rect x="0" y="0" width="1200" height="16" fill="#2f2b26"/>
  <rect x="0" y="16" width="1200" height="6" fill="#9c6b2e"/>
  <rect x="0" y="440" width="600" height="190" fill="#6b6259" opacity="0.25"/>
  <rect x="600" y="440" width="600" height="190" fill="#d9b47c" opacity="0.35"/>
  <text x="96" y="230" font-family="${FONT_SANS}" font-size="66" font-weight="700" fill="#2f2b26">谷中</text>
  <text x="96" y="300" font-family="${FONT_SANS}" font-size="52" font-weight="700" fill="#2f2b26">焼け残った町</text>
  <text x="96" y="360" font-family="${FONT_SANS}" font-size="24" fill="#74695c">震災と空襲の境界線から読み解く</text>
  <line x1="96" y1="400" x2="560" y2="400" stroke="#9c6b2e" stroke-width="2"/>
  <text x="96" y="600" font-family="${FONT_SANS}" font-size="22" fill="#2f2b26" font-weight="600">study-apps.com/yanaka-history/</text>
</svg>`;

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  const outPath = path.join(PUBLIC_DIR, 'ogp.png');
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log(`✓ ogp.png (1200x630) を生成: ${outPath}`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
