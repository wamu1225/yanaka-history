import { useCallback, useEffect, useState } from 'react';
import { BASE, getCurrentPath, href, navigate } from './lib/router';
import { SITE_NAME, ABOUT_CONTENT, PRIVACY_CONTENT } from './data/static-pages';
import Home from './pages/Home';
import ArticleIndex from './pages/ArticleIndex';
import ArticlePage from './pages/ArticlePage';
import StaticPage from './pages/StaticPage';

function useRoute() {
  const [path, setPath] = useState(getCurrentPath());
  useEffect(() => {
    const onPop = () => setPath(getCurrentPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

export default function App() {
  const path = useRoute();

  const onNavClick = useCallback((e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest('a');
    if (!target) return;
    const url = target.getAttribute('href');
    if (!url || !url.startsWith(BASE) || target.target === '_blank') return;
    e.preventDefault();
    navigate(url.slice(BASE.length) || '/');
  }, []);

  let page: React.ReactNode;
  const articleMatch = path.match(/^\/articles\/([a-z0-9-]+)\/?$/);

  if (path === '/') {
    page = <Home />;
  } else if (path === '/articles/') {
    page = <ArticleIndex />;
  } else if (articleMatch) {
    page = <ArticlePage key={articleMatch[1]} id={articleMatch[1]} />;
  } else if (path === '/about/') {
    page = <StaticPage title="このサイトについて" content={ABOUT_CONTENT} />;
  } else if (path === '/privacy/') {
    page = <StaticPage title="プライバシーポリシー" content={PRIVACY_CONTENT} />;
  } else {
    page = <NotFound />;
  }

  return (
    <div className="site-shell" onClick={onNavClick}>
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__title">
            <a href={href('/')}>{SITE_NAME}</a>
          </div>
          <nav className="site-header__nav">
            <a href={href('/articles/')}>記事一覧</a>
            <a href={href('/about/')}>このサイトについて</a>
          </nav>
        </div>
      </header>
      <main className="site-main">{page}</main>
      <footer className="site-footer">
        <a href={href('/about/')}>このサイトについて</a> ／ <a href={href('/privacy/')}>プライバシーポリシー</a>
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <>
      <h1 className="content-h1">ページが見つかりません</h1>
      <p className="content-p">
        <a href={href('/')}>トップへ戻る</a>
      </p>
    </>
  );
}
