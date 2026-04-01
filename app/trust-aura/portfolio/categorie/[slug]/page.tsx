"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { projects, categories } from "@/data/trust-aura/projects"
import TrustAuraFooter from "@/components/trust-aura/Footer"

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = decodeURIComponent(params.slug as string)

  const categoryProjects = projects.filter((p) => p.category === slug)
  const [lightbox, setLightbox] = useState<typeof projects[0] | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  function openLightbox(p: typeof projects[0], i: number) {
    setLightbox(p)
    setLightboxIndex(i)
  }

  function prev() {
    const newIdx = (lightboxIndex - 1 + categoryProjects.length) % categoryProjects.length
    setLightbox(categoryProjects[newIdx])
    setLightboxIndex(newIdx)
  }

  function next() {
    const newIdx = (lightboxIndex + 1) % categoryProjects.length
    setLightbox(categoryProjects[newIdx])
    setLightboxIndex(newIdx)
  }

  if (categoryProjects.length === 0) {
    return (
      <div style={{ background: "#080C14", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Inter, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <h2 style={{ marginBottom: "1rem" }}>Catégorie introuvable</h2>
          <button onClick={() => router.push("/trust-aura/portfolio")} style={{ background: "linear-gradient(135deg,#EC4899,#2563EB)", color: "#fff", border: "none", padding: "0.7rem 1.5rem", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}>
            ← Retour au portfolio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cat-root">
      <style>{`
        :root {
          --blue: #2563EB; --blue-light: #60A5FA;
          --black: #080C14; --surface: #0F172A;
          --border: rgba(37,99,235,0.22);
          --grad: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
        }
        * { box-sizing: border-box; }
        .cat-root { font-family: 'Inter', system-ui, sans-serif; background: var(--black); color: #F8FAFC; min-height: 100vh; }

        /* NAV */
        .cat-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%; height: 70px;
          background: rgba(8,12,20,0.9); backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
        }
        .cat-logo { font-size: 1.2rem; font-weight: 800; color: #fff; text-decoration: none; }
        .cat-logo span { color: var(--blue-light); }
        .cat-back {
          display: flex; align-items: center; gap: 0.5rem;
          color: rgba(248,250,252,0.6); font-size: 0.88rem; font-weight: 600;
          text-decoration: none; transition: color 0.2s; cursor: pointer; background: none; border: none; font-family: inherit;
        }
        .cat-back:hover { color: var(--blue-light); }
        .cat-nav-cats { display: flex; gap: 0.5rem; }
        .cat-nav-cat {
          background: none; border: 1px solid transparent; color: rgba(248,250,252,0.45);
          font-size: 0.8rem; font-weight: 600; padding: 0.35rem 0.85rem;
          border-radius: 99px; cursor: pointer; font-family: inherit; transition: all 0.2s; text-decoration: none;
        }
        .cat-nav-cat:hover { color: var(--blue-light); border-color: var(--border); }
        .cat-nav-cat.active { color: var(--blue-light); border-color: var(--blue); background: rgba(37,99,235,0.1); }

        /* HERO */
        .cat-hero {
          padding: 110px 5% 3rem;
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; flex-wrap: wrap;
        }
        .cat-hero-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--blue-light); margin-bottom: 0.6rem; }
        .cat-hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; letter-spacing: -0.03em; margin: 0 0 0.5rem; }
        .cat-hero-sub { color: rgba(248,250,252,0.45); font-size: 0.95rem; }
        .cat-hero-count {
          font-size: 4rem; font-weight: 900; line-height: 1;
          background: var(--grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .cat-hero-count-label { font-size: 0.78rem; color: rgba(248,250,252,0.35); margin-top: 0.2rem; text-align: right; }

        /* GRID */
        .cat-grid {
          max-width: 1200px; margin: 0 auto;
          padding: 0 5% 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1.5rem;
        }
        .cat-card {
          border-radius: 14px; overflow: hidden; cursor: pointer;
          border: 1px solid var(--border);
          transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
          background: var(--surface);
        }
        .cat-card:hover { transform: translateY(-5px); border-color: var(--blue); box-shadow: 0 12px 40px rgba(37,99,235,0.18); }
        .cat-card-img { position: relative; overflow: hidden; height: 260px; }
        .cat-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; display: block; }
        .cat-card:hover .cat-card-img img { transform: scale(1.06); }
        .cat-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(8,12,20,0.85) 0%, transparent 55%);
          display: flex; align-items: flex-end; padding: 1.2rem;
          opacity: 0; transition: opacity 0.3s;
        }
        .cat-card:hover .cat-card-overlay { opacity: 1; }
        .cat-overlay-btn {
          background: rgba(255,255,255,0.12); backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2); color: #fff;
          padding: 0.5rem 1.1rem; border-radius: 99px;
          font-size: 0.82rem; font-weight: 700;
        }
        .cat-card-body { padding: 1.3rem; }
        .cat-card-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.7rem; }
        .cat-tag {
          font-size: 0.68rem; font-weight: 600; color: rgba(248,250,252,0.45);
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          padding: 0.18rem 0.5rem; border-radius: 4px;
        }
        .cat-card h3 { font-size: 1.1rem; font-weight: 800; margin: 0 0 0.2rem; }
        .cat-card-client { font-size: 0.78rem; color: rgba(248,250,252,0.4); margin-bottom: 0.7rem; }
        .cat-card-desc { font-size: 0.82rem; color: rgba(248,250,252,0.5); line-height: 1.6; margin-bottom: 0.9rem; }
        .cat-card-result { font-size: 0.78rem; font-weight: 700; padding: 0.25rem 0.65rem; border-radius: 5px; display: inline-block; }

        /* LIGHTBOX */
        .cat-lightbox {
          position: fixed; inset: 0; z-index: 300;
          background: rgba(4,7,13,0.96); backdrop-filter: blur(16px);
          display: flex; flex-direction: column;
        }
        .cat-lb-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 2rem; border-bottom: 1px solid var(--border); flex-shrink: 0;
        }
        .cat-lb-title { font-size: 1rem; font-weight: 800; }
        .cat-lb-client { font-size: 0.8rem; color: rgba(248,250,252,0.4); margin-top: 0.1rem; }
        .cat-lb-actions { display: flex; align-items: center; gap: 1rem; }
        .cat-lb-counter { font-size: 0.8rem; color: rgba(248,250,252,0.35); }
        .cat-lb-close {
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
          color: rgba(248,250,252,0.7); width: 36px; height: 36px; border-radius: 8px;
          cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center;
          font-family: inherit; transition: all 0.2s;
        }
        .cat-lb-close:hover { background: rgba(255,255,255,0.14); color: #fff; }
        .cat-lb-body {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 1.5rem; position: relative; overflow: hidden;
        }
        .cat-lb-img {
          max-width: 100%; max-height: 100%; object-fit: contain;
          border-radius: 10px; border: 1px solid var(--border);
          box-shadow: 0 20px 80px rgba(0,0,0,0.6);
        }
        .cat-lb-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.08); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.12); color: #fff;
          width: 46px; height: 46px; border-radius: 50%;
          cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;
          font-family: inherit; transition: all 0.2s;
        }
        .cat-lb-nav:hover { background: rgba(37,99,235,0.3); border-color: var(--blue); }
        .cat-lb-nav.prev { left: 1.5rem; }
        .cat-lb-nav.next { right: 1.5rem; }
        .cat-lb-bottombar {
          padding: 1rem 2rem; border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
          flex-shrink: 0;
        }
        .cat-lb-result { font-size: 0.82rem; font-weight: 700; padding: 0.3rem 0.75rem; border-radius: 5px; }
        .cat-lb-stack { font-size: 0.78rem; color: rgba(248,250,252,0.3); }
        .cat-lb-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .cat-lb-dots { display: flex; gap: 0.4rem; align-items: center; }
        .cat-lb-dot {
          width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.2);
          cursor: pointer; transition: all 0.2s;
        }
        .cat-lb-dot.active { background: var(--blue-light); width: 20px; border-radius: 3px; }

        /* CAT SIDEBAR */
        .cat-sidebar {
          max-width: 1200px; margin: 0 auto;
          padding: 0 5% 5rem;
          display: flex; gap: 0.6rem; flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .cat-nav-cats { display: none; }
          .cat-grid { grid-template-columns: 1fr; }
          .cat-lb-nav { display: none; }
        }
      `}</style>

      {/* NAV */}
      <nav className="cat-nav">
        <a href="/trust-aura" className="cat-logo">Trust<span>Aura</span></a>
        <div className="cat-nav-cats">
          {categories.filter(c => c !== "Tous").map((cat) => (
            <a
              key={cat}
              href={`/trust-aura/portfolio/categorie/${encodeURIComponent(cat)}`}
              className={`cat-nav-cat${cat === slug ? " active" : ""}`}
            >
              {cat}
            </a>
          ))}
        </div>
        <button className="cat-back" onClick={() => router.push("/trust-aura/portfolio")}>
          ← Tout le portfolio
        </button>
      </nav>

      {/* HERO */}
      <div className="cat-hero">
        <div>
          <div className="cat-hero-label">✦ Portfolio · {slug}</div>
          <h1>{slug}</h1>
          <div className="cat-hero-sub">Nos créations dans cette catégorie</div>
        </div>
        <div>
          <div className="cat-hero-count">{categoryProjects.length}</div>
          <div className="cat-hero-count-label">projet{categoryProjects.length > 1 ? "s" : ""}</div>
        </div>
      </div>

      {/* GRID */}
      <div className="cat-grid">
        {categoryProjects.map((p, i) => (
          <div key={p.id} className="cat-card" onClick={() => openLightbox(p, i)}>
            <div className="cat-card-img">
              <img src={p.image} alt={p.title} />
              <div className="cat-card-overlay">
                <div className="cat-overlay-btn">🔍 Voir en plein écran</div>
              </div>
            </div>
            <div className="cat-card-body">
              <div className="cat-card-tags">
                {p.tags.map((t) => <span key={t} className="cat-tag">{t}</span>)}
              </div>
              <h3>{p.title}</h3>
              <div className="cat-card-client">{p.client}</div>
              <p className="cat-card-desc">{p.desc}</p>
              <div className="cat-card-result" style={{ background: `${p.accent}18`, color: p.accent }}>
                ↑ {p.result}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div className="cat-lightbox" onClick={() => setLightbox(null)}>
          {/* Top bar */}
          <div className="cat-lb-topbar" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="cat-lb-title">{lightbox.title}</div>
              <div className="cat-lb-client">{lightbox.client}</div>
            </div>
            <div className="cat-lb-actions">
              <div className="cat-lb-dots">
                {categoryProjects.map((_, i) => (
                  <div
                    key={i}
                    className={`cat-lb-dot${i === lightboxIndex ? " active" : ""}`}
                    onClick={() => { setLightbox(categoryProjects[i]); setLightboxIndex(i) }}
                  />
                ))}
              </div>
              <span className="cat-lb-counter">{lightboxIndex + 1} / {categoryProjects.length}</span>
              <button className="cat-lb-close" onClick={() => setLightbox(null)}>✕</button>
            </div>
          </div>

          {/* Image */}
          <div className="cat-lb-body" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.imageFull} alt={lightbox.title} className="cat-lb-img" />
            {categoryProjects.length > 1 && (
              <>
                <button className="cat-lb-nav prev" onClick={prev}>‹</button>
                <button className="cat-lb-nav next" onClick={next}>›</button>
              </>
            )}
          </div>

          {/* Bottom bar */}
          <div className="cat-lb-bottombar" onClick={(e) => e.stopPropagation()}>
            <div className="cat-lb-tags">
              {lightbox.tags.map((t) => (
                <span key={t} className="cat-tag">{t}</span>
              ))}
            </div>
            <div className="cat-lb-result" style={{ background: `${lightbox.accent}18`, color: lightbox.accent }}>
              ↑ {lightbox.result}
            </div>
            <div className="cat-lb-stack">{lightbox.stack}</div>
          </div>
        </div>
      )}

      <TrustAuraFooter />
    </div>
  )
}
