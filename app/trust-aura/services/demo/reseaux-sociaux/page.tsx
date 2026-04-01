export default function ReseauxSociauxDemo() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#fafafa", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .back-btn {
          position: fixed; top: 16px; left: 16px; z-index: 100;
          background: linear-gradient(135deg, #EC4899, #2563EB); color: #fff;
          border: none; cursor: pointer; padding: 0.5rem 1.1rem; border-radius: 8px;
          font-weight: 700; font-size: 0.82rem; text-decoration: none; display: inline-block;
          box-shadow: 0 2px 12px rgba(236,72,153,0.4);
        }
        .ig-topbar {
          background: #fff; border-bottom: 1px solid #dbdbdb;
          height: 54px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px; position: sticky; top: 0; z-index: 50;
        }
        .ig-logo { font-size: 1.4rem; font-weight: 900; font-style: italic; }
        .ig-icons { display: flex; gap: 16px; font-size: 1.2rem; }
        .profile { max-width: 600px; margin: 0 auto; }
        .profile-header { padding: 24px 20px; display: flex; gap: 32px; align-items: center; }
        .profile-avatar {
          width: 86px; height: 86px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #EC4899, #2563EB, #60A5FA);
          padding: 3px;
        }
        .profile-avatar-inner {
          width: 100%; height: 100%; border-radius: 50%; overflow: hidden;
          border: 3px solid #fff;
        }
        .profile-avatar-inner img { width: 100%; height: 100%; object-fit: cover; }
        .profile-info { flex: 1; }
        .profile-name { font-size: 1.1rem; font-weight: 800; margin-bottom: 4px; }
        .profile-category { font-size: 0.8rem; color: #8e8e8e; margin-bottom: 8px; }
        .profile-bio { font-size: 0.85rem; line-height: 1.5; }
        .profile-stats { display: flex; gap: 0; border-top: 1px solid #dbdbdb; border-bottom: 1px solid #dbdbdb; }
        .stat { flex: 1; text-align: center; padding: 14px 0; }
        .stat-val { font-size: 1rem; font-weight: 800; }
        .stat-label { font-size: 0.72rem; color: #8e8e8e; }
        .profile-btns { padding: 12px 20px; display: flex; gap: 8px; }
        .ig-btn-primary {
          flex: 1; background: #0095F6; color: #fff; border: none;
          border-radius: 8px; padding: 0.55rem; font-weight: 700; font-size: 0.85rem; cursor: pointer;
        }
        .ig-btn-outline {
          flex: 1; background: none; border: 1px solid #dbdbdb;
          border-radius: 8px; padding: 0.55rem; font-weight: 700; font-size: 0.85rem; cursor: pointer;
        }
        .tabs { display: flex; border-top: 1px solid #dbdbdb; }
        .tab { flex: 1; text-align: center; padding: 12px; font-size: 0.85rem;
          cursor: pointer; border-top: 2px solid transparent; color: #8e8e8e; font-weight: 600; }
        .tab.active { border-top-color: #0f172a; color: #0f172a; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .grid-item { aspect-ratio: 1; overflow: hidden; position: relative; cursor: pointer; }
        .grid-item img { width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.3s; }
        .grid-item:hover img { transform: scale(1.05); }
        .grid-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center; gap: 16px;
          opacity: 0; transition: opacity 0.2s; }
        .grid-item:hover .grid-overlay { opacity: 1; }
        .grid-stat { color: #fff; font-weight: 700; font-size: 0.88rem; }

        /* Story highlights */
        .highlights { display: flex; gap: 14px; padding: 12px 20px; overflow-x: auto; }
        .highlight { flex-shrink: 0; text-align: center; }
        .highlight-ring {
          width: 60px; height: 60px; border-radius: 50%;
          background: linear-gradient(135deg, #EC4899, #F97316, #FACC15);
          padding: 2px; margin: 0 auto 4px;
        }
        .highlight-inner {
          width: 100%; height: 100%; border-radius: 50%; overflow: hidden;
          border: 2px solid #fff;
        }
        .highlight-inner img { width: 100%; height: 100%; object-fit: cover; }
        .highlight-label { font-size: 0.68rem; color: #0f172a; }

        /* Engagement bar */
        .engagement { background: #fff; border-radius: 12px; margin: 12px 20px;
          padding: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
        .engagement h3 { font-size: 0.78rem; color: #8e8e8e; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; }
        .eng-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .eng-bar-wrap { flex: 1; background: #f0f0f0; border-radius: 99px; height: 8px; }
        .eng-bar { height: 8px; border-radius: 99px;
          background: linear-gradient(135deg, #EC4899, #2563EB); }
        .eng-label { font-size: 0.75rem; color: #8e8e8e; width: 80px; }
        .eng-val { font-size: 0.75rem; font-weight: 700; width: 40px; text-align: right; }
      `}</style>

      <a href="/trust-aura/services" className="back-btn">← Retour aux services</a>

      <div className="ig-topbar">
        <div style={{ width: 24 }} />
        <div className="ig-logo">Instagram</div>
        <div className="ig-icons"><span>♡</span><span>✉</span></div>
      </div>

      <div className="profile">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="profile-avatar-inner">
              <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&q=80" alt="brand" />
            </div>
          </div>
          <div className="profile-info">
            <div className="profile-name">votrebrand.fr</div>
            <div className="profile-category">Business · Mode & Lifestyle</div>
            <div className="profile-bio">✨ Votre marque, réinventée.<br />🚀 Contenu premium par <strong>Trust Aura</strong><br />🛒 Boutique en ligne</div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat"><div className="stat-val">284</div><div className="stat-label">publications</div></div>
          <div className="stat"><div className="stat-val">18,4K</div><div className="stat-label">abonnés</div></div>
          <div className="stat"><div className="stat-val">1 204</div><div className="stat-label">abonnements</div></div>
        </div>

        <div className="profile-btns">
          <button className="ig-btn-primary">S'abonner</button>
          <button className="ig-btn-outline">Message</button>
        </div>

        {/* Highlights */}
        <div className="highlights">
          {[
            { label: "Nouveautés", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&q=80" },
            { label: "Promos", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&q=80" },
            { label: "Avis clients", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&q=80" },
            { label: "Coulisses", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=120&q=80" },
            { label: "FAQ", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&q=80" },
          ].map((h) => (
            <div key={h.label} className="highlight">
              <div className="highlight-ring">
                <div className="highlight-inner">
                  <img src={h.img} alt={h.label} />
                </div>
              </div>
              <div className="highlight-label">{h.label}</div>
            </div>
          ))}
        </div>

        {/* Engagement stats */}
        <div className="engagement">
          <h3>📈 Engagement — 30 derniers jours</h3>
          <div className="eng-row">
            <div className="eng-label">Portée</div>
            <div className="eng-bar-wrap"><div className="eng-bar" style={{ width: "82%" }} /></div>
            <div className="eng-val">82%</div>
          </div>
          <div className="eng-row">
            <div className="eng-label">Likes</div>
            <div className="eng-bar-wrap"><div className="eng-bar" style={{ width: "68%" }} /></div>
            <div className="eng-val">4 820</div>
          </div>
          <div className="eng-row">
            <div className="eng-label">Commentaires</div>
            <div className="eng-bar-wrap"><div className="eng-bar" style={{ width: "45%" }} /></div>
            <div className="eng-val">312</div>
          </div>
          <div className="eng-row">
            <div className="eng-label">Partages</div>
            <div className="eng-bar-wrap"><div className="eng-bar" style={{ width: "35%" }} /></div>
            <div className="eng-val">198</div>
          </div>
        </div>

        <div className="tabs">
          <div className="tab active">⊞ Publications</div>
          <div className="tab">▶ Reels</div>
          <div className="tab">🏷️ Identifiés</div>
        </div>

        <div className="grid">
          {[
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
            "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80",
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80",
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80",
            "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80",
            "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
          ].map((img, i) => (
            <div key={i} className="grid-item">
              <img src={img} alt={`post ${i}`} />
              <div className="grid-overlay">
                <span className="grid-stat">♡ {Math.floor(Math.random() * 900 + 100)}</span>
                <span className="grid-stat">💬 {Math.floor(Math.random() * 60 + 10)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
