export default function RestaurantDemo() {
  return (
    <div className="res-root">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .res-root { font-family: 'Georgia', serif; background: #0d0b08; color: #f5f0e8; }
        /* NAV */
        .res-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.5rem 5%; position: absolute; top: 0; left: 0; right: 0; z-index: 10;
        }
        .res-logo { font-size: 1.5rem; letter-spacing: 0.1em; color: #c9a84c; font-weight: 400; }
        .res-nav-links { display: flex; gap: 2.5rem; list-style: none; }
        .res-nav-links a { color: rgba(245,240,232,0.75); font-size: 0.82rem; text-decoration: none; letter-spacing: 0.08em; font-family: 'Inter', sans-serif; }
        .res-nav-links a:hover { color: #c9a84c; }
        .res-nav-btn { border: 1px solid #c9a84c; color: #c9a84c; background: none; padding: 0.6rem 1.4rem; font-family: 'Inter', sans-serif; font-size: 0.8rem; letter-spacing: 0.08em; cursor: pointer; }
        /* HERO */
        .res-hero {
          height: 100vh; position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; text-align: center;
          background: url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80') center/cover;
        }
        .res-hero-overlay { position: absolute; inset: 0; background: rgba(8,6,4,0.7); }
        .res-hero-content { position: relative; z-index: 1; }
        .res-hero-label { font-family: 'Inter', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; color: #c9a84c; text-transform: uppercase; margin-bottom: 1.5rem; }
        .res-hero h1 { font-size: clamp(3rem, 8vw, 7rem); font-weight: 400; line-height: 1.05; margin-bottom: 1.5rem; font-style: italic; }
        .res-hero p { font-family: 'Inter', sans-serif; color: rgba(245,240,232,0.6); font-size: 1rem; margin-bottom: 2.5rem; letter-spacing: 0.02em; }
        .res-hero-btns { display: flex; gap: 1.2rem; justify-content: center; }
        .res-btn-gold { background: #c9a84c; color: #0d0b08; border: none; padding: 0.9rem 2.2rem; font-family: 'Inter', sans-serif; font-size: 0.82rem; letter-spacing: 0.08em; cursor: pointer; font-weight: 600; }
        .res-btn-out { border: 1px solid rgba(245,240,232,0.3); color: #f5f0e8; background: none; padding: 0.9rem 2.2rem; font-family: 'Inter', sans-serif; font-size: 0.82rem; letter-spacing: 0.08em; cursor: pointer; }
        /* INTRO */
        .res-intro { display: grid; grid-template-columns: 1fr 1fr; align-items: center; min-height: 60vh; }
        .res-intro-img { height: 60vh; background: url('https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80') center/cover; }
        .res-intro-text { padding: 4rem 5%; }
        .res-intro-label { font-family: 'Inter', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; color: #c9a84c; text-transform: uppercase; margin-bottom: 1rem; }
        .res-intro-text h2 { font-size: clamp(1.8rem, 3vw, 2.8rem); font-weight: 400; line-height: 1.2; margin-bottom: 1.5rem; font-style: italic; }
        .res-intro-text p { font-family: 'Inter', sans-serif; color: rgba(245,240,232,0.55); font-size: 0.9rem; line-height: 1.8; margin-bottom: 1rem; }
        .res-divider-gold { width: 40px; height: 1px; background: #c9a84c; margin: 2rem 0; }
        /* MENU */
        .res-menu { padding: 6rem 5%; text-align: center; }
        .res-menu h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 400; font-style: italic; margin-bottom: 3rem; }
        .res-menu-tabs { display: flex; justify-content: center; gap: 2rem; margin-bottom: 3rem; list-style: none; }
        .res-menu-tab { font-family: 'Inter', sans-serif; font-size: 0.78rem; letter-spacing: 0.1em; color: rgba(245,240,232,0.4); cursor: pointer; padding-bottom: 0.4rem; text-transform: uppercase; }
        .res-menu-tab.active { color: #c9a84c; border-bottom: 1px solid #c9a84c; }
        .res-menu-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 0; max-width: 900px; margin: 0 auto; }
        .res-menu-item { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(245,240,232,0.07); display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; text-align: left; }
        .res-menu-item-info h4 { font-size: 1rem; font-weight: 400; margin-bottom: 0.3rem; }
        .res-menu-item-info p { font-family: 'Inter', sans-serif; font-size: 0.78rem; color: rgba(245,240,232,0.4); line-height: 1.5; }
        .res-menu-price { color: #c9a84c; font-size: 1rem; white-space: nowrap; }
        /* GALLERY */
        .res-gallery { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 300px 300px; gap: 4px; }
        .res-gallery-item { background-size: cover; background-position: center; }
        .res-gallery-item:first-child { grid-row: 1 / 3; }
        /* RESERVATION */
        .res-resa { padding: 6rem 5%; text-align: center; background: #100e0b; }
        .res-resa h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 400; font-style: italic; margin-bottom: 0.8rem; }
        .res-resa p { font-family: 'Inter', sans-serif; color: rgba(245,240,232,0.45); margin-bottom: 2.5rem; }
        .res-resa-form { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; max-width: 700px; margin: 0 auto; }
        .res-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(245,240,232,0.15); color: #f5f0e8; padding: 0.85rem 1.2rem; font-family: 'Inter', sans-serif; font-size: 0.88rem; flex: 1; min-width: 160px; }
        .res-input::placeholder { color: rgba(245,240,232,0.25); }
        .res-input:focus { outline: none; border-color: #c9a84c; }
        .res-resa-btn { background: #c9a84c; color: #0d0b08; border: none; padding: 0.85rem 2rem; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 0.82rem; letter-spacing: 0.06em; cursor: pointer; white-space: nowrap; }
        /* FOOTER */
        .res-footer { border-top: 1px solid rgba(245,240,232,0.08); padding: 3rem 5%; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; }
        .res-footer-logo { font-size: 1.2rem; letter-spacing: 0.1em; color: #c9a84c; }
        .res-footer-info { font-family: 'Inter', sans-serif; font-size: 0.78rem; color: rgba(245,240,232,0.3); text-align: center; line-height: 1.8; }
        @media (max-width: 768px) {
          .res-nav-links { display: none; }
          .res-intro, .res-gallery { grid-template-columns: 1fr; }
          .res-intro-img { height: 280px; }
          .res-gallery { grid-template-rows: auto; }
          .res-gallery-item { height: 200px; }
          .res-gallery-item:first-child { grid-row: auto; }
          .res-menu-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <nav className="res-nav">
        <div className="res-logo">Chez Marco</div>
        <ul className="res-nav-links">
          <li><a href="#">La Carte</a></li>
          <li><a href="#">Le Chef</a></li>
          <li><a href="#">Galerie</a></li>
          <li><a href="#">Événements</a></li>
        </ul>
        <button className="res-nav-btn">Réserver une table</button>
      </nav>

      <section className="res-hero">
        <div className="res-hero-overlay" />
        <div className="res-hero-content">
          <div className="res-hero-label">✦ Restaurant Gastronomique · Paris 8e</div>
          <h1>L'art de la<br />table revisité</h1>
          <p>Une cuisine française d'exception, des produits de saison, une expérience inoubliable.</p>
          <div className="res-hero-btns">
            <button className="res-btn-gold">Réserver une table</button>
            <button className="res-btn-out">Découvrir la carte</button>
          </div>
        </div>
      </section>

      <section className="res-intro">
        <div className="res-intro-img" />
        <div className="res-intro-text">
          <div className="res-intro-label">✦ Notre philosophie</div>
          <h2>La cuisine comme<br />art de vivre</h2>
          <p>Marco Bellini, Chef étoilé depuis 2018, sublime les produits de saison avec une créativité sans limite. Chaque assiette raconte une histoire.</p>
          <p>Un cadre élégant, une cave exceptionnelle et un service attentionné pour des moments d'exception.</p>
          <div className="res-divider-gold" />
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "rgba(245,240,232,0.4)", display: "flex", gap: "2rem" }}>
            <span>⭐ 1 étoile Michelin</span>
            <span>🍷 Cave de 400 références</span>
          </div>
        </div>
      </section>

      <section className="res-menu">
        <div className="res-intro-label">✦ Notre carte</div>
        <h2>Le menu du moment</h2>
        <ul className="res-menu-tabs">
          {["Entrées", "Plats", "Desserts", "Vins"].map((t, i) => (
            <li key={t} className={`res-menu-tab${i === 0 ? " active" : ""}`}>{t}</li>
          ))}
        </ul>
        <div className="res-menu-grid">
          {[
            { name: "Foie gras poêlé", desc: "Chutney de figues, brioche toastée", price: "28€" },
            { name: "Tartare de Saint-Jacques", desc: "Avocat, citron caviar, huile d'olive", price: "32€" },
            { name: "Velouté de châtaignes", desc: "Truffe noire, crème fraîche", price: "22€" },
            { name: "Œuf parfait 63°", desc: "Cèpes, lard fumé, mousse de parmesan", price: "26€" },
          ].map((item) => (
            <div key={item.name} className="res-menu-item">
              <div className="res-menu-item-info">
                <h4>{item.name}</h4>
                <p>{item.desc}</p>
              </div>
              <div className="res-menu-price">{item.price}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="res-gallery">
        {[
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
          "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80",
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
          "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&q=80",
          "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400&q=80",
        ].map((url, i) => (
          <div key={i} className="res-gallery-item" style={{ backgroundImage: `url('${url}')` }} />
        ))}
      </div>

      <section className="res-resa">
        <div className="res-intro-label">✦ Réservation</div>
        <h2>Réservez votre table</h2>
        <p>Ouvert du mardi au samedi · Service midi 12h–14h · Service soir 19h–22h</p>
        <div className="res-resa-form">
          <input className="res-input" placeholder="Date" type="date" />
          <input className="res-input" placeholder="Heure" type="time" />
          <input className="res-input" placeholder="Personnes" type="number" min="1" max="20" />
          <button className="res-resa-btn">Réserver →</button>
        </div>
      </section>

      <footer className="res-footer">
        <div className="res-footer-logo">Chez Marco</div>
        <div className="res-footer-info">
          12 Rue du Faubourg Saint-Honoré, 75008 Paris<br />
          +33 1 42 00 00 00 · contact@chezmarco.fr
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "rgba(245,240,232,0.2)" }}>© 2024 Chez Marco</div>
      </footer>
    </div>
  )
}
