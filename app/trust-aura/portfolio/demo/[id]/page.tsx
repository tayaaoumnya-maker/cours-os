"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { projects } from "@/data/trust-aura/projects"

export default function DemoPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const project = projects.find((p) => p.id === id)
  const currentIndex = projects.findIndex((p) => p.id === id)
  const [view, setView] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [infoOpen, setInfoOpen] = useState(true)

  if (!project) {
    return (
      <div style={{ background: "#f1f5f9", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", fontFamily: "Inter,sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ marginBottom: "1rem", color: "rgba(15,23,42,0.5)" }}>Projet introuvable</p>
          <button onClick={() => router.push("/trust-aura/portfolio")} style={{ background: "linear-gradient(135deg,#EC4899,#2563EB)", color: "#fff", border: "none", padding: "0.7rem 1.5rem", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>
            ← Retour au portfolio
          </button>
        </div>
      </div>
    )
  }

  function goTo(dir: "prev" | "next") {
    const newIndex = dir === "prev"
      ? (currentIndex - 1 + projects.length) % projects.length
      : (currentIndex + 1) % projects.length
    router.push(`/trust-aura/portfolio/demo/${projects[newIndex].id}`)
  }

  const viewWidths = { desktop: "100%", tablet: "768px", mobile: "390px" }

  return (
    <div className="demo-root">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .demo-root {
          font-family: 'Inter', system-ui, sans-serif;
          background: #e8edf3;
          height: 100vh; display: flex; flex-direction: column; overflow: hidden;
          color: #0f172a;
        }

        /* TOP BAR */
        .demo-topbar {
          height: 56px; flex-shrink: 0;
          background: #f1f5f9;
          border-bottom: 1px solid rgba(15,23,42,0.1);
          display: flex; align-items: center; gap: 0;
          padding: 0 1rem;
        }
        .demo-back {
          display: flex; align-items: center; gap: 0.45rem;
          background: none; border: none; color: rgba(15,23,42,0.55);
          font-size: 0.82rem; font-weight: 600; cursor: pointer;
          font-family: inherit; padding: 0.4rem 0.8rem; border-radius: 6px;
          transition: all 0.2s; text-decoration: none; white-space: nowrap;
        }
        .demo-back:hover { background: rgba(15,23,42,0.06); color: #0f172a; }
        .demo-topbar-divider { width: 1px; height: 24px; background: rgba(15,23,42,0.1); margin: 0 0.8rem; flex-shrink: 0; }

        /* URL BAR */
        .demo-urlbar {
          flex: 1; display: flex; align-items: center; gap: 0.6rem;
          background: #fff; border: 1px solid rgba(15,23,42,0.12);
          border-radius: 8px; padding: 0 0.9rem; height: 34px; min-width: 0;
        }
        .demo-urlbar-dots { display: flex; gap: 5px; flex-shrink: 0; }
        .demo-dot { width: 9px; height: 9px; border-radius: 50%; }
        .demo-urlbar-text {
          font-size: 0.78rem; color: rgba(15,23,42,0.4);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .demo-urlbar-text span { color: rgba(15,23,42,0.65); }

        /* VIEW SWITCHER */
        .demo-views { display: flex; gap: 2px; margin-left: 0.8rem; flex-shrink: 0; }
        .demo-view-btn {
          background: none; border: none; color: rgba(15,23,42,0.4);
          cursor: pointer; font-family: inherit; padding: 0.35rem 0.55rem;
          border-radius: 5px; font-size: 0.78rem; transition: all 0.2s;
          display: flex; align-items: center; gap: 0.3rem;
        }
        .demo-view-btn:hover { background: rgba(15,23,42,0.06); color: rgba(15,23,42,0.7); }
        .demo-view-btn.active { background: rgba(37,99,235,0.1); color: #2563EB; }

        /* NAV ARROWS */
        .demo-nav-arrows { display: flex; gap: 0.4rem; margin-left: 0.8rem; flex-shrink: 0; }
        .demo-arrow {
          background: #fff; border: 1px solid rgba(15,23,42,0.12);
          color: rgba(15,23,42,0.5); width: 30px; height: 30px;
          border-radius: 6px; cursor: pointer; font-size: 0.9rem;
          display: flex; align-items: center; justify-content: center;
          font-family: inherit; transition: all 0.2s;
        }
        .demo-arrow:hover { background: rgba(37,99,235,0.08); border-color: rgba(37,99,235,0.3); color: #2563EB; }

        /* INFO TOGGLE */
        .demo-info-toggle {
          margin-left: 0.8rem; flex-shrink: 0;
          background: #fff; border: 1px solid rgba(15,23,42,0.12);
          color: rgba(15,23,42,0.5); padding: 0.3rem 0.7rem;
          border-radius: 6px; cursor: pointer; font-size: 0.78rem; font-weight: 600;
          font-family: inherit; transition: all 0.2s; white-space: nowrap;
        }
        .demo-info-toggle.active { background: rgba(37,99,235,0.08); border-color: rgba(37,99,235,0.3); color: #2563EB; }
        .demo-info-toggle:hover { border-color: rgba(15,23,42,0.2); color: #0f172a; }

        /* MAIN AREA */
        .demo-main {
          flex: 1; display: flex; overflow: hidden; position: relative;
        }

        /* CANVAS */
        .demo-canvas {
          flex: 1; display: flex; align-items: flex-start; justify-content: center;
          padding: 1.5rem; overflow: auto; background: #e8edf3;
          background-image: radial-gradient(rgba(15,23,42,0.06) 1px, transparent 1px);
          background-size: 24px 24px;
          transition: padding 0.3s;
        }
        .demo-frame-wrap {
          transition: width 0.35s cubic-bezier(0.4,0,0.2,1);
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          box-shadow: 0 8px 40px rgba(15,23,42,0.12), 0 0 0 1px rgba(15,23,42,0.08);
          border-radius: 10px; overflow: hidden;
          background: #fff;
          min-height: calc(100vh - 100px);
        }
        .demo-frame-bar {
          height: 38px; background: #f1f5f9; flex-shrink: 0;
          display: flex; align-items: center; padding: 0 12px; gap: 6px;
          border-bottom: 1px solid rgba(15,23,42,0.08);
        }

        /* IMAGE PREVIEW (quand pas de demoUrl) */
        .demo-image-preview {
          flex: 1; position: relative; overflow: hidden;
        }
        .demo-image-preview img {
          width: 100%; height: 100%; object-fit: cover; object-position: top;
          display: block;
        }
        .demo-image-overlay {
          position: absolute; inset: 0;
          background: rgba(241,245,249,0.75); backdrop-filter: blur(2px);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;
        }
        .demo-add-url-label {
          color: rgba(15,23,42,0.6); font-size: 0.9rem; text-align: center; max-width: 280px; line-height: 1.6;
        }
        .demo-add-url-badge {
          background: rgba(37,99,235,0.08); border: 1px solid rgba(37,99,235,0.25);
          color: #2563EB; font-size: 0.75rem; font-weight: 600; font-family: monospace;
          padding: 0.4rem 1rem; border-radius: 6px;
        }

        /* IFRAME */
        .demo-iframe {
          flex: 1; width: 100%; border: none; display: block;
        }

        /* SIDEBAR INFO */
        .demo-sidebar {
          width: 300px; flex-shrink: 0;
          background: #f1f5f9; border-left: 1px solid rgba(15,23,42,0.1);
          display: flex; flex-direction: column; overflow-y: auto;
          transform: translateX(0); transition: width 0.3s, transform 0.3s;
        }
        .demo-sidebar.closed { width: 0; overflow: hidden; }
        .demo-sidebar-inner { padding: 1.5rem; min-width: 300px; }
        .demo-sidebar-cat {
          font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; margin-bottom: 0.6rem;
        }
        .demo-sidebar h2 { font-size: 1.4rem; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 0.3rem; color: #0f172a; }
        .demo-sidebar-client { font-size: 0.82rem; color: rgba(15,23,42,0.4); margin-bottom: 1.2rem; }
        .demo-sidebar-desc { font-size: 0.83rem; color: rgba(15,23,42,0.55); line-height: 1.65; margin-bottom: 1.3rem; }
        .demo-sidebar-divider { border: none; border-top: 1px solid rgba(15,23,42,0.08); margin-bottom: 1.3rem; }
        .demo-sidebar-row { display: flex; flex-direction: column; gap: 0.2rem; margin-bottom: 1rem; }
        .demo-sidebar-label { font-size: 0.68rem; color: rgba(15,23,42,0.35); text-transform: uppercase; letter-spacing: 0.08em; }
        .demo-sidebar-val { font-size: 0.85rem; font-weight: 600; color: #0f172a; }
        .demo-sidebar-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.3rem; }
        .demo-tag {
          font-size: 0.7rem; font-weight: 600; color: rgba(15,23,42,0.45);
          background: rgba(15,23,42,0.05); border: 1px solid rgba(15,23,42,0.08);
          padding: 0.2rem 0.55rem; border-radius: 4px;
        }
        .demo-cta {
          background: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          color: #fff; border: none; width: 100%; padding: 0.8rem;
          border-radius: 8px; font-weight: 700; font-size: 0.88rem;
          cursor: pointer; font-family: inherit; transition: opacity 0.2s; text-decoration: none;
          display: block; text-align: center; margin-bottom: 0.6rem;
        }
        .demo-cta:hover { opacity: 0.88; }
        .demo-cta-outline {
          background: none; border: 1.5px solid transparent;
          background-image: linear-gradient(#f1f5f9,#f1f5f9), linear-gradient(135deg,#EC4899,#2563EB,#60A5FA);
          background-origin: border-box; background-clip: padding-box, border-box;
          color: #0f172a; width: 100%; padding: 0.7rem;
          border-radius: 8px; font-weight: 700; font-size: 0.85rem;
          cursor: pointer; font-family: inherit; transition: opacity 0.2s; text-decoration: none;
          display: block; text-align: center;
        }
        .demo-cta-outline:hover { opacity: 0.8; }

        /* PROJET NAV */
        .demo-proj-nav {
          border-top: 1px solid rgba(15,23,42,0.08); padding: 1.2rem 1.5rem;
          flex-shrink: 0;
        }
        .demo-proj-nav-label { font-size: 0.68rem; color: rgba(15,23,42,0.35); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.8rem; }
        .demo-proj-nav-btns { display: flex; gap: 0.5rem; }
        .demo-proj-btn {
          flex: 1; background: #fff; border: 1px solid rgba(15,23,42,0.1);
          color: rgba(15,23,42,0.6); padding: 0.6rem; border-radius: 7px;
          cursor: pointer; font-family: inherit; font-size: 0.78rem; font-weight: 600;
          transition: all 0.2s; text-align: center;
        }
        .demo-proj-btn:hover { background: rgba(37,99,235,0.08); border-color: rgba(37,99,235,0.25); color: #2563EB; }

        @media (max-width: 768px) {
          .demo-sidebar { display: none; }
          .demo-views span { display: none; }
        }
      `}</style>

      {/* TOP BAR */}
      <div className="demo-topbar">
        <a href="/trust-aura/portfolio" className="demo-back">← Portfolio</a>
        <div className="demo-topbar-divider" />

        {/* URL bar */}
        <div className="demo-urlbar">
          <div className="demo-urlbar-dots">
            <div className="demo-dot" style={{ background: "#FF5F57" }} />
            <div className="demo-dot" style={{ background: "#FFBD2E" }} />
            <div className="demo-dot" style={{ background: "#28CA41" }} />
          </div>
          <div className="demo-urlbar-text">
            {project.demoUrl
              ? <><span>{project.demoUrl}</span></>
              : <>{project.title.toLowerCase().replace(/\s/g, "")}<span>.fr</span> · aperçu design</>
            }
          </div>
        </div>

        {/* View switcher */}
        <div className="demo-views">
          {([
            { key: "desktop", icon: "🖥", label: "Desktop" },
            { key: "tablet", icon: "📱", label: "Tablet" },
            { key: "mobile", icon: "📲", label: "Mobile" },
          ] as const).map((v) => (
            <button
              key={v.key}
              className={`demo-view-btn${view === v.key ? " active" : ""}`}
              onClick={() => setView(v.key)}
            >
              {v.icon} <span>{v.label}</span>
            </button>
          ))}
        </div>

        <div className="demo-topbar-divider" />

        {/* Prev / Next */}
        <div className="demo-nav-arrows">
          <button className="demo-arrow" onClick={() => goTo("prev")} title="Projet précédent">‹</button>
          <button className="demo-arrow" onClick={() => goTo("next")} title="Projet suivant">›</button>
        </div>

        <button
          className={`demo-info-toggle${infoOpen ? " active" : ""}`}
          onClick={() => setInfoOpen(!infoOpen)}
        >
          {infoOpen ? "Masquer infos" : "Infos projet"}
        </button>
      </div>

      {/* MAIN */}
      <div className="demo-main">

        {/* CANVAS */}
        <div className="demo-canvas">
          <div
            className="demo-frame-wrap"
            style={{ width: viewWidths[view], maxWidth: "100%", minHeight: view === "desktop" ? "100%" : "800px", height: view === "desktop" ? "100%" : "auto" }}
          >
            {/* Browser bar */}
            <div className="demo-frame-bar">
              <div className="demo-dot" style={{ background: "#FF5F57", opacity: 0.8 }} />
              <div className="demo-dot" style={{ background: "#FFBD2E", opacity: 0.8 }} />
              <div className="demo-dot" style={{ background: "#28CA41", opacity: 0.8 }} />
            </div>

            {project.demoUrl ? (
              <iframe
                src={project.demoUrl}
                className="demo-iframe"
                title={project.title}
                allow="fullscreen"
              />
            ) : (
              <div className="demo-image-preview">
                <img src={project.image} alt={project.title} />
                <div className="demo-image-overlay">
                  <div style={{ fontSize: "2rem" }}>🔗</div>
                  <p className="demo-add-url-label">
                    Ajoute l&apos;URL du site pour afficher la démo interactive
                  </p>
                  <div className="demo-add-url-badge">demoUrl: &quot;https://ton-site.fr&quot;</div>
                  <p style={{ color: "rgba(15,23,42,0.35)", fontSize: "0.72rem" }}>dans /data/trust-aura/projects.ts</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className={`demo-sidebar${infoOpen ? "" : " closed"}`}>
          <div className="demo-sidebar-inner">
            <div className="demo-sidebar-cat" style={{ color: project.accent }}>{project.category}</div>
            <h2>{project.title}</h2>
            <div className="demo-sidebar-client">{project.client}</div>
            <p className="demo-sidebar-desc">{project.desc}</p>
            <hr className="demo-sidebar-divider" />
            <div className="demo-sidebar-row">
              <span className="demo-sidebar-label">Résultat obtenu</span>
              <span className="demo-sidebar-val" style={{ color: project.accent }}>↑ {project.result}</span>
            </div>
            <div className="demo-sidebar-row">
              <span className="demo-sidebar-label">Stack technique</span>
              <span className="demo-sidebar-val">{project.stack}</span>
            </div>
            <div className="demo-sidebar-tags">
              {project.tags.map((t) => <span key={t} className="demo-tag">{t}</span>)}
            </div>
            <hr className="demo-sidebar-divider" />
            <a href="/trust-aura/travaillons-ensemble" className="demo-cta">Projet personnalisable ? →</a>
            <a href="/trust-aura/portfolio" className="demo-cta-outline">Voir tous les projets</a>
          </div>

          {/* Projet nav */}
          <div className="demo-proj-nav">
            <div className="demo-proj-nav-label">Naviguer entre les projets</div>
            <div className="demo-proj-nav-btns">
              <button className="demo-proj-btn" onClick={() => goTo("prev")}>‹ Précédent</button>
              <button className="demo-proj-btn" onClick={() => goTo("next")}>Suivant ›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
