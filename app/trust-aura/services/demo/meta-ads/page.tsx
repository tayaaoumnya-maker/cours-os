export default function MetaAdsDemo() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#f0f2f5", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .back-btn {
          position: fixed; top: 16px; left: 16px; z-index: 100;
          background: #1877F2; color: #fff; border: none; cursor: pointer;
          padding: 0.5rem 1.1rem; border-radius: 8px; font-weight: 700;
          font-size: 0.82rem; text-decoration: none; display: inline-block;
          box-shadow: 0 2px 12px rgba(24,119,242,0.4);
        }
        .fb-topbar {
          background: #1877F2; height: 56px;
          display: flex; align-items: center; padding: 0 16px; gap: 12px;
          position: sticky; top: 0; z-index: 50;
        }
        .fb-logo { color: #fff; font-size: 1.6rem; font-weight: 900; }
        .fb-search {
          background: rgba(255,255,255,0.18); border: none; border-radius: 99px;
          padding: 0.4rem 1rem; color: #fff; font-size: 0.85rem; width: 220px;
        }
        .fb-search::placeholder { color: rgba(255,255,255,0.7); }
        .fb-nav { display: flex; gap: 4px; margin: 0 auto; }
        .fb-nav-btn {
          background: none; border: none; color: rgba(255,255,255,0.8);
          padding: 0.5rem 1.4rem; border-radius: 8px; cursor: pointer;
          font-size: 0.9rem; font-weight: 600;
        }
        .fb-nav-btn.active { background: rgba(255,255,255,0.18); color: #fff; }
        .feed { max-width: 500px; margin: 0 auto; padding: 20px 12px; }

        /* AD CARD */
        .ad-card {
          background: #fff; border-radius: 12px; overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.12); margin-bottom: 16px;
        }
        .ad-header { padding: 14px 16px; display: flex; align-items: center; gap: 10px; }
        .ad-avatar {
          width: 42px; height: 42px; border-radius: 50%; overflow: hidden;
          background: linear-gradient(135deg, #EC4899, #2563EB);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 800; font-size: 1rem; flex-shrink: 0;
        }
        .ad-page-name { font-weight: 700; font-size: 0.92rem; }
        .ad-sponsored {
          font-size: 0.72rem; color: #65676B;
          display: flex; align-items: center; gap: 4px;
        }
        .ad-sponsored span { background: #E4E6EB; border-radius: 3px; padding: 1px 5px; font-size: 0.65rem; }
        .ad-img { width: 100%; height: 280px; object-fit: cover; display: block; }
        .ad-cta-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 16px; background: #F0F2F5;
        }
        .ad-copy { padding: 10px 16px; }
        .ad-copy-headline { font-weight: 800; font-size: 0.95rem; }
        .ad-copy-desc { font-size: 0.82rem; color: #65676B; margin-top: 2px; }
        .ad-url { font-size: 0.75rem; color: #65676B; text-transform: uppercase; letter-spacing: 0.04em; }
        .ad-btn {
          background: #1877F2; color: #fff; border: none; cursor: pointer;
          padding: 0.5rem 1.2rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem;
        }
        .ad-reactions { padding: 10px 16px; display: flex; gap: 16px; }
        .ad-reaction { font-size: 0.82rem; color: #65676B; cursor: pointer; }
        .ad-reaction:hover { color: #1877F2; }

        /* METRICS PANEL */
        .metrics { background: #fff; border-radius: 12px; padding: 20px; margin-bottom: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.12); }
        .metrics h3 { font-size: 0.82rem; color: #65676B; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.06em; margin-bottom: 14px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .metric-card { background: #F0F2F5; border-radius: 8px; padding: 12px; text-align: center; }
        .metric-val { font-size: 1.4rem; font-weight: 900; color: #1877F2; }
        .metric-label { font-size: 0.72rem; color: #65676B; margin-top: 2px; }

        /* STORY */
        .stories { display: flex; gap: 10px; padding: 16px 0; overflow-x: auto; margin-bottom: 4px; }
        .story { flex-shrink: 0; width: 110px; height: 180px; border-radius: 12px; overflow: hidden;
          position: relative; cursor: pointer; }
        .story-img { width: 100%; height: 100%; object-fit: cover; }
        .story-overlay { position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6)); }
        .story-label { position: absolute; bottom: 8px; left: 0; right: 0; text-align: center;
          color: #fff; font-size: 0.72rem; font-weight: 700; }
        .story-ring { position: absolute; top: 6px; left: 6px; width: 36px; height: 36px;
          border-radius: 50%; border: 3px solid #1877F2; overflow: hidden; }
        .story-ring img { width: 100%; height: 100%; object-fit: cover; }
      `}</style>

      <a href="/trust-aura/services" className="back-btn">← Retour aux services</a>

      {/* FB Topbar */}
      <div className="fb-topbar">
        <div className="fb-logo">f</div>
        <input className="fb-search" placeholder="🔍  Rechercher sur Facebook" />
        <div className="fb-nav">
          <button className="fb-nav-btn active">🏠</button>
          <button className="fb-nav-btn">👥</button>
          <button className="fb-nav-btn">▶️</button>
          <button className="fb-nav-btn">🛍️</button>
        </div>
      </div>

      <div className="feed">

        {/* Métriques campagne */}
        <div className="metrics">
          <h3>📊 Performances campagne — Derniers 30 jours</h3>
          <div className="metrics-grid">
            <div className="metric-card"><div className="metric-val">4.8×</div><div className="metric-label">ROAS moyen</div></div>
            <div className="metric-card"><div className="metric-val">€0.32</div><div className="metric-label">CPC moyen</div></div>
            <div className="metric-card"><div className="metric-val">12.4%</div><div className="metric-label">Taux de clic</div></div>
            <div className="metric-card"><div className="metric-val">186K</div><div className="metric-label">Impressions</div></div>
            <div className="metric-card"><div className="metric-val">3 240</div><div className="metric-label">Clics</div></div>
            <div className="metric-card"><div className="metric-val">€2 100</div><div className="metric-label">CA généré</div></div>
          </div>
        </div>

        {/* Stories */}
        <div className="stories">
          {[
            { label: "Votre marque", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&q=80" },
            { label: "Promo -30%", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&q=80" },
            { label: "Nouveau produit", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&q=80" },
            { label: "Témoignage", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80" },
          ].map((s) => (
            <div key={s.label} className="story">
              <img src={s.img} alt={s.label} className="story-img" />
              <div className="story-overlay" />
              <div className="story-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Ad 1 */}
        <div className="ad-card">
          <div className="ad-header">
            <div className="ad-avatar">TA</div>
            <div>
              <div className="ad-page-name">Votre Boutique</div>
              <div className="ad-sponsored">Sponsorisé · <span>Publicité</span></div>
            </div>
          </div>
          <div className="ad-copy">
            <div style={{ fontSize: "0.92rem", marginBottom: 8 }}>
              ✨ <strong>-30% sur toute la collection</strong> — Offre valable jusqu'à dimanche minuit.
              Ne manquez pas cette occasion unique !
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80" alt="Ad" className="ad-img" />
          <div className="ad-cta-bar">
            <div>
              <div className="ad-copy-headline">Collection Été 2025</div>
              <div className="ad-url">votreboutique.fr</div>
            </div>
            <button className="ad-btn">Acheter maintenant</button>
          </div>
          <div className="ad-reactions">
            <span className="ad-reaction">👍 J'aime</span>
            <span className="ad-reaction">💬 Commenter</span>
            <span className="ad-reaction">↗ Partager</span>
          </div>
        </div>

        {/* Ad 2 — Lead gen */}
        <div className="ad-card">
          <div className="ad-header">
            <div className="ad-avatar" style={{ background: "linear-gradient(135deg, #2563EB, #60A5FA)" }}>🏋</div>
            <div>
              <div className="ad-page-name">FitCoach Pro</div>
              <div className="ad-sponsored">Sponsorisé · <span>Publicité</span></div>
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" alt="Ad" className="ad-img" />
          <div className="ad-cta-bar">
            <div>
              <div className="ad-copy-headline">Programme 8 semaines — Résultats garantis</div>
              <div className="ad-copy-desc">+620 personnes transformées cette année</div>
              <div className="ad-url">fitcoachpro.fr</div>
            </div>
            <button className="ad-btn">S'inscrire</button>
          </div>
          <div className="ad-reactions">
            <span className="ad-reaction">👍 J'aime</span>
            <span className="ad-reaction">💬 Commenter</span>
            <span className="ad-reaction">↗ Partager</span>
          </div>
        </div>

      </div>
    </div>
  )
}
