import { articles } from '../data/articles';
import { renderMarkdown } from '../lib/md';
import { href } from '../lib/router';
import { figureHtml } from '../data/figures-data';

export default function ArticlePage({ id }: { id: string }) {
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <>
        <h1 className="content-h1">記事が見つかりません</h1>
        <p className="content-p">
          <a href={href('/articles/')}>記事一覧に戻る</a>
        </p>
      </>
    );
  }

  const prev = articles.find((a) => a.order === article.order - 1);
  const next = articles.find((a) => a.order === article.order + 1);
  const fig = figureHtml(article.id);

  return (
    <>
      <div className="article-header">
        <h1 className="article-h1">{article.title}</h1>
        <p className="article-dek">{article.dek}</p>
      </div>

      <div className="article-body">{renderMarkdown(article.body)}</div>

      {fig && <div dangerouslySetInnerHTML={{ __html: fig }} />}

      <div className="article-sources">
        <div className="article-sources__label">出典</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {article.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="article-nav">
        {prev ? <a href={href(`/articles/${prev.id}/`)}>← {prev.title}</a> : <span />}
        {next ? <a href={href(`/articles/${next.id}/`)}>{next.title} →</a> : <span />}
      </div>
    </>
  );
}
