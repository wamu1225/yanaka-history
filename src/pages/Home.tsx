import { articles, CATEGORY_LABEL, type Category } from '../data/articles';
import { SITE_NAME } from '../data/static-pages';
import { href } from '../lib/router';

const CATEGORY_ORDER: Category[] = ['name-origin', 'history', 'shrine', 'food', 'industry', 'culture', 'spots', 'faq'];

export default function Home() {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    list: articles.filter((a) => a.category === cat),
  })).filter((g) => g.list.length > 0);

  return (
    <>
      <div className="home-intro">
        <h1 className="content-h1">{SITE_NAME}</h1>
        <p className="home-intro__lede">
          谷中には、大正から昭和初期の木造家屋がまとまって残っている。寺町としての成り立ち、関東大震災と東京大空襲を経て今の姿になった経緯、そして戦後の街並み保存運動まで、谷中の歴史と文化を分野別にまとめている。
        </p>
      </div>

      <div className="category-groups">
        {grouped.map(({ category, list }) => (
          <div key={category} className="category-group">
            <h2 className="category-group__title">{CATEGORY_LABEL[category]}</h2>
            <ul className="category-group__list">
              {list.map((a) => (
                <li key={a.id}>
                  <a href={href(`/articles/${a.id}/`)}>{a.title}</a>
                  <p className="category-group__dek">{a.dek}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
