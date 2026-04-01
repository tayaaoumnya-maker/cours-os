"use client"
import { useState } from "react"

const products = [
  { id: 1, name: "Panier Légumes Bio", price: "28€/sem", unit: "6-8 légumes de saison", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80", tag: "Bestseller" },
  { id: 2, name: "Box Fruits Locaux", price: "22€/sem", unit: "1,5 kg de fruits", img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80", tag: "Nouveau" },
  { id: 3, name: "Fromages Fermiers", price: "18€/sem", unit: "4 fromages artisanaux", img: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80", tag: "" },
  { id: 4, name: "Pain & Viennoiseries", price: "14€/sem", unit: "Boulangerie locale", img: "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400&q=80", tag: "Coup de ♥" },
  { id: 5, name: "Box Épicerie Fine", price: "35€/sem", unit: "Huiles, condiments, pâtes", img: "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=400&q=80", tag: "" },
  { id: 6, name: "Panier Complet", price: "65€/sem", unit: "Légumes + fruits + œufs", img: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80", tag: "Populaire" },
]

const producers = [
  { name: "Ferme des Lilas", location: "Seine-et-Marne", specialty: "Légumes & aromates", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&q=80" },
  { name: "Moulin Bertrand", location: "Essonne", specialty: "Farines & céréales", img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&q=80" },
  { name: "La Fromagerie du Coin", location: "Normandie", specialty: "Fromages fermiers", img: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=300&q=80" },
]

export default function BioMarcheDemo() {
  const [cart, setCart] = useState(0)
  const [tab, setTab] = useState("Abonnement")

  return (
    <div className="bio-root">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .bio-root { font-family: 'Inter', system-ui, sans-serif; background: #FAFAF7; color: #1C1C1A; }

        /* NAV */
        .bio-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%; height: 68px;
          background: #fff; border-bottom: 1px solid #E8E8E0;
          position: sticky; top: 0; z-index: 10;
        }
        .bio-logo { display: flex; align-items: center; gap: 0.5rem; font-size: 1.2rem; font-weight: 800; color: #1C1C1A; }
        .bio-logo-icon { width: 30px; height: 30px; background: #2D6A4F; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
        .bio-logo span { color: #2D6A4F; }
        .bio-nav-links { display: flex; gap: 2rem; list-style: none; }
        .bio-nav-links a { color: #555; font-size: 0.88rem; text-decoration: none; transition: color 0.2s; }
        .bio-nav-links a:hover { color: #2D6A4F; }
        .bio-nav-right { display: flex; gap: 0.8rem; align-items: center; }
        .bio-nav-location { font-size: 0.78rem; color: #888; background: #F5F5EF; padding: 0.35rem 0.8rem; border-radius: 99px; border: 1px solid #E8E8E0; }
        .bio-nav-cart { background: #2D6A4F; color: #fff; border: none; padding: 0.55rem 1.1rem; border-radius: 7px; font-weight: 700; font-size: 0.82rem; cursor: pointer; font-family: inherit; }

        /* HERO */
        .bio-hero {
          display: grid; grid-template-columns: 1fr 1fr; min-height: 88vh; align-items: center;
          background: #F0F7F4;
        }
        .bio-hero-text { padding: 4rem 5%; }
        .bio-hero-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: #D8F3DC; color: #2D6A4F; font-size: 0.72rem; font-weight: 700;
          padding: 0.3rem 0.85rem; border-radius: 99px; margin-bottom: 1.5rem;
          letter-spacing: 0.04em; text-transform: uppercase;
        }
        .bio-hero h1 { font-size: clamp(2.2rem, 4vw, 3.5rem); font-weight: 900; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 1.2rem; }
        .bio-hero h1 span { color: #2D6A4F; }
        .bio-hero p { color: #666; font-size: 0.95rem; line-height: 1.75; margin-bottom: 2rem; max-width: 440px; }
        .bio-hero-features { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 2.5rem; }
        .bio-hero-feature { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: #555; background: #fff; border: 1px solid #E8E8E0; padding: 0.4rem 0.9rem; border-radius: 99px; }
        .bio-btn { background: #2D6A4F; color: #fff; border: none; padding: 0.9rem 2rem; border-radius: 8px; font-weight: 700; font-size: 0.92rem; cursor: pointer; font-family: inherit; transition: background 0.2s; }
        .bio-btn:hover { background: #1E4D39; }
        .bio-btn-out { background: transparent; color: #2D6A4F; border: 1.5px solid #2D6A4F; padding: 0.9rem 1.8rem; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer; font-family: inherit; margin-left: 0.8rem; }
        .bio-hero-img { height: 88vh; background: url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80') center/cover; }

        /* STATS */
        .bio-stats { background: #2D6A4F; display: grid; grid-template-columns: repeat(4,1fr); }
        .bio-stat { padding: 2rem; text-align: center; border-right: 1px solid rgba(255,255,255,0.1); }
        .bio-stat:last-child { border: none; }
        .bio-stat-val { font-size: 1.8rem; font-weight: 900; color: #B7E4C7; margin-bottom: 0.3rem; }
        .bio-stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.55); }

        /* BOXES */
        .bio-boxes { padding: 5rem 5%; max-width: 1300px; margin: 0 auto; }
        .bio-boxes-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem; }
        .bio-boxes-header h2 { font-size: 1.8rem; font-weight: 900; letter-spacing: -0.02em; }
        .bio-tabs { display: flex; gap: 0; background: #F0F0E8; border-radius: 8px; padding: 3px; }
        .bio-tab { background: none; border: none; font-family: inherit; font-size: 0.82rem; font-weight: 600; color: #888; padding: 0.45rem 1rem; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
        .bio-tab.active { background: #fff; color: #2D6A4F; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        .bio-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.3rem; }
        .bio-card { background: #fff; border: 1px solid #E8E8E0; border-radius: 12px; overflow: hidden; cursor: pointer; transition: transform 0.25s, box-shadow 0.25s; }
        .bio-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(45,106,79,0.1); }
        .bio-card-img { position: relative; height: 200px; overflow: hidden; }
        .bio-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .bio-card:hover .bio-card-img img { transform: scale(1.05); }
        .bio-card-tag { position: absolute; top: 10px; left: 10px; background: #2D6A4F; color: #fff; font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 4px; }
        .bio-card-body { padding: 1.2rem; }
        .bio-card-name { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.25rem; }
        .bio-card-unit { font-size: 0.78rem; color: #888; margin-bottom: 0.9rem; }
        .bio-card-footer { display: flex; align-items: center; justify-content: space-between; }
        .bio-card-price { font-size: 1.1rem; font-weight: 900; color: #2D6A4F; }
        .bio-card-add { background: #2D6A4F; color: #fff; border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: inherit; }

        /* HOW IT WORKS */
        .bio-how { background: #fff; padding: 5rem 5%; }
        .bio-how-inner { max-width: 1100px; margin: 0 auto; }
        .bio-how h2 { font-size: 1.8rem; font-weight: 900; text-align: center; margin-bottom: 3rem; letter-spacing: -0.02em; }
        .bio-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 2rem; }
        .bio-step { text-align: center; }
        .bio-step-num { width: 48px; height: 48px; background: #D8F3DC; color: #2D6A4F; font-size: 1.1rem; font-weight: 900; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
        .bio-step h3 { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem; }
        .bio-step p { font-size: 0.82rem; color: #777; line-height: 1.6; }

        /* PRODUCTEURS */
        .bio-producers { padding: 5rem 5%; max-width: 1100px; margin: 0 auto; }
        .bio-producers h2 { font-size: 1.8rem; font-weight: 900; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
        .bio-producers-sub { color: #888; font-size: 0.9rem; margin-bottom: 2.5rem; }
        .bio-producers-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.3rem; }
        .bio-producer { border: 1px solid #E8E8E0; border-radius: 12px; overflow: hidden; background: #fff; }
        .bio-producer-img { height: 160px; overflow: hidden; }
        .bio-producer-img img { width: 100%; height: 100%; object-fit: cover; }
        .bio-producer-body { padding: 1.1rem; }
        .bio-producer-name { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.2rem; }
        .bio-producer-loc { font-size: 0.75rem; color: #2D6A4F; margin-bottom: 0.3rem; }
        .bio-producer-spec { font-size: 0.78rem; color: #888; }

        /* CTA */
        .bio-cta { background: #1C1C1A; padding: 5rem 5%; text-align: center; }
        .bio-cta h2 { font-size: clamp(1.8rem,3vw,2.8rem); font-weight: 900; color: #fff; margin-bottom: 0.8rem; letter-spacing: -0.02em; }
        .bio-cta h2 span { color: #B7E4C7; }
        .bio-cta p { color: rgba(255,255,255,0.45); margin-bottom: 2rem; }
        .bio-cta-btn { background: #2D6A4F; color: #fff; border: none; padding: 1rem 2.5rem; border-radius: 8px; font-weight: 700; font-size: 0.95rem; cursor: pointer; font-family: inherit; }

        /* FOOTER */
        .bio-footer { background: #111110; padding: 3rem 5%; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .bio-footer-logo { font-size: 1rem; font-weight: 800; color: #fff; }
        .bio-footer-logo span { color: #B7E4C7; }
        .bio-footer-links { display: flex; gap: 1.5rem; }
        .bio-footer-links a { font-size: 0.78rem; color: rgba(255,255,255,0.3); text-decoration: none; }
        .bio-footer-copy { font-size: 0.75rem; color: rgba(255,255,255,0.2); }

        @media (max-width: 900px) {
          .bio-nav-links { display: none; }
          .bio-hero { grid-template-columns: 1fr; }
          .bio-hero-img { height: 300px; }
          .bio-stats, .bio-grid, .bio-steps, .bio-producers-grid { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 560px) {
          .bio-grid, .bio-producers-grid { grid-template-columns: 1fr; }
          .bio-stats { grid-template-columns: repeat(2,1fr); }
          .bio-steps { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAV */}
      <nav className="bio-nav">
        <div className="bio-logo">
          <div className="bio-logo-icon">🌿</div>
          Bio<span>Marché</span>
        </div>
        <ul className="bio-nav-links">
          <li><a href="#">Nos box</a></li>
          <li><a href="#">Producteurs</a></li>
          <li><a href="#">Click & Collect</a></li>
          <li><a href="#">Notre mission</a></li>
        </ul>
        <div className="bio-nav-right">
          <span className="bio-nav-location">📍 Paris & IDF</span>
          <button className="bio-nav-cart" onClick={() => setCart(c => c + 1)}>
            🛒 Panier {cart > 0 && `(${cart})`}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="bio-hero">
        <div className="bio-hero-text">
          <div className="bio-hero-badge">🌱 100% Bio & Local</div>
          <h1>Le meilleur du<br /><span>bio local</span><br />livré chez vous</h1>
          <p>Chaque semaine, nos producteurs partenaires préparent votre box avec des produits frais, de saison et cultivés à moins de 150 km de Paris.</p>
          <div className="bio-hero-features">
            <span className="bio-hero-feature">🚜 Producteurs locaux</span>
            <span className="bio-hero-feature">🌿 Certifié AB</span>
            <span className="bio-hero-feature">📦 Livraison hebdo</span>
            <span className="bio-hero-feature">❌ Sans engagement</span>
          </div>
          <button className="bio-btn">Choisir ma box →</button>
          <button className="bio-btn-out">Click & Collect</button>
        </div>
        <div className="bio-hero-img" />
      </section>

      {/* STATS */}
      <div className="bio-stats">
        {[["500+","Abonnés actifs"],["35","Producteurs partenaires"],["0 km","Transport ≤ 150 km"],["100%","Certifié Agriculture Bio"]].map(([v,l]) => (
          <div key={l} className="bio-stat">
            <div className="bio-stat-val">{v}</div>
            <div className="bio-stat-label">{l}</div>
          </div>
        ))}
      </div>

      {/* BOXES */}
      <section className="bio-boxes">
        <div className="bio-boxes-header">
          <h2>Nos box de la semaine</h2>
          <div className="bio-tabs">
            {["Abonnement", "À l'unité", "Cadeaux"].map((t) => (
              <button key={t} className={`bio-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="bio-grid">
          {products.map((p) => (
            <div key={p.id} className="bio-card">
              <div className="bio-card-img">
                <img src={p.img} alt={p.name} />
                {p.tag && <div className="bio-card-tag">{p.tag}</div>}
              </div>
              <div className="bio-card-body">
                <div className="bio-card-name">{p.name}</div>
                <div className="bio-card-unit">{p.unit}</div>
                <div className="bio-card-footer">
                  <div className="bio-card-price">{p.price}</div>
                  <button className="bio-card-add" onClick={() => setCart(c => c + 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bio-how">
        <div className="bio-how-inner">
          <h2>Comment ça marche ?</h2>
          <div className="bio-steps">
            {[
              { num: "1", title: "Je choisis ma box", desc: "Légumes, fruits, fromages ou box complète selon mes envies." },
              { num: "2", title: "Nos producteurs préparent", desc: "Récolte fraîche du jeudi, emballage éco-responsable." },
              { num: "3", title: "Livraison ou Click & Collect", desc: "Livré chez vous le vendredi ou à retirer dans un de nos 12 points relais." },
              { num: "4", title: "Je régale ma famille", desc: "Produits frais garantis, conseils recettes inclus dans chaque box." },
            ].map((s) => (
              <div key={s.num} className="bio-step">
                <div className="bio-step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTEURS */}
      <section className="bio-producers">
        <h2>Nos producteurs</h2>
        <p className="bio-producers-sub">Nous travaillons uniquement avec des agriculteurs certifiés bio à moins de 150 km de Paris.</p>
        <div className="bio-producers-grid">
          {producers.map((p) => (
            <div key={p.name} className="bio-producer">
              <div className="bio-producer-img"><img src={p.img} alt={p.name} /></div>
              <div className="bio-producer-body">
                <div className="bio-producer-name">{p.name}</div>
                <div className="bio-producer-loc">📍 {p.location}</div>
                <div className="bio-producer-spec">{p.specialty}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bio-cta">
        <h2>Première box à <span>-20%</span></h2>
        <p>Utilisez le code BIOWELCOME · Résiliable à tout moment</p>
        <button className="bio-cta-btn">Je commence maintenant →</button>
      </section>

      {/* FOOTER */}
      <footer className="bio-footer">
        <div className="bio-footer-logo">Bio<span>Marché</span></div>
        <div className="bio-footer-links">
          <a href="#">Livraison</a>
          <a href="#">CGV</a>
          <a href="#">Contact</a>
        </div>
        <div className="bio-footer-copy">© 2024 BioMarché · Paris</div>
      </footer>
    </div>
  )
}
