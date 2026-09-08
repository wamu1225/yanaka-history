import { zones } from '../data/zones';
import { SITE_NAME } from '../data/static-pages';
import { href } from '../lib/router';

export default function Home() {
  return (
    <>
      <div className="home-intro">
        <h1 className="content-h1">{SITE_NAME}</h1>
        <p className="home-intro__lede">
          谷中には、大正から昭和初期の木造家屋がまとまって残っている。理由は「運が良かった」だけではない。
        </p>
        <p>
          1945年3月4日の空襲は、谷中の中でも一角だけを壊滅させ、残りの大部分をほぼ無傷のまま残した。同じ地区の中にある「被災したエリア」と「焼け残ったエリア」を見比べることで、なぜここだけ戦前の町並みが残ったのかが分かる。
        </p>
      </div>

      <div className="zone-grid">
        {zones.map((zone) => (
          <div key={zone.id} className={`zone-card${zone.id === 'surviving' ? ' zone-card--surviving' : ''}`}>
            <div className="zone-card__label">{zone.label}</div>
            <p className="zone-card__summary">{zone.summary}</p>
            <ul className="zone-card__spots">
              {zone.spots.map((spot) => (
                <li key={spot.id}>
                  <strong>{spot.name}</strong>
                  {spot.note}
                </li>
              ))}
            </ul>
            <a className="zone-card__link" href={href(`/articles/${zone.articleId}/`)}>
              このエリアを読む →
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
