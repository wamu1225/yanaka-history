import { articles, CATEGORY_LABEL } from '../data/articles';
import { ARTICLE_GROUPS } from '../data/articleGroups';
import { href } from '../lib/router';

// 記事を「読む順」のまとまりに分けて並べる。どのまとまりにも入っていない記事は最後に
export default function ArticleIndex() {
  const grouped = new Set(ARTICLE_GROUPS.flatMap((g) => g.ids));
  const groups = [
    ...ARTICLE_GROUPS.map((g) => ({ ...g, items: g.ids.map((id) => articles.find((a) => a.id === id)).filter((a) => a !== undefined) })),
    { title: 'そのほか', lead: '', ids: [], items: articles.filter((a) => !grouped.has(a.id)) },
  ].filter((g) => g.items.length);
  return (
    <>
      <h1 className="content-h1">記事一覧</h1>
      <p className="content-p">谷中の寺町形成から、震災と空襲、戦後の街並み保存運動までをまとめた記事です。</p>
      {groups.map((g) => (
        <section key={g.title} className="article-index__group">
          <h2>{g.title}</h2>
          {g.lead && <p className="article-index__lead">{g.lead}</p>}
          <ul className="article-index-list">
            {g.items.map((a) => (
              <li key={a.id}>
                <span className="article-index-list__category">{CATEGORY_LABEL[a.category]}</span>
                <a href={href(`/articles/${a.id}/`)}>{a.title}</a>
                <p>{a.dek}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
