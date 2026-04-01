"use client"
import { useState } from "react"

const products = [
  { id: 1, name: "Hoodie Urban Classic", price: "89€", img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80", tag: "Bestseller" },
  { id: 2, name: "Cargo Pants Black", price: "119€", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80", tag: "New" },
  { id: 3, name: "Oversized Tee Drop", price: "59€", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80", tag: "Limité" },
  { id: 4, name: "Bomber Jacket", price: "189€", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80", tag: "New" },
  { id: 5, name: "Jogger Essential", price: "79€", img: "https://images.unsplash.com/photo-1617952739820-97bf7669f3a7?w=400&q=80", tag: "" },
  { id: 6, name: "Cap Logo", price: "45€", img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80", tag: "Bestseller" },
]

export default function EcommerceDemo() {
  const [cart, setCart] = useState(0)
  return (
    <div className="ec-root">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ec-root { font-family: 'Inter', system-ui, sans-serif; background: #0a0a0a; color: #fff; }
        /* NAV */
        .ec-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 5%; background: #0a0a0a; border-bottom: 1px solid rgba(255,255,255,0.08);
          position: sticky; top: 0; z-index: 10;
        }
        .ec-logo { font-size: 1.3rem; font-weight: 900; letter-spacing: -0.02em; }
        .ec-nav-links { display: flex; gap: 2rem; list-style: none; }
        .ec-nav-links a { color: rgba(255,255,255,0.6); font-size: 0.85rem; text-decoration: none; transition: color 0.2s; }
        .ec-nav-links a:hover { color: #fff; }
        .ec-nav-right { display: flex; align-items: center; gap: 1rem; }
        .ec-cart-btn { background: #fff; color: #000; border: none; padding: 0.5rem 1rem; font-weight: 700; font-size: 0.82rem; cursor: pointer; border-radius: 4px; }
        /* HERO */
        .ec-hero {
          height: 88vh; position: relative; overflow: hidden;
          display: flex; align-items: flex-end;
          background: url('https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1400&q=80') center/cover;
        }
        .ec-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%); }
        .ec-hero-content { position: relative; z-index: 1; padding: 4rem 5%; max-width: 700px; }
        .ec-hero-badge { display: inline-block; background: #fff; color: #000; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.1em; padding: 0.3rem 0.8rem; margin-bottom: 1.2rem; }
        .ec-hero h1 { font-size: clamp(2.8rem, 7vw, 6rem); font-weight: 900; line-height: 0.95; letter-spacing: -0.04em; margin-bottom: 1.5rem; }
        .ec-hero p { color: rgba(255,255,255,0.65); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem; max-width: 400px; }
        .ec-hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .ec-btn { background: #fff; color: #000; border: none; padding: 0.9rem 2rem; font-weight: 800; font-size: 0.88rem; cursor: pointer; letter-spacing: 0.02em; }
        .ec-btn-out { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.4); padding: 0.9rem 2rem; font-weight: 700; font-size: 0.88rem; cursor: pointer; }
        /* MARQUEE */
        .ec-marquee { background: #fff; color: #000; padding: 0.7rem 0; overflow: hidden; white-space: nowrap; }
        .ec-marquee-inner { display: inline-block; animation: marquee 18s linear infinite; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        /* PRODUCTS */
        .ec-products { padding: 5rem 5%; max-width: 1400px; margin: 0 auto; }
        .ec-products-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2.5rem; }
        .ec-products h2 { font-size: 1.8rem; font-weight: 900; letter-spacing: -0.02em; }
        .ec-filter-tabs { display: flex; gap: 0.5rem; }
        .ec-tab { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.5); padding: 0.4rem 1rem; font-size: 0.78rem; font-weight: 600; cursor: pointer; border-radius: 99px; font-family: inherit; transition: all 0.2s; }
        .ec-tab.active { background: #fff; color: #000; border-color: #fff; }
        .ec-tab:hover { border-color: rgba(255,255,255,0.4); color: #fff; }
        .ec-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; }
        .ec-card { background: #141414; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; overflow: hidden; cursor: pointer; transition: transform 0.25s, border-color 0.25s; }
        .ec-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.2); }
        .ec-card-img { position: relative; aspect-ratio: 3/4; overflow: hidden; }
        .ec-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .ec-card:hover .ec-card-img img { transform: scale(1.05); }
        .ec-card-tag { position: absolute; top: 10px; left: 10px; background: #fff; color: #000; font-size: 0.65rem; font-weight: 800; padding: 0.2rem 0.55rem; letter-spacing: 0.06em; }
        .ec-card-add { position: absolute; bottom: 12px; right: 12px; background: #fff; color: #000; border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 1.1rem; cursor: pointer; opacity: 0; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; }
        .ec-card:hover .ec-card-add { opacity: 1; }
        .ec-card-body { padding: 1rem; }
        .ec-card-name { font-size: 0.9rem; font-weight: 700; margin-bottom: 0.3rem; }
        .ec-card-price { font-size: 0.88rem; color: rgba(255,255,255,0.5); }
        /* BANNER */
        .ec-banner { display: grid; grid-template-columns: 1fr 1fr; }
        .ec-banner-img { height: 480px; background: url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80') center/cover; }
        .ec-banner-content { background: #141414; display: flex; flex-direction: column; justify-content: center; padding: 4rem; }
        .ec-banner-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 1rem; }
        .ec-banner h2 { font-size: clamp(1.6rem, 3vw, 2.5rem); font-weight: 900; letter-spacing: -0.02em; margin-bottom: 1rem; line-height: 1.15; }
        .ec-banner p { color: rgba(255,255,255,0.5); font-size: 0.9rem; line-height: 1.7; margin-bottom: 2rem; }
        /* FOOTER */
        .ec-footer { border-top: 1px solid rgba(255,255,255,0.08); padding: 3rem 5%; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .ec-footer-logo { font-size: 1.1rem; font-weight: 900; }
        .ec-footer-links { display: flex; gap: 1.5rem; }
        .ec-footer-links a { color: rgba(255,255,255,0.35); font-size: 0.78rem; text-decoration: none; }
        .ec-footer-copy { color: rgba(255,255,255,0.2); font-size: 0.75rem; }
        @media (max-width: 768px) {
          .ec-nav-links { display: none; }
          .ec-grid { grid-template-columns: repeat(2,1fr); }
          .ec-banner { grid-template-columns: 1fr; }
          .ec-banner-img { height: 260px; }
        }
      `}</style>

      <nav className="ec-nav">
        <div className="ec-logo">URBAN<span style={{ color: "rgba(255,255,255,0.4)" }}>STORE</span></div>
        <ul className="ec-nav-links">
          <li><a href="#">Nouveautés</a></li>
          <li><a href="#">Hommes</a></li>
          <li><a href="#">Femmes</a></li>
          <li><a href="#">Accessoires</a></li>
          <li><a href="#">Soldes</a></li>
        </ul>
        <div className="ec-nav-right">
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>🔍</span>
          <button className="ec-cart-btn" onClick={() => setCart(c => c + 1)}>
            Panier {cart > 0 && `(${cart})`}
          </button>
        </div>
      </nav>

      <section className="ec-hero">
        <div className="ec-hero-overlay" />
        <div className="ec-hero-content">
          <div className="ec-hero-badge">NOUVELLE COLLECTION 2024</div>
          <h1>DROP<br />WINTER</h1>
          <p>Des pièces streetwear exclusives pensées pour ceux qui refusent de choisir entre style et confort.</p>
          <div className="ec-hero-btns">
            <button className="ec-btn">Shopper la collection</button>
            <button className="ec-btn-out">Lookbook →</button>
          </div>
        </div>
      </section>

      <div className="ec-marquee">
        <span className="ec-marquee-inner">
          LIVRAISON OFFERTE DÈS 80€ &nbsp;·&nbsp; RETOURS GRATUITS 30 JOURS &nbsp;·&nbsp; PAIEMENT SÉCURISÉ &nbsp;·&nbsp; NOUVEAUX DROPS CHAQUE SEMAINE &nbsp;·&nbsp; LIVRAISON OFFERTE DÈS 80€ &nbsp;·&nbsp; RETOURS GRATUITS 30 JOURS &nbsp;·&nbsp; PAIEMENT SÉCURISÉ &nbsp;·&nbsp; NOUVEAUX DROPS CHAQUE SEMAINE &nbsp;·&nbsp;
        </span>
      </div>

      <section className="ec-products">
        <div className="ec-products-header">
          <h2>Bestsellers</h2>
          <div className="ec-filter-tabs">
            {["Tout", "Tops", "Bas", "Vestes", "Accès"].map((t, i) => (
              <button key={t} className={`ec-tab${i === 0 ? " active" : ""}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="ec-grid">
          {products.map((p) => (
            <div key={p.id} className="ec-card">
              <div className="ec-card-img">
                <img src={p.img} alt={p.name} />
                {p.tag && <div className="ec-card-tag">{p.tag}</div>}
                <button className="ec-card-add" onClick={() => setCart(c => c + 1)}>+</button>
              </div>
              <div className="ec-card-body">
                <div className="ec-card-name">{p.name}</div>
                <div className="ec-card-price">{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ec-banner">
        <div className="ec-banner-img" />
        <div className="ec-banner-content">
          <div className="ec-banner-label">Programme fidélité</div>
          <h2>Rejoins la<br />Urban Family</h2>
          <p>Accès aux drops exclusifs en avant-première, réductions membres et livraison prioritaire. Plus de 50 000 membres actifs.</p>
          <button className="ec-btn">Rejoindre maintenant</button>
        </div>
      </section>

      <footer className="ec-footer">
        <div className="ec-footer-logo">URBANSTORE</div>
        <div className="ec-footer-links">
          <a href="#">Livraison</a>
          <a href="#">Retours</a>
          <a href="#">Contact</a>
          <a href="#">CGV</a>
        </div>
        <div className="ec-footer-copy">© 2024 UrbanStore</div>
      </footer>
    </div>
  )
}
