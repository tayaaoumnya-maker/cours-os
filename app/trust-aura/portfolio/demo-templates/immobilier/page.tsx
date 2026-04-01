"use client"
import { useState } from "react"

const properties = [
  { id: 1, title: "Appartement Haussmannien", location: "Paris 8e", price: "1 250 000 €", surface: "142 m²", rooms: "5 pièces", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80", tag: "Exclusivité" },
  { id: 2, title: "Penthouse vue Tour Eiffel", location: "Paris 16e", price: "3 800 000 €", surface: "280 m²", rooms: "7 pièces", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80", tag: "Coup de cœur" },
  { id: 3, title: "Maison contemporaine", location: "Neuilly-sur-Seine", price: "2 100 000 €", surface: "320 m²", rooms: "8 pièces", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80", tag: "Nouveau" },
  { id: 4, title: "Loft industriel", location: "Paris 11e", price: "680 000 €", surface: "95 m²", rooms: "3 pièces", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80", tag: "" },
  { id: 5, title: "Villa avec piscine", location: "Boulogne-Billancourt", price: "4 200 000 €", surface: "480 m²", rooms: "10 pièces", img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80", tag: "Prestige" },
  { id: 6, title: "Studio design", location: "Paris 3e", price: "320 000 €", surface: "38 m²", rooms: "1 pièce", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", tag: "" },
]

export default function ImmobilierDemo() {
  const [activeTab, setActiveTab] = useState("Acheter")
  return (
    <div className="immo-root">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .immo-root { font-family: 'Inter', system-ui, sans-serif; background: #fff; color: #1a1a2e; }
        /* NAV */
        .immo-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%; height: 72px; background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px); border-bottom: 1px solid #e8e8f0;
          position: sticky; top: 0; z-index: 10;
        }
        .immo-logo { font-size: 1.25rem; font-weight: 800; color: #1a1a2e; letter-spacing: -0.02em; }
        .immo-logo span { color: #6B46C1; }
        .immo-nav-links { display: flex; gap: 2rem; list-style: none; }
        .immo-nav-links a { color: #555; font-size: 0.88rem; text-decoration: none; }
        .immo-nav-links a:hover { color: #6B46C1; }
        .immo-nav-right { display: flex; gap: 0.8rem; align-items: center; }
        .immo-nav-login { color: #555; font-size: 0.85rem; background: none; border: none; cursor: pointer; font-family: inherit; }
        .immo-nav-cta { background: #6B46C1; color: #fff; border: none; padding: 0.55rem 1.2rem; border-radius: 7px; font-weight: 700; font-size: 0.85rem; cursor: pointer; font-family: inherit; }
        /* HERO */
        .immo-hero {
          position: relative; height: 86vh; overflow: hidden;
          background: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80') center/cover;
          display: flex; align-items: center;
        }
        .immo-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(10,8,30,0.8) 0%, rgba(10,8,30,0.3) 60%, transparent 100%); }
        .immo-hero-content { position: relative; z-index: 1; padding: 0 5%; max-width: 700px; }
        .immo-hero-badge { display: inline-block; background: #6B46C1; color: #fff; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; padding: 0.3rem 0.8rem; border-radius: 4px; margin-bottom: 1.2rem; text-transform: uppercase; }
        .immo-hero h1 { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; color: #fff; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 1.2rem; }
        .immo-hero p { color: rgba(255,255,255,0.65); font-size: 1rem; line-height: 1.7; margin-bottom: 2rem; }
        /* SEARCH BAR */
        .immo-search {
          position: absolute; bottom: -30px; left: 5%; right: 5%; z-index: 2;
          background: #fff; border-radius: 12px; padding: 1.2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }
        .immo-search-tabs { display: flex; gap: 0; margin-bottom: 1rem; border-bottom: 1px solid #e8e8f0; }
        .immo-search-tab { background: none; border: none; font-family: inherit; font-size: 0.88rem; font-weight: 600; color: #999; padding: 0.5rem 1.5rem 0.8rem; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; }
        .immo-search-tab.active { color: #6B46C1; border-bottom-color: #6B46C1; }
        .immo-search-fields { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr auto; gap: 0.8rem; align-items: end; }
        .immo-search-field label { display: block; font-size: 0.7rem; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.4rem; }
        .immo-search-input { width: 100%; background: #f8f7ff; border: 1px solid #e8e8f0; border-radius: 7px; padding: 0.7rem 1rem; font-size: 0.88rem; color: #1a1a2e; font-family: inherit; }
        .immo-search-input:focus { outline: none; border-color: #6B46C1; }
        .immo-search-btn { background: #6B46C1; color: #fff; border: none; padding: 0.75rem 1.8rem; border-radius: 7px; font-weight: 700; font-size: 0.88rem; cursor: pointer; font-family: inherit; white-space: nowrap; }
        /* PROPERTIES */
        .immo-props { padding: 6rem 5% 4rem; max-width: 1300px; margin: 0 auto; }
        .immo-props-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .immo-props-header h2 { font-size: 1.6rem; font-weight: 900; letter-spacing: -0.02em; }
        .immo-props-filters { display: flex; gap: 0.5rem; }
        .immo-filter { background: #f5f3ff; border: 1px solid #e8e0ff; color: #6B46C1; font-size: 0.78rem; font-weight: 600; padding: 0.4rem 1rem; border-radius: 99px; cursor: pointer; font-family: inherit; }
        .immo-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
        .immo-card { border-radius: 12px; overflow: hidden; border: 1px solid #e8e8f0; cursor: pointer; transition: transform 0.25s, box-shadow 0.25s; background: #fff; }
        .immo-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(107,70,193,0.12); }
        .immo-card-img { position: relative; height: 220px; overflow: hidden; }
        .immo-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .immo-card:hover .immo-card-img img { transform: scale(1.05); }
        .immo-card-tag { position: absolute; top: 10px; left: 10px; background: #6B46C1; color: #fff; font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 4px; letter-spacing: 0.04em; }
        .immo-card-fav { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; cursor: pointer; }
        .immo-card-body { padding: 1.2rem; }
        .immo-card-price { font-size: 1.2rem; font-weight: 900; color: #6B46C1; margin-bottom: 0.3rem; }
        .immo-card-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.2rem; }
        .immo-card-location { font-size: 0.8rem; color: #999; margin-bottom: 0.9rem; }
        .immo-card-specs { display: flex; gap: 1rem; }
        .immo-card-spec { font-size: 0.75rem; color: #666; display: flex; align-items: center; gap: 0.3rem; }
        /* STATS */
        .immo-stats { background: #1a1a2e; padding: 4rem 5%; display: grid; grid-template-columns: repeat(4,1fr); gap: 2rem; }
        .immo-stat { text-align: center; }
        .immo-stat-val { font-size: 2.2rem; font-weight: 900; color: #9F7AEA; margin-bottom: 0.4rem; }
        .immo-stat-label { font-size: 0.8rem; color: rgba(255,255,255,0.4); }
        /* FOOTER */
        .immo-footer { background: #0f0e1a; padding: 3rem 5%; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .immo-footer-logo { font-size: 1rem; font-weight: 800; color: #fff; }
        .immo-footer-logo span { color: #9F7AEA; }
        .immo-footer-copy { font-size: 0.75rem; color: rgba(255,255,255,0.2); }
        @media (max-width: 900px) {
          .immo-nav-links { display: none; }
          .immo-grid { grid-template-columns: repeat(2,1fr); }
          .immo-search-fields { grid-template-columns: 1fr 1fr; }
          .immo-stats { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 560px) {
          .immo-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <nav className="immo-nav">
        <div className="immo-logo">Immo<span>Prime</span></div>
        <ul className="immo-nav-links">
          <li><a href="#">Acheter</a></li>
          <li><a href="#">Louer</a></li>
          <li><a href="#">Estimer</a></li>
          <li><a href="#">L'agence</a></li>
        </ul>
        <div className="immo-nav-right">
          <button className="immo-nav-login">Connexion</button>
          <button className="immo-nav-cta">Contacter un agent</button>
        </div>
      </nav>

      <section className="immo-hero">
        <div className="immo-hero-overlay" />
        <div className="immo-hero-content">
          <div className="immo-hero-badge">Agence Prestige · Paris & IDF</div>
          <h1>Trouvez le bien<br />de vos rêves</h1>
          <p>Plus de 500 biens d'exception à Paris et en Île-de-France. Des experts à votre service pour chaque étape de votre projet.</p>
        </div>
        <div className="immo-search">
          <div className="immo-search-tabs">
            {["Acheter", "Louer", "Estimer"].map((t) => (
              <button key={t} className={`immo-search-tab${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>
            ))}
          </div>
          <div className="immo-search-fields">
            <div className="immo-search-field">
              <label>Localisation</label>
              <input className="immo-search-input" placeholder="Paris, Neuilly..." />
            </div>
            <div className="immo-search-field">
              <label>Type de bien</label>
              <input className="immo-search-input" placeholder="Appartement, Maison..." />
            </div>
            <div className="immo-search-field">
              <label>Budget max</label>
              <input className="immo-search-input" placeholder="2 000 000 €" />
            </div>
            <div className="immo-search-field">
              <label>Surface min</label>
              <input className="immo-search-input" placeholder="80 m²" />
            </div>
            <button className="immo-search-btn">🔍 Rechercher</button>
          </div>
        </div>
      </section>

      <section className="immo-props">
        <div className="immo-props-header">
          <h2>Nos biens en exclusivité</h2>
          <div className="immo-props-filters">
            {["Prix ↑", "Surface", "Récents"].map((f) => (
              <button key={f} className="immo-filter">{f}</button>
            ))}
          </div>
        </div>
        <div className="immo-grid">
          {properties.map((p) => (
            <div key={p.id} className="immo-card">
              <div className="immo-card-img">
                <img src={p.img} alt={p.title} />
                {p.tag && <div className="immo-card-tag">{p.tag}</div>}
                <div className="immo-card-fav">♡</div>
              </div>
              <div className="immo-card-body">
                <div className="immo-card-price">{p.price}</div>
                <div className="immo-card-title">{p.title}</div>
                <div className="immo-card-location">📍 {p.location}</div>
                <div className="immo-card-specs">
                  <span className="immo-card-spec">⬜ {p.surface}</span>
                  <span className="immo-card-spec">🚪 {p.rooms}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="immo-stats">
        {[["500+","Biens en portefeuille"],["15 ans","D'expertise"],["2 400","Transactions réalisées"],["98%","Clients satisfaits"]].map(([v,l]) => (
          <div key={l} className="immo-stat">
            <div className="immo-stat-val">{v}</div>
            <div className="immo-stat-label">{l}</div>
          </div>
        ))}
      </div>

      <footer className="immo-footer">
        <div className="immo-footer-logo">Immo<span>Prime</span></div>
        <div className="immo-footer-copy">© 2024 ImmoPrime · Paris · Tous droits réservés</div>
      </footer>
    </div>
  )
}
