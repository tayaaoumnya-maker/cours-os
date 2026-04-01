"use client"
import { useState } from "react"

const destinations = [
  { id: 1, name: "Bali, Indonésie", duration: "10 jours", price: "1 890€", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", tag: "Coup de cœur", rating: "4.9" },
  { id: 2, name: "Maldives", duration: "8 jours", price: "3 450€", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80", tag: "Luxe", rating: "5.0" },
  { id: 3, name: "Marrakech, Maroc", duration: "5 jours", price: "690€", img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80", tag: "Populaire", rating: "4.8" },
  { id: 4, name: "Santorin, Grèce", duration: "7 jours", price: "1 290€", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", tag: "Bestseller", rating: "4.9" },
  { id: 5, name: "Tokyo, Japon", duration: "12 jours", price: "2 490€", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80", tag: "Nouveau", rating: "5.0" },
  { id: 6, name: "New York, USA", duration: "6 jours", price: "1 190€", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80", tag: "", rating: "4.7" },
]

const categories = ["Tous", "Plage & Mer", "Culture", "Aventure", "Luxe", "City Break"]

export default function AgenceVoyageDemo() {
  const [activeTab, setActiveTab] = useState("Tous")
  const [search, setSearch] = useState("")

  return (
    <div className="av-root">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .av-root { font-family: 'Inter', system-ui, sans-serif; background: #F8FAFF; color: #0F172A; }

        /* NAV */
        .av-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%; height: 68px; background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px); border-bottom: 1px solid #E8EDF5;
          position: sticky; top: 0; z-index: 10;
        }
        .av-logo { font-size: 1.25rem; font-weight: 800; color: #0F172A; display: flex; align-items: center; gap: 0.5rem; }
        .av-logo-icon { width: 28px; height: 28px; background: linear-gradient(135deg, #0EA5E9, #6366F1); border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
        .av-logo span { color: #0EA5E9; }
        .av-nav-links { display: flex; gap: 2rem; list-style: none; }
        .av-nav-links a { color: #64748B; font-size: 0.88rem; text-decoration: none; transition: color 0.2s; }
        .av-nav-links a:hover { color: #0EA5E9; }
        .av-nav-right { display: flex; gap: 0.8rem; align-items: center; }
        .av-nav-phone { font-size: 0.8rem; color: #64748B; }
        .av-nav-cta { background: linear-gradient(135deg, #0EA5E9, #6366F1); color: #fff; border: none; padding: 0.55rem 1.2rem; border-radius: 7px; font-weight: 700; font-size: 0.82rem; cursor: pointer; font-family: inherit; }

        /* HERO */
        .av-hero {
          min-height: 90vh; position: relative; overflow: hidden;
          background: url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1400&q=80') center/cover;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 5rem 5%;
        }
        .av-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.3) 50%, rgba(15,23,42,0.7) 100%); }
        .av-hero-content { position: relative; z-index: 1; max-width: 800px; }
        .av-hero-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.25); color: #fff; font-size: 0.72rem; font-weight: 600; padding: 0.3rem 0.85rem; border-radius: 99px; margin-bottom: 1.5rem; letter-spacing: 0.06em; }
        .av-hero h1 { font-size: clamp(2.8rem, 7vw, 5.5rem); font-weight: 900; color: #fff; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 1.2rem; }
        .av-hero h1 span { background: linear-gradient(135deg, #38BDF8, #818CF8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .av-hero p { color: rgba(255,255,255,0.7); font-size: 1.05rem; line-height: 1.7; margin-bottom: 3rem; }

        /* SEARCH BOX */
        .av-search {
          background: #fff; border-radius: 14px; padding: 1.2rem 1.5rem;
          display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          max-width: 900px; width: 100%;
        }
        .av-search-field { flex: 1; min-width: 140px; }
        .av-search-field label { display: block; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94A3B8; margin-bottom: 0.4rem; }
        .av-search-input { width: 100%; background: #F8FAFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.7rem 1rem; font-size: 0.88rem; color: #0F172A; font-family: inherit; }
        .av-search-input:focus { outline: none; border-color: #0EA5E9; }
        .av-search-btn { background: linear-gradient(135deg, #0EA5E9, #6366F1); color: #fff; border: none; padding: 0.75rem 1.8rem; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; font-family: inherit; white-space: nowrap; }

        /* TRUST */
        .av-trust { background: #0F172A; display: grid; grid-template-columns: repeat(4,1fr); }
        .av-trust-item { padding: 1.8rem; text-align: center; border-right: 1px solid rgba(255,255,255,0.06); }
        .av-trust-item:last-child { border: none; }
        .av-trust-icon { font-size: 1.4rem; margin-bottom: 0.5rem; }
        .av-trust-val { font-size: 1.5rem; font-weight: 900; background: linear-gradient(135deg, #38BDF8, #818CF8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .av-trust-label { font-size: 0.72rem; color: rgba(255,255,255,0.35); margin-top: 0.2rem; }

        /* DESTINATIONS */
        .av-dests { padding: 5rem 5%; max-width: 1300px; margin: 0 auto; }
        .av-dests-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .av-dests h2 { font-size: 1.8rem; font-weight: 900; letter-spacing: -0.02em; }
        .av-cats { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .av-cat { background: #fff; border: 1px solid #E2E8F0; color: #64748B; font-size: 0.78rem; font-weight: 600; padding: 0.4rem 1rem; border-radius: 99px; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .av-cat.active { background: linear-gradient(135deg, #0EA5E9, #6366F1); color: #fff; border-color: transparent; }
        .av-cat:hover:not(.active) { border-color: #0EA5E9; color: #0EA5E9; }
        .av-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
        .av-card { background: #fff; border-radius: 14px; overflow: hidden; cursor: pointer; border: 1px solid #E8EDF5; transition: transform 0.25s, box-shadow 0.25s; }
        .av-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(14,165,233,0.12); }
        .av-card-img { position: relative; height: 220px; overflow: hidden; }
        .av-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .av-card:hover .av-card-img img { transform: scale(1.06); }
        .av-card-tag { position: absolute; top: 10px; left: 10px; background: linear-gradient(135deg, #0EA5E9, #6366F1); color: #fff; font-size: 0.65rem; font-weight: 700; padding: 0.22rem 0.65rem; border-radius: 4px; }
        .av-card-fav { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; cursor: pointer; }
        .av-card-body { padding: 1.2rem; }
        .av-card-rating { display: flex; align-items: center; gap: 0.3rem; font-size: 0.75rem; color: #F59E0B; font-weight: 700; margin-bottom: 0.4rem; }
        .av-card-name { font-size: 1rem; font-weight: 800; margin-bottom: 0.2rem; }
        .av-card-duration { font-size: 0.78rem; color: #94A3B8; margin-bottom: 0.9rem; }
        .av-card-footer { display: flex; align-items: center; justify-content: space-between; }
        .av-card-price { font-size: 1.15rem; font-weight: 900; color: #0EA5E9; }
        .av-card-price span { font-size: 0.72rem; color: #94A3B8; font-weight: 400; }
        .av-card-btn { background: linear-gradient(135deg, #0EA5E9, #6366F1); color: #fff; border: none; padding: 0.45rem 1rem; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; font-family: inherit; }

        /* PROMO */
        .av-promo {
          margin: 2rem 5%; border-radius: 16px; overflow: hidden;
          display: grid; grid-template-columns: 1fr 1.2fr;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          max-width: 1300px; margin-left: auto; margin-right: auto;
        }
        .av-promo-img { background: url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80') center/cover; min-height: 300px; }
        .av-promo-text { padding: 3.5rem; display: flex; flex-direction: column; justify-content: center; }
        .av-promo-badge { display: inline-block; background: rgba(14,165,233,0.15); color: #38BDF8; font-size: 0.7rem; font-weight: 700; padding: 0.3rem 0.85rem; border-radius: 4px; margin-bottom: 1rem; letter-spacing: 0.06em; text-transform: uppercase; }
        .av-promo h3 { font-size: clamp(1.5rem, 2.5vw, 2.2rem); font-weight: 900; color: #fff; margin-bottom: 0.8rem; letter-spacing: -0.02em; line-height: 1.2; }
        .av-promo h3 span { color: #38BDF8; }
        .av-promo p { color: rgba(255,255,255,0.45); font-size: 0.9rem; margin-bottom: 2rem; line-height: 1.65; }
        .av-promo-btn { background: linear-gradient(135deg, #0EA5E9, #6366F1); color: #fff; border: none; padding: 0.85rem 1.8rem; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; font-family: inherit; align-self: flex-start; }

        /* FOOTER */
        .av-footer { background: #0F172A; padding: 3rem 5%; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 4rem; }
        .av-footer-logo { font-size: 1rem; font-weight: 800; color: #fff; }
        .av-footer-logo span { color: #38BDF8; }
        .av-footer-copy { font-size: 0.75rem; color: rgba(255,255,255,0.2); }

        @media (max-width: 900px) {
          .av-nav-links { display: none; }
          .av-grid { grid-template-columns: repeat(2,1fr); }
          .av-trust { grid-template-columns: repeat(2,1fr); }
          .av-promo { grid-template-columns: 1fr; }
          .av-promo-img { min-height: 220px; }
        }
        @media (max-width: 560px) {
          .av-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <nav className="av-nav">
        <div className="av-logo">
          <div className="av-logo-icon">✈️</div>
          Dream<span>Away</span>
        </div>
        <ul className="av-nav-links">
          <li><a href="#">Destinations</a></li>
          <li><a href="#">Circuits</a></li>
          <li><a href="#">Séjours</a></li>
          <li><a href="#">Sur mesure</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
        <div className="av-nav-right">
          <span className="av-nav-phone">📞 01 23 45 67 89</span>
          <button className="av-nav-cta">Devis gratuit →</button>
        </div>
      </nav>

      <section className="av-hero">
        <div className="av-hero-overlay" />
        <div className="av-hero-content">
          <div className="av-hero-badge">✦ Voyagiste indépendant depuis 2010</div>
          <h1>Le monde vous<br /><span>attend</span></h1>
          <p>Des voyages sur mesure créés par des passionnés. Chaque destination, chaque expérience, pensée pour vous.</p>
          <div className="av-search">
            <div className="av-search-field">
              <label>Destination</label>
              <input className="av-search-input" placeholder="Bali, Grèce, Japon..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="av-search-field">
              <label>Départ</label>
              <input className="av-search-input" type="date" />
            </div>
            <div className="av-search-field">
              <label>Durée</label>
              <input className="av-search-input" placeholder="7 nuits, 10 jours..." />
            </div>
            <div className="av-search-field">
              <label>Voyageurs</label>
              <input className="av-search-input" placeholder="2 adultes" />
            </div>
            <button className="av-search-btn">🔍 Rechercher</button>
          </div>
        </div>
      </section>

      <div className="av-trust">
        {[["✈️","12 000+","Voyageurs/an"],["🌍","85","Destinations"],["⭐","4.9/5","Note clients"],["🏆","15 ans","D'expertise"]].map(([icon,val,label]) => (
          <div key={String(label)} className="av-trust-item">
            <div className="av-trust-icon">{String(icon)}</div>
            <div className="av-trust-val">{String(val)}</div>
            <div className="av-trust-label">{String(label)}</div>
          </div>
        ))}
      </div>

      <section className="av-dests">
        <div className="av-dests-header">
          <h2>Nos destinations phares</h2>
          <div className="av-cats">
            {categories.map((c) => (
              <button key={c} className={`av-cat${activeTab === c ? " active" : ""}`} onClick={() => setActiveTab(c)}>{c}</button>
            ))}
          </div>
        </div>
        <div className="av-grid">
          {destinations.map((d) => (
            <div key={d.id} className="av-card">
              <div className="av-card-img">
                <img src={d.img} alt={d.name} />
                {d.tag && <div className="av-card-tag">{d.tag}</div>}
                <div className="av-card-fav">♡</div>
              </div>
              <div className="av-card-body">
                <div className="av-card-rating">★ {d.rating}</div>
                <div className="av-card-name">{d.name}</div>
                <div className="av-card-duration">🕐 {d.duration}</div>
                <div className="av-card-footer">
                  <div className="av-card-price">{d.price} <span>/ pers.</span></div>
                  <button className="av-card-btn">Voir →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="av-promo">
        <div className="av-promo-img" />
        <div className="av-promo-text">
          <div className="av-promo-badge">Offre spéciale · Limité</div>
          <h3>Paris → Maldives<br /><span>-30% ce mois</span></h3>
          <p>8 nuits en villa overwater, all-inclusive, vols inclus. Une expérience hors du commun à prix exceptionnel.</p>
          <button className="av-promo-btn">En profiter →</button>
        </div>
      </div>

      <footer className="av-footer">
        <div className="av-footer-logo">Dream<span>Away</span></div>
        <div className="av-footer-copy">© 2024 DreamAway · Agence de voyages · Tous droits réservés</div>
      </footer>
    </div>
  )
}
