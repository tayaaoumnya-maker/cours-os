export default function CreationContenuDemo() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#0f0f0f", minHeight: "100vh", color: "#fff" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .back-btn {
          position: fixed; top: 16px; left: 16px; z-index: 100;
          background: linear-gradient(135deg, #EC4899, #2563EB); color: #fff;
          border: none; cursor: pointer; padding: 0.5rem 1.1rem; border-radius: 8px;
          font-weight: 700; font-size: 0.82rem; text-decoration: none; display: inline-block;
        }
        .header { padding: 80px 5% 48px; text-align: center; }
        .header-badge { display: inline-block; background: rgba(236,72,153,0.15);
          border: 1px solid rgba(236,72,153,0.3); color: #EC4899;
          font-size: 0.75rem; font-weight: 700; padding: 0.3rem 1rem; border-radius: 99px;
          margin-bottom: 1.2rem; letter-spacing: 0.08em; text-transform: uppercase; }
        .header h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900;
          line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 1rem; }
        .grad { background: linear-gradient(135deg, #EC4899, #2563EB, #60A5FA);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .header p { color: rgba(255,255,255,0.6); max-width: 500px; margin: 0 auto;
          line-height: 1.7; }

        /* Masonry grid */
        .masonry { columns: 3; gap: 12px; padding: 0 5% 4rem; max-width: 1200px; margin: 0 auto; }
        .masonry-item { break-inside: avoid; margin-bottom: 12px; border-radius: 12px;
          overflow: hidden; position: relative; cursor: pointer; }
        .masonry-item img { width: 100%; display: block; transition: transform 0.4s; }
        .masonry-item:hover img { transform: scale(1.04); }
        .masonry-overlay { position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
          opacity: 0; transition: opacity 0.3s; display: flex; align-items: flex-end;
          padding: 16px; }
        .masonry-item:hover .masonry-overlay { opacity: 1; }
        .masonry-label { color: #fff; font-weight: 700; font-size: 0.85rem; }
        .masonry-type { font-size: 0.7rem; color: rgba(255,255,255,0.7); margin-top: 2px; }

        /* Format tags */
        .formats { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;
          padding: 0 5% 3rem; }
        .format-tag { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.8); font-size: 0.8rem; font-weight: 600;
          padding: 0.45rem 1rem; border-radius: 99px; }
        .format-tag.active { background: linear-gradient(135deg, #EC4899, #2563EB);
          border-color: transparent; color: #fff; }

        /* Stats banner */
        .stats-banner { display: flex; justify-content: center; gap: 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          margin: 0 5% 4rem; }
        .stat-item { flex: 1; text-align: center; padding: 2rem 1rem;
          border-right: 1px solid rgba(255,255,255,0.1); }
        .stat-item:last-child { border-right: none; }
        .stat-val { font-size: 2rem; font-weight: 900;
          background: linear-gradient(135deg, #EC4899, #60A5FA);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stat-label { font-size: 0.78rem; color: rgba(255,255,255,0.5); margin-top: 4px; }

        /* Reel mockup */
        .reels-section { padding: 0 5% 4rem; max-width: 1200px; margin: 0 auto; }
        .reels-title { font-size: 1.4rem; font-weight: 900; margin-bottom: 1.5rem;
          letter-spacing: -0.02em; }
        .reels-row { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; }
        .reel-card { flex-shrink: 0; width: 160px; border-radius: 12px; overflow: hidden;
          position: relative; cursor: pointer; }
        .reel-card img { width: 100%; height: 280px; object-fit: cover; display: block; }
        .reel-overlay { position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7)); }
        .reel-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.9); display: flex; align-items: center;
          justify-content: center; font-size: 1.1rem; }
        .reel-views { position: absolute; bottom: 10px; left: 10px; color: #fff;
          font-size: 0.75rem; font-weight: 700; }
        @media (max-width: 700px) { .masonry { columns: 2; } }
      `}</style>

      <a href="/trust-aura/services" className="back-btn">← Retour aux services</a>

      <div className="header">
        <div className="header-badge">✦ Portfolio création de contenu</div>
        <h1>Du contenu qui <span className="grad">convertit</span></h1>
        <p>Visuels, Reels, copy — chaque pièce est conçue pour arrêter le scroll et déclencher l'action.</p>
      </div>

      <div className="formats">
        {["Tous", "Reels", "Visuels", "Stories", "Carrousels", "Copywriting"].map((f, i) => (
          <div key={f} className={`format-tag ${i === 0 ? "active" : ""}`}>{f}</div>
        ))}
      </div>

      <div className="stats-banner">
        <div className="stat-item"><div className="stat-val">2.4M</div><div className="stat-label">Vues générées</div></div>
        <div className="stat-item"><div className="stat-val">8.7%</div><div className="stat-label">Taux d'engagement</div></div>
        <div className="stat-item"><div className="stat-val">320+</div><div className="stat-label">Contenus créés</div></div>
        <div className="stat-item"><div className="stat-val">50+</div><div className="stat-label">Marques servies</div></div>
      </div>

      <div className="masonry">
        {[
          { img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80", label: "Campagne Mode", type: "Visuel · Instagram" },
          { img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80", label: "Promo E-commerce", type: "Story · Facebook" },
          { img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80", label: "Coaching Fitness", type: "Reel · TikTok" },
          { img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80", label: "Soldes Été", type: "Carrousel · Instagram" },
          { img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80", label: "Dashboard Analytics", type: "Visuel · LinkedIn" },
          { img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80", label: "Réunion d'équipe", type: "Coulisses · Instagram" },
          { img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80", label: "Témoignage client", type: "Story · Instagram" },
          { img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80", label: "Produit vedette", type: "Visuel · Facebook" },
          { img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80", label: "Meta Ads créa", type: "Ad Creative · Meta" },
        ].map((item, i) => (
          <div key={i} className="masonry-item">
            <img src={item.img} alt={item.label} />
            <div className="masonry-overlay">
              <div>
                <div className="masonry-label">{item.label}</div>
                <div className="masonry-type">{item.type}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="reels-section">
        <div className="reels-title">🎬 Derniers Reels produits</div>
        <div className="reels-row">
          {[
            { img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80", views: "142K vues" },
            { img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80", views: "98K vues" },
            { img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=80", views: "215K vues" },
            { img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80", views: "67K vues" },
            { img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&q=80", views: "183K vues" },
          ].map((r, i) => (
            <div key={i} className="reel-card">
              <img src={r.img} alt="reel" />
              <div className="reel-overlay" />
              <div className="reel-play">▶</div>
              <div className="reel-views">▶ {r.views}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
