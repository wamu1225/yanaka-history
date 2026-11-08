import { articles } from '../data/articles';
import { ARTICLE_GROUPS } from '../data/articleGroups';
import { HOOK } from '../data/hooks';
import { heroSceneSvg } from '../data/figures-data';
import { ARTICLE_ICON, iconSvg } from '../data/icons';
import { SITE_NAME } from '../data/static-pages';
import { href } from '../lib/router';

const Icon = ({ name, size }: { name: string; size: number }) => (
  <span className="icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: iconSvg(name, size) }} />
);

// トップ：最初の1画面に、この町ならではの事実（つかみ）と町の絵。説明文から始めない（2026-11-08）
export default function Home() {
  const titleOf = (id: string) => articles.find((a) => a.id === id)?.title ?? '';
  return (
    <>
      <section className="hook">
        <p className="hook__eyebrow">{SITE_NAME}　東京都台東区 谷中</p>
        <h1 className="hook__catch">{HOOK.catch}</h1>
        <p className="hook__sub">{HOOK.sub}</p>
        <div className="hook__scene" dangerouslySetInnerHTML={{ __html: heroSceneSvg() }} />
      </section>

      <section className="hook-numbers" aria-label="数字で見る谷中">
        {HOOK.numbers.map((x) => (
          <a key={x.label} className="hook-number" href={href(`/articles/${x.id}/`)}>
            <span className="hook-number__icon"><Icon name={x.icon} size={22} /></span>
            <span className="hook-number__n">{x.n}<small>{x.unit}</small></span>
            <span className="hook-number__label">{x.label}</span>
          </a>
        ))}
      </section>

      <section className="hook-questions" aria-labelledby="q-title">
        <h2 id="q-title" className="hook-section-title">気になる問いから読む</h2>
        <ul>
          {HOOK.questions.map((x) => (
            <li key={x.q}>
              <a href={href(`/articles/${x.id}/`)}>
                <span className="hook-q__icon"><Icon name={x.icon} size={22} /></span>
                <span className="hook-q__text">
                  <span className="hook-q">{x.q}</span>
                  <span className="hook-a">{x.a}</span>
                  <span className="hook-more">{titleOf(x.id)} →</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="category-groups hook-all" aria-labelledby="articles-title">
        <h2 id="articles-title" className="hook-section-title">記事をぜんぶ見る</h2>
        {ARTICLE_GROUPS.map((g) => (
          <div key={g.title} className="category-group">
            <h3 className="hook-group__title">{g.title}</h3>
            <p className="category-group__dek">{g.lead}</p>
            <ul className="category-group__list hook-group__list">
              {g.ids.map((id) => (
                <li key={id}>
                  <a href={href(`/articles/${id}/`)}>
                    {ARTICLE_ICON[id] && <Icon name={ARTICLE_ICON[id]} size={20} />}
                    <span>{titleOf(id)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
