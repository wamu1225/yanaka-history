import { articles } from '../src/data/articles';
import { zones } from '../src/data/zones';

let errors = 0;

function fail(msg: string) {
  console.error(`✗ ${msg}`);
  errors++;
}

const articleIds = new Set<string>();
for (const a of articles) {
  if (articleIds.has(a.id)) fail(`記事id重複: ${a.id}`);
  articleIds.add(a.id);
  if (!a.title || !a.dek || !a.body) fail(`記事の必須フィールド欠落: ${a.id}`);
  if (a.sources.length === 0) fail(`出典が0件: ${a.id}`);
  if (a.body.length < 300) fail(`本文が短すぎる（300字未満）: ${a.id}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.updatedAt)) fail(`updatedAtの形式不正: ${a.id}`);
}

const orders = articles.map((a) => a.order).sort((a, b) => a - b);
orders.forEach((o, i) => {
  if (o !== i + 1) fail(`記事のorderが連番になっていない: ${o}番目の値が${i + 1}でない`);
});

for (const z of zones) {
  if (!articleIds.has(z.articleId)) fail(`ゾーン${z.id}のarticleIdが存在しない記事を指している: ${z.articleId}`);
  if (z.spots.length === 0) fail(`ゾーン${z.id}のspotsが0件`);
}

console.log('--- yanaka-history データ検証 ---');
console.log(`記事: ${articles.length}本`);
console.log(`ゾーン: ${zones.length}件（計${zones.reduce((n, z) => n + z.spots.length, 0)}地点）`);

if (errors > 0) {
  console.error(`\n❌ ${errors}件のエラー`);
  process.exit(1);
}
console.log('\n✅ All checks passed!');
