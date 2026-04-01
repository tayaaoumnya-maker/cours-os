export default function GoogleAdsDemo() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#fff", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .back-btn {
          position: fixed; top: 16px; left: 16px; z-index: 100;
          background: #4285F4; color: #fff; border: none; cursor: pointer;
          padding: 0.5rem 1.1rem; border-radius: 8px; font-weight: 700;
          font-size: 0.82rem; text-decoration: none; display: inline-block;
        }
        .g-topbar {
          background: #fff; border-bottom: 1px solid #e0e0e0; padding: 12px 20px;
          display: flex; align-items: center; gap: 20px;
          position: sticky; top: 0; z-index: 50;
        }
        .g-logo { font-size: 1.6rem; font-weight: 900; letter-spacing: -1px; }
        .g-logo .g1{color:#4285F4} .g-logo .g2{color:#EA4335}
        .g-logo .g3{color:#FBBC05} .g-logo .g4{color:#4285F4}
        .g-logo .g5{color:#34A853} .g-logo .g6{color:#EA4335}
        .g-searchbar {
          flex: 1; max-width: 600px; border: 1px solid #ddd; border-radius: 24px;
          padding: 0.6rem 1.2rem; font-size: 0.92rem; outline: none;
          box-shadow: 0 1px 6px rgba(0,0,0,0.1); display: flex; align-items: center;
          gap: 8px; color: #202124;
        }
        .g-tabs { display: flex; gap: 0; border-bottom: 1px solid #e0e0e0; padding: 0 20px;
          margin-left: 80px; }
        .g-tab { padding: 10px 16px; font-size: 0.85rem; color: #70757a; cursor: pointer;
          border-bottom: 3px solid transparent; }
        .g-tab.active { color: #1a73e8; border-bottom-color: #1a73e8; font-weight: 600; }
        .g-body { display: grid; grid-template-columns: 1fr 320px; gap: 0;
          max-width: 1000px; margin: 0 auto; padding: 20px; }
        .results { }
        .result-count { font-size: 0.82rem; color: #70757a; margin-bottom: 16px; }

        /* Ad result */
        .ad-result { margin-bottom: 20px; }
        .ad-tag { display: inline-block; border: 1px solid #006621; color: #006621;
          font-size: 0.68rem; padding: 1px 4px; border-radius: 3px; margin-right: 6px; }
        .ad-url { font-size: 0.82rem; color: #202124; margin-bottom: 4px; }
        .ad-title { font-size: 1.1rem; color: #1a0dab; cursor: pointer; margin-bottom: 3px; }
        .ad-title:hover { text-decoration: underline; }
        .ad-desc { font-size: 0.88rem; color: #4d5156; line-height: 1.5; }
        .ad-extensions { margin-top: 6px; display: flex; gap: 0; flex-wrap: wrap; }
        .ad-ext { font-size: 0.82rem; color: #1a0dab; cursor: pointer;
          padding: 4px 10px; border: 1px solid #ddd; border-radius: 4px; margin: 2px;
          transition: background 0.15s; }
        .ad-ext:hover { background: #f8f8f8; }
        .divider { height: 1px; background: #e0e0e0; margin: 16px 0; }

        /* Organic result */
        .org-result { margin-bottom: 20px; }
        .org-url { font-size: 0.82rem; color: #202124; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
        .org-favicon { width: 16px; height: 16px; border-radius: 2px; background: #4285F4;
          display: inline-flex; align-items: center; justify-content: center; color: #fff; font-size: 0.55rem; font-weight: 700; }
        .org-title { font-size: 1.1rem; color: #1a0dab; cursor: pointer; margin-bottom: 3px; }
        .org-title:hover { text-decoration: underline; }
        .org-desc { font-size: 0.88rem; color: #4d5156; line-height: 1.5; }

        /* Right panel - Ads performance */
        .right-panel { padding-left: 24px; border-left: 1px solid #e0e0e0; }
        .panel-card { background: #f8f9fa; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
        .panel-title { font-size: 0.78rem; font-weight: 700; color: #202124; margin-bottom: 12px;
          text-transform: uppercase; letter-spacing: 0.06em; }
        .kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .kpi { background: #fff; border-radius: 8px; padding: 10px; text-align: center;
          border: 1px solid #e0e0e0; }
        .kpi-val { font-size: 1.2rem; font-weight: 900; color: #4285F4; }
        .kpi-label { font-size: 0.68rem; color: #70757a; margin-top: 2px; }
        .keyword-list { }
        .kw-item { display: flex; align-items: center; justify-content: space-between;
          padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 0.82rem; }
        .kw-item:last-child { border-bottom: none; }
        .kw-badge { background: #e8f0fe; color: #1a73e8; font-size: 0.68rem;
          padding: 2px 6px; border-radius: 4px; font-weight: 700; }
        .kw-pos { color: #34A853; font-weight: 700; font-size: 0.8rem; }
      `}</style>

      <a href="/trust-aura/services" className="back-btn">← Retour aux services</a>

      <div className="g-topbar">
        <div className="g-logo">
          <span className="g1">G</span><span className="g2">o</span><span className="g3">o</span>
          <span className="g4">g</span><span className="g5">l</span><span className="g6">e</span>
        </div>
        <div className="g-searchbar">
          🔍 &nbsp; agence marketing paris résultats garantis
        </div>
      </div>

      <div className="g-tabs">
        <div className="g-tab active">Tous</div>
        <div className="g-tab">Actualités</div>
        <div className="g-tab">Images</div>
        <div className="g-tab">Vidéos</div>
        <div className="g-tab">Maps</div>
      </div>

      <div className="g-body">
        <div className="results">
          <div className="result-count">Environ 48 200 000 résultats (0,42 secondes)</div>

          {/* Ad 1 — Sponsored */}
          <div className="ad-result">
            <div className="ad-url">
              <span className="ad-tag">Annonce</span>
              trustaura.fr › marketing › paris
            </div>
            <div className="ad-title">Trust Aura — Agence Marketing #1 Paris | ROI Garanti</div>
            <div className="ad-desc">
              Multipliez votre CA grâce à nos campagnes Meta & Google. <strong>50+ clients satisfaits</strong>, résultats mesurables dès le 1er mois.
              Audit gratuit offert — Réponse sous 24h. Zéro engagement.
            </div>
            <div className="ad-extensions">
              <div className="ad-ext">📊 Audit gratuit</div>
              <div className="ad-ext">🎯 Meta Ads</div>
              <div className="ad-ext">🔍 Google Ads</div>
              <div className="ad-ext">📱 Réseaux Sociaux</div>
            </div>
          </div>

          {/* Ad 2 */}
          <div className="ad-result">
            <div className="ad-url">
              <span className="ad-tag">Annonce</span>
              votrebusiness.fr › croissance › digital
            </div>
            <div className="ad-title">VotreBusiness.fr — Agence Digitale | +200% CA en 90 jours</div>
            <div className="ad-desc">
              Stratégie digitale sur-mesure pour entrepreneurs ambitieux. Google Ads, SEO, Social Media.
              <strong> Plus de 3M€ générés</strong> pour nos clients. Démarrez maintenant.
            </div>
          </div>

          <div className="divider" />

          {/* Organic results */}
          {[
            {
              title: "Les 10 meilleures agences marketing Paris en 2025",
              url: "blogmarketing.fr › classement-agences",
              desc: "Découvrez notre sélection des meilleures agences de marketing digital à Paris. Critères : résultats clients, transparence, ROI mesuré..."
            },
            {
              title: "Comment choisir son agence marketing ? Guide complet",
              url: "entrepreneur.fr › guide-agence-marketing",
              desc: "Choisir la bonne agence peut transformer votre business. Voici les 7 critères essentiels pour ne pas vous tromper..."
            },
            {
              title: "Trust Aura | Agence Marketing Digital Paris — À propos",
              url: "trustaura.fr › a-propos",
              desc: "Fondée en 2025, Trust Aura accompagne les entrepreneurs ambitieux. Meta Ads, Google Ads, Social Media. 50+ clients, 3M€+ de CA généré..."
            },
          ].map((r) => (
            <div key={r.title} className="org-result">
              <div className="org-url">
                <div className="org-favicon">W</div>
                {r.url}
              </div>
              <div className="org-title">{r.title}</div>
              <div className="org-desc">{r.desc}</div>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div className="right-panel">
          <div className="panel-card">
            <div className="panel-title">📈 Performances campagne</div>
            <div className="kpi-grid">
              <div className="kpi"><div className="kpi-val">€0.48</div><div className="kpi-label">CPC moyen</div></div>
              <div className="kpi"><div className="kpi-val">8.2%</div><div className="kpi-label">CTR</div></div>
              <div className="kpi"><div className="kpi-val">4.1×</div><div className="kpi-label">ROAS</div></div>
              <div className="kpi"><div className="kpi-val">#1.2</div><div className="kpi-label">Position moy.</div></div>
            </div>
          </div>

          <div className="panel-card">
            <div className="panel-title">🔑 Mots-clés actifs</div>
            <div className="keyword-list">
              {[
                { kw: "agence marketing paris", pos: "#1", vol: "2 400/mois" },
                { kw: "meta ads france", pos: "#2", vol: "1 900/mois" },
                { kw: "google ads agence", pos: "#1", vol: "1 600/mois" },
                { kw: "publicité facebook", pos: "#3", vol: "3 600/mois" },
              ].map((k) => (
                <div key={k.kw} className="kw-item">
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600 }}>{k.kw}</div>
                    <div style={{ fontSize: "0.7rem", color: "#70757a" }}>{k.vol}</div>
                  </div>
                  <div className="kw-pos">{k.pos}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
