// scripts/prerender.ts：SSG。トップ（被災/焼け残りエリア対比）、記事一覧、記事8本、about/privacyの
// 静的フォールバックHTML、per-page meta、JSON-LDを焼き込み、sitemap.xmlを生成する。
// 実行: npx tsx scripts/prerender.ts（npm run predeploy 内）
import * as fs from 'fs';
import * as path from 'path';
import { articles, CATEGORY_LABEL, type Category } from '../src/data/articles';
import { ABOUT_CONTENT, PRIVACY_CONTENT, SITE_NAME } from '../src/data/static-pages';
import { figureHtml } from '../src/data/figures-data';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');
const BASE = '/yanaka-history';
const BASE_URL = 'https://study-apps.com/yanaka-history';
const SITE_UPDATED_AT = '2026-09-12';

console.log('--- yanaka-history SSG Pre-rendering ---');
if (!fs.existsSync(INDEX_HTML_PATH)) {
  console.error('Error: dist/index.html not found. Run "npm run build" first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
function templateForDepth(depth: number): string {
  if (depth === 0) return templateHtml;
  const up = '../'.repeat(depth);
  return templateHtml
    .replace(/href="\.\/assets\//g, `href="${up}assets/`)
    .replace(/src="\.\/assets\//g, `src="${up}assets/`)
    .replace(/href="\.\/favicon\.svg"/g, `href="${up}favicon.svg"`);
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function mdToHtml(content: string): string {
  return content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => (b.startsWith('## ') ? `<h2>${esc(b.slice(3))}</h2>` : `<p>${esc(b)}</p>`))
    .join('\n');
}

function applyMeta(html: string, title: string, description: string, urlPath: string): string {
  const fullTitle = urlPath === '/' ? SITE_NAME : `${title}｜${SITE_NAME}`;
  const url = `${BASE_URL}${urlPath}`;
  return html
    .replace(/<title>.*?<\/title>/, `<title>${esc(fullTitle)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${esc(fullTitle)}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${esc(fullTitle)}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${esc(description)}" />`);
}

function writePage(subpath: string, html: string) {
  const dir = subpath === '' ? DIST_DIR : path.join(DIST_DIR, subpath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

const footerNav = `<nav style="margin-top:24px;display:flex;gap:16px;flex-wrap:wrap"><a href="${BASE}/about/" style="color:#2f2b26">このサイトについて</a><a href="${BASE}/privacy/" style="color:#2f2b26">プライバシーポリシー</a></nav>`;

const shellStyle =
  'font-family:sans-serif;line-height:1.85;max-width:760px;margin:0 auto;padding:24px 20px;color:#2a2622';
const h1Style = 'font-size:1.5rem;border-bottom:3px solid #9c6b2e;padding-bottom:8px;margin-bottom:16px;color:#2f2b26';

function wrap(depth: number, title: string, desc: string, urlPath: string, bodyHtml: string, jsonLd: object) {
  let html = applyMeta(templateForDepth(depth), title, desc, urlPath);
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`);
  return html;
}

// ── トップ（分野別の入口＝亀戸型・O-2-30） ──
const homeDesc =
  '東京都台東区谷中の歴史と文化を一次資料でまとめる。寺町の成り立ち、関東大震災と東京大空襲、谷中霊園、街並み保存運動まで。';
const CATEGORY_ORDER: Category[] = ['name-origin', 'history', 'shrine', 'food', 'industry', 'culture', 'spots', 'faq'];
const groupedHtml = CATEGORY_ORDER.map((cat) => {
  const list = articles.filter((a) => a.category === cat);
  if (list.length === 0) return '';
  const rows = list
    .map(
      (a) =>
        `<li><a href="${BASE}/articles/${a.id}/" style="color:#2f2b26"><strong>${esc(a.title)}</strong></a><br/><span style="color:#74695c;font-size:0.88rem">${esc(a.dek)}</span></li>`,
    )
    .join('\n');
  return `<h2 style="font-size:1.15rem;margin:24px 0 8px;color:#2f2b26">${esc(CATEGORY_LABEL[cat])}</h2>\n<ul style="padding-left:18px">${rows}</ul>`;
}).join('\n');
const homeBody = `<article style="${shellStyle}">
  <h1 style="${h1Style}">${SITE_NAME}</h1>
  <p>${esc(homeDesc)}</p>
  ${groupedHtml}
  ${footerNav}
</article>`;
writePage(
  '',
  wrap(0, '', homeDesc, '/', homeBody, {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${BASE_URL}/`,
    description: homeDesc,
    inLanguage: 'ja',
  }),
);
console.log('✓ トップページ');

// ── 記事一覧 ──
{
  const desc = '谷中の寺町形成から、震災と空襲、戦後の街並み保存運動までをまとめた8本の記事の一覧です。';
  const rows = articles
    .map((a) => `<li><a href="${BASE}/articles/${a.id}/" style="color:#2f2b26">${esc(a.title)}</a>：${esc(a.dek)}</li>`)
    .join('\n');
  const body = `<article style="${shellStyle}">
    <h1 style="${h1Style}">記事一覧</h1>
    <p>${esc(desc)}</p>
    <ul style="padding-left:18px">${rows}</ul>
    ${footerNav}
  </article>`;
  writePage(
    'articles',
    wrap(1, '記事一覧', desc, '/articles/', body, {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: '記事一覧',
      url: `${BASE_URL}/articles/`,
      inLanguage: 'ja',
    }),
  );
}
console.log('✓ /articles/');

// ── 記事本体（8件） ──
for (const a of articles) {
  const sourcesHtml = a.sources
    .map((s) => `<li><a href="${esc(s.url)}" style="color:#2f2b26">${esc(s.label)}</a></li>`)
    .join('\n');
  const fig = figureHtml(a.id);
  const body = `<article style="${shellStyle}">
    <h1 style="${h1Style}">${esc(a.title)}</h1>
    <p style="color:#74695c">${esc(a.dek)}</p>
    ${mdToHtml(a.body)}
    ${fig ?? ''}
    <div style="margin-top:24px;padding:14px 16px;background:#fff;border:1px solid #ddd6c8;border-radius:6px">
      <strong>出典</strong>
      <ul style="margin:6px 0 0;padding-left:18px">${sourcesHtml}</ul>
    </div>
    <p style="margin-top:20px"><a href="${BASE}/articles/" style="color:#2f2b26">← 記事一覧に戻る</a></p>
    ${footerNav}
  </article>`;
  writePage(
    `articles/${a.id}`,
    wrap(2, a.title, a.dek, `/articles/${a.id}/`, body, {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: a.dek,
      dateModified: a.updatedAt,
      url: `${BASE_URL}/articles/${a.id}/`,
      inLanguage: 'ja',
    }),
  );
}
console.log('✓ /articles/<id>/ 全8件');

// ── about / privacy ──
for (const [slug, title, desc, content] of [
  ['about', 'このサイトについて', `${SITE_NAME}のデータの出典と編集方針を説明します。`, ABOUT_CONTENT],
  ['privacy', 'プライバシーポリシー', `${SITE_NAME}のプライバシーポリシー。`, PRIVACY_CONTENT],
] as const) {
  const body = `<article style="${shellStyle}">
    <h1 style="${h1Style}">${esc(title)}</h1>
    ${mdToHtml(content)}
    ${footerNav}
  </article>`;
  writePage(
    slug,
    wrap(1, title, desc, `/${slug}/`, body, {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description: desc,
      url: `${BASE_URL}/${slug}/`,
      inLanguage: 'ja',
    }),
  );
}
console.log('✓ /about/ /privacy/');

// ── sitemap.xml（lastmodはページ単位＝O-2-27の教訓。全URL一律の日付にしない） ──
const urls = [
  { loc: `${BASE_URL}/`, priority: '1.0', lastmod: SITE_UPDATED_AT },
  { loc: `${BASE_URL}/articles/`, priority: '0.8', lastmod: SITE_UPDATED_AT },
  ...articles.map((a) => ({ loc: `${BASE_URL}/articles/${a.id}/`, priority: '0.7', lastmod: a.updatedAt })),
  { loc: `${BASE_URL}/about/`, priority: '0.3', lastmod: SITE_UPDATED_AT },
  { loc: `${BASE_URL}/privacy/`, priority: '0.2', lastmod: SITE_UPDATED_AT },
];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml);
console.log(`✓ sitemap.xml（全${urls.length}URL）`);

console.log('--- Done ---');
