"use client"

import { useState } from "react"
import TrustAuraFooter from "@/components/trust-aura/Footer"
import { categories, projects, type Project } from "@/data/trust-aura/projects"

// ─── Component ────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("Tous")
  const [selected, setSelected] = useState<Project | null>(null)

  const filtered = activeCategory === "Tous"
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  return (
    <div className="pf-root">
      <style>{`
        :root {
          --blue: #2563EB;
          --blue-light: #60A5FA;
          --blue-dim: rgba(37,99,235,0.08);
          --black: #f1f5f9;
          --surface: #ffffff;
          --border: rgba(15,23,42,0.09);
          --text: #0f172a;
          --text-muted: rgba(15,23,42,0.55);
        }
        * { box-sizing: border-box; }
        .pf-root {
          font-family: 'Inter', system-ui, sans-serif;
          background: #f1f5f9;
          color: var(--text);
          min-height: 100vh;
        }

        /* NAV */
        .pf-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%; height: 70px;
          background: rgba(241,245,249,0.92);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(15,23,42,0.08);
        }
        .pf-logo {
          font-size: 1.2rem; font-weight: 800; letter-spacing: -0.02em;
          color: var(--text); text-decoration: none;
        }
        .pf-logo span { color: var(--blue); }
        .pf-nav-links {
          display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0;
        }
        .pf-nav-links a {
          color: rgba(15,23,42,0.55); font-size: 0.9rem; text-decoration: none;
          transition: color 0.2s;
        }
        .pf-nav-links a:hover { color: var(--blue); }
        .pf-btn {
          background: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          color: #fff; border: none;
          padding: 0.55rem 1.3rem; border-radius: 6px; font-weight: 700;
          font-size: 0.85rem; cursor: pointer; text-decoration: none;
          transition: opacity 0.2s, transform 0.15s;
        }
        .pf-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        /* HEADER */
        .pf-header {
          min-height: 420px;
          display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start;
          padding: 120px 5% 60px;
          position: relative; overflow: hidden;
          background-image: url('https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1800&q=80');
          background-size: cover; background-position: center;
        }
        .pf-header::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(8,12,28,0.70); z-index: 0;
        }
        .pf-header::after {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 30% 50%, rgba(37,99,235,0.3) 0%, transparent 65%);
          z-index: 0;
        }
        .pf-header > * { position: relative; z-index: 1; }
        .pf-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: rgba(37,99,235,0.2); border: 1px solid rgba(96,165,250,0.35);
          color: #93C5FD; font-size: 0.75rem; font-weight: 600;
          padding: 0.3rem 0.85rem; border-radius: 99px; margin-bottom: 1.5rem;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .pf-header h1 {
          font-size: clamp(2rem, 5vw, 3.8rem);
          font-weight: 900; line-height: 1.1; letter-spacing: -0.03em;
          margin: 0 0 1rem; max-width: 700px; color: #ffffff;
        }
        .pf-blue {
          background: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pf-header p {
          font-size: 1.05rem; color: rgba(255,255,255,0.80);
          max-width: 500px; line-height: 1.7; margin: 0;
        }

        /* FILTERS */
        .pf-filters {
          max-width: 1200px; margin: 0 auto;
          padding: 3rem 5% 3rem;
          display: flex; gap: 0.6rem; flex-wrap: wrap;
        }
        .pf-filter {
          background: #fff; border: 1px solid rgba(15,23,42,0.12);
          color: rgba(15,23,42,0.55); font-size: 0.82rem; font-weight: 600;
          padding: 0.45rem 1rem; border-radius: 99px; cursor: pointer;
          transition: all 0.2s; font-family: inherit;
        }
        .pf-filter:hover { border-color: var(--blue); color: var(--blue); }
        .pf-filter.active {
          background: var(--blue-dim); border-color: var(--blue);
          color: var(--blue);
        }

        /* GRID */
        .pf-grid {
          max-width: 1200px; margin: 0 auto;
          padding: 0 5% 6rem;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5rem;
        }

        /* CARD */
        .pf-card {
          background: #fff; border: 1px solid rgba(15,23,42,0.09);
          border-radius: 14px; overflow: hidden; cursor: pointer;
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
        }
        .pf-card:hover {
          transform: translateY(-4px);
          border-color: var(--blue);
          box-shadow: 0 8px 32px rgba(37,99,235,0.15);
        }
        .pf-card-preview {
          height: 220px;
          position: relative; overflow: hidden;
        }
        .pf-card-preview img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.4s ease;
          display: block;
        }
        .pf-card:hover .pf-card-preview img { transform: scale(1.05); }
        .pf-card-preview-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(8,12,20,0.7) 100%);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.3s;
        }
        .pf-card:hover .pf-card-preview-overlay { opacity: 1; }
        .pf-preview-btn {
          background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25); color: #fff;
          padding: 0.55rem 1.2rem; border-radius: 99px;
          font-size: 0.82rem; font-weight: 700; letter-spacing: 0.03em;
        }
        .pf-card-body { padding: 1.4rem; }
        .pf-card-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.85rem; }
        .pf-tag {
          font-size: 0.7rem; font-weight: 600; color: rgba(15,23,42,0.45);
          background: rgba(15,23,42,0.05); border: 1px solid rgba(15,23,42,0.08);
          padding: 0.2rem 0.55rem; border-radius: 4px; letter-spacing: 0.03em;
        }
        .pf-card-cat {
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 0.4rem;
        }
        .pf-card h3 {
          font-size: 1.2rem; font-weight: 800; margin: 0 0 0.3rem; letter-spacing: -0.01em; color: var(--text);
        }
        .pf-card-client { font-size: 0.8rem; color: rgba(15,23,42,0.4); margin-bottom: 0.85rem; }
        .pf-card-desc {
          font-size: 0.85rem; color: var(--text-muted);
          line-height: 1.6; margin-bottom: 1.1rem;
        }
        .pf-card-result {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.8rem; font-weight: 700; padding: 0.3rem 0.7rem;
          border-radius: 5px;
        }
        .pf-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 1rem; border-top: 1px solid rgba(15,23,42,0.07);
          margin-top: 1rem;
        }
        .pf-card-stack { font-size: 0.72rem; color: rgba(15,23,42,0.35); }
        .pf-card-arrow {
          font-size: 1rem; color: rgba(15,23,42,0.3);
          transition: color 0.2s, transform 0.2s;
        }
        .pf-card:hover .pf-card-arrow { color: var(--blue); transform: translateX(3px); }

        /* MODAL */
        .pf-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(15,23,42,0.45); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
        }
        .pf-modal {
          background: #fff; border: 1px solid rgba(15,23,42,0.1);
          border-radius: 16px; max-width: 780px; width: 100%;
          max-height: 92vh; overflow-y: auto;
        }
        .pf-modal-preview {
          height: 320px; border-radius: 14px 14px 0 0;
          position: relative; overflow: hidden;
        }
        .pf-modal-preview img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .pf-modal-preview-bar {
          position: absolute; top: 0; left: 0; right: 0;
          height: 36px; background: rgba(255,255,255,0.85); backdrop-filter: blur(8px);
          display: flex; align-items: center; padding: 0 14px; gap: 6px;
        }
        .pf-modal-dot { width: 9px; height: 9px; border-radius: 50%; }
        .pf-modal-preview-label {
          position: absolute; bottom: 12px; left: 14px;
          background: rgba(255,255,255,0.85); backdrop-filter: blur(6px);
          color: rgba(15,23,42,0.7); font-size: 0.72rem;
          padding: 0.25rem 0.7rem; border-radius: 99px;
          border: 1px solid rgba(15,23,42,0.1);
        }
        .pf-modal-body { padding: 2rem; }
        .pf-modal-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .pf-modal h2 {
          font-size: 1.8rem; font-weight: 900; letter-spacing: -0.02em; margin: 0 0 0.3rem; color: var(--text);
        }
        .pf-close {
          background: rgba(15,23,42,0.05); border: 1px solid rgba(15,23,42,0.1);
          color: rgba(15,23,42,0.5); width: 32px; height: 32px;
          border-radius: 6px; cursor: pointer; font-size: 1rem;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-family: inherit; transition: all 0.2s;
        }
        .pf-close:hover { background: rgba(15,23,42,0.1); color: var(--text); }
        .pf-modal-desc {
          font-size: 0.95rem; color: var(--text-muted);
          line-height: 1.7; margin-bottom: 1.5rem;
        }
        .pf-modal-meta {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;
        }
        .pf-meta-item { background: #f8fafc; border: 1px solid rgba(15,23,42,0.08); border-radius: 8px; padding: 1rem; }
        .pf-meta-label { font-size: 0.7rem; color: rgba(15,23,42,0.4); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.35rem; }
        .pf-meta-value { font-size: 0.92rem; font-weight: 600; color: var(--text); }
        .pf-modal-cta { display: flex; gap: 0.8rem; flex-wrap: wrap; }
        .pf-btn-outline {
          color: var(--text); padding: 0.6rem 1.3rem; border-radius: 7px;
          font-weight: 700; font-size: 0.88rem; cursor: pointer; font-family: inherit;
          transition: opacity 0.2s, transform 0.15s; text-decoration: none;
          border: 1.5px solid transparent;
          background-image: linear-gradient(#fff, #fff),
            linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }
        .pf-btn-outline:hover { opacity: 0.8; transform: translateY(-1px); }

        /* FOOTER */
        .pf-footer {
          border-top: 1px solid rgba(15,23,42,0.08);
          padding: 2.5rem 5%; text-align: center;
          color: rgba(15,23,42,0.35); font-size: 0.8rem;
        }
        .pf-footer-logo { color: var(--text); font-weight: 800; font-size: 1rem; margin-bottom: 0.4rem; }
        .pf-footer-logo span { color: var(--blue); }

        /* MOBILE */
        @media (max-width: 768px) {
          .pf-nav-links { display: none; }
          .pf-grid { grid-template-columns: 1fr; }
          .pf-modal-meta { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAV */}
      <nav className="pf-nav">
        <a href="/trust-aura" className="pf-logo">Trust<span>Aura</span></a>
        <ul className="pf-nav-links">
          <li><a href="/trust-aura#services">Services</a></li>
          <li><a href="/trust-aura/a-propos">À propos</a></li>
          <li><a href="/trust-aura/portfolio" style={{ color: "var(--blue-light)", fontWeight: 700 }}>Portfolio</a></li>
          <li><a href="/trust-aura#resultats">Résultats</a></li>
          <li><a href="/trust-aura#contact">Contact</a></li>
        </ul>
        <a href="/trust-aura/travaillons-ensemble" className="pf-btn">Audit gratuit →</a>
      </nav>

      {/* HEADER */}
      <div className="pf-header">
        <div className="pf-badge">✦ Nos réalisations</div>
        <h1>
          Des sites qui <span className="pf-blue">convertissent</span>,<br />
          pas juste qui brillent.
        </h1>
        <p>
          Chaque projet est conçu sur mesure — design, performance et stratégie pensés
          pour générer de vrais résultats business.
        </p>
        <div style={{
          display: "flex", alignItems: "flex-start", gap: "1rem",
          marginTop: "2rem", background: "rgba(255,255,255,0.10)",
          border: "1px solid rgba(255,255,255,0.25)", borderRadius: "12px",
          padding: "1.2rem 1.5rem", maxWidth: "620px"
        }}>
          <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>✏️</span>
          <div>
            <p style={{ margin: "0 0 0.3rem", fontWeight: 700, fontSize: "0.92rem", color: "#ffffff" }}>
              Chaque site est 100% personnalisé selon vos envies
            </p>
            <p style={{ margin: 0, fontSize: "0.84rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
              Les réalisations ci-dessous sont des exemples de styles et secteurs que nous maîtrisons.
              Votre site sera conçu de A à Z selon votre identité, vos couleurs et vos objectifs.
              Aucun template imposé — tout est créé pour vous, par vous.
            </p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="pf-filters">
        {categories.map((cat) => (
          cat === "Tous" ? (
            <button
              key={cat}
              className={`pf-filter${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ) : (
            <a
              key={cat}
              href={`/trust-aura/portfolio/categorie/${encodeURIComponent(cat)}`}
              className="pf-filter"
            >
              {cat} →
            </a>
          )
        ))}
      </div>

      {/* GRID */}
      <div className="pf-grid">
        {filtered.map((p) => (
          <div key={p.id} className="pf-card" onClick={() => setSelected(p)}>
            {/* Preview */}
            <div className="pf-card-preview">
              <img src={p.image} alt={p.title} />
              <div className="pf-card-preview-overlay">
                <a
                  href={`/trust-aura/portfolio/demo/${p.id}`}
                  className="pf-preview-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  🖥 Voir la démo
                </a>
              </div>
            </div>

            {/* Body */}
            <div className="pf-card-body">
              <div className="pf-card-tags">
                <span className="pf-card-cat" style={{ color: p.accent }}>{p.category}</span>
                {p.tags.map((t) => (
                  <span key={t} className="pf-tag">{t}</span>
                ))}
              </div>
              <h3>{p.title}</h3>
              <div className="pf-card-client">{p.client}</div>
              <p className="pf-card-desc">{p.desc}</p>
              <div className="pf-card-result" style={{ background: `${p.accent}18`, color: p.accent }}>
                ↑ {p.result}
              </div>
              <div className="pf-card-footer">
                <span className="pf-card-stack">{p.stack}</span>
                <span className="pf-card-arrow">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="pf-overlay" onClick={() => setSelected(null)}>
          <div className="pf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pf-modal-preview">
              <div className="pf-modal-preview-bar">
                <div className="pf-modal-dot" style={{ background: "#FF5F57" }} />
                <div className="pf-modal-dot" style={{ background: "#FFBD2E" }} />
                <div className="pf-modal-dot" style={{ background: "#28CA41" }} />
              </div>
              <img src={selected.image} alt={selected.title} />
              <div className="pf-modal-preview-label">Design · {selected.client}</div>
            </div>
            <div className="pf-modal-body">
              <div className="pf-modal-header">
                <div>
                  <div style={{ color: selected.accent, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                    {selected.category}
                  </div>
                  <h2>{selected.title}</h2>
                  <div style={{ color: "rgba(15,23,42,0.4)", fontSize: "0.85rem" }}>{selected.client}</div>
                </div>
                <button className="pf-close" onClick={() => setSelected(null)}>✕</button>
              </div>
              <p className="pf-modal-desc">{selected.desc}</p>
              <div className="pf-modal-meta">
                <div className="pf-meta-item">
                  <div className="pf-meta-label">Résultat obtenu</div>
                  <div className="pf-meta-value" style={{ color: selected.accent }}>↑ {selected.result}</div>
                </div>
                <div className="pf-meta-item">
                  <div className="pf-meta-label">Technologies</div>
                  <div className="pf-meta-value">{selected.stack}</div>
                </div>
                <div className="pf-meta-item">
                  <div className="pf-meta-label">Type de projet</div>
                  <div className="pf-meta-value">{selected.category}</div>
                </div>
                <div className="pf-meta-item">
                  <div className="pf-meta-label">Services inclus</div>
                  <div className="pf-meta-value">{selected.tags.join(", ")}</div>
                </div>
              </div>
              <div className="pf-modal-cta">
                <a href="/trust-aura/travaillons-ensemble" className="pf-btn">
                  Projet personnalisable ? →
                </a>
                <button className="pf-btn-outline" onClick={() => setSelected(null)}>
                  Voir d&apos;autres projets
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <TrustAuraFooter />
    </div>
  )
}
