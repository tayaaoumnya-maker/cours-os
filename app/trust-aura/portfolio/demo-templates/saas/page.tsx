export default function SaasDemo() {
  return (
    <div className="saas-root">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .saas-root { font-family: 'Inter', system-ui, sans-serif; background: #050812; color: #E2E8F0; }
        /* NAV */
        .saas-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%; height: 68px; position: sticky; top: 0; z-index: 10;
          background: rgba(5,8,18,0.85); backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(99,102,241,0.15);
        }
        .saas-logo { font-size: 1.2rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 0.5rem; }
        .saas-logo-icon { width: 28px; height: 28px; background: linear-gradient(135deg, #6366F1, #8B5CF6); border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
        .saas-nav-links { display: flex; gap: 2rem; list-style: none; }
        .saas-nav-links a { color: rgba(226,232,240,0.6); font-size: 0.88rem; text-decoration: none; transition: color 0.2s; }
        .saas-nav-links a:hover { color: #fff; }
        .saas-nav-right { display: flex; gap: 0.8rem; align-items: center; }
        .saas-nav-login { color: rgba(226,232,240,0.6); font-size: 0.85rem; background: none; border: none; cursor: pointer; font-family: inherit; }
        .saas-nav-cta { background: linear-gradient(135deg, #6366F1, #8B5CF6); color: #fff; border: none; padding: 0.55rem 1.2rem; border-radius: 7px; font-weight: 700; font-size: 0.85rem; cursor: pointer; font-family: inherit; }
        /* HERO */
        .saas-hero { text-align: center; padding: 100px 5% 60px; position: relative; overflow: hidden; }
        .saas-hero-glow { position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%); pointer-events: none; }
        .saas-hero-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25); color: #818CF8; font-size: 0.75rem; font-weight: 600; padding: 0.3rem 0.85rem; border-radius: 99px; margin-bottom: 1.8rem; letter-spacing: 0.04em; }
        .saas-hero h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 900; line-height: 1.08; letter-spacing: -0.03em; max-width: 820px; margin: 0 auto 1.5rem; }
        .saas-hero h1 span { background: linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .saas-hero p { color: rgba(226,232,240,0.55); font-size: 1.1rem; line-height: 1.75; max-width: 560px; margin: 0 auto 2.5rem; }
        .saas-hero-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .saas-btn { background: linear-gradient(135deg, #6366F1, #8B5CF6); color: #fff; border: none; padding: 0.85rem 2rem; border-radius: 8px; font-weight: 700; font-size: 0.92rem; cursor: pointer; font-family: inherit; }
        .saas-btn-out { background: transparent; color: #E2E8F0; border: 1px solid rgba(255,255,255,0.15); padding: 0.85rem 2rem; border-radius: 8px; font-weight: 600; font-size: 0.92rem; cursor: pointer; font-family: inherit; }
        .saas-hero-proof { display: flex; align-items: center; justify-content: center; gap: 0.8rem; margin-top: 2rem; color: rgba(226,232,240,0.35); font-size: 0.8rem; }
        /* DASHBOARD PREVIEW */
        .saas-preview { max-width: 1000px; margin: 0 auto 5rem; padding: 0 5%; }
        .saas-preview-browser { background: #0d1117; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; box-shadow: 0 30px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1); }
        .saas-preview-bar { height: 40px; background: #161b22; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; padding: 0 14px; gap: 6px; }
        .saas-preview-dot { width: 10px; height: 10px; border-radius: 50%; }
        .saas-preview-dash { display: grid; grid-template-columns: 180px 1fr; height: 380px; }
        .saas-preview-sidebar { background: #0d1117; border-right: 1px solid rgba(255,255,255,0.06); padding: 1rem; }
        .saas-preview-sidebar-item { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 0.7rem; border-radius: 6px; margin-bottom: 0.3rem; font-size: 0.78rem; color: rgba(226,232,240,0.4); }
        .saas-preview-sidebar-item.active { background: rgba(99,102,241,0.15); color: #818CF8; }
        .saas-preview-content { padding: 1.5rem; overflow: hidden; }
        .saas-preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; }
        .saas-preview-title { font-size: 0.9rem; font-weight: 700; }
        .saas-preview-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 0.8rem; margin-bottom: 1.2rem; }
        .saas-preview-stat { background: #161b22; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 0.9rem; }
        .saas-preview-stat-val { font-size: 1.1rem; font-weight: 800; margin-bottom: 0.2rem; }
        .saas-preview-stat-label { font-size: 0.65rem; color: rgba(226,232,240,0.35); }
        .saas-preview-chart { background: #161b22; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; height: 140px; display: flex; align-items: flex-end; padding: 1rem; gap: 8px; }
        .saas-chart-bar { border-radius: 4px 4px 0 0; flex: 1; }
        /* FEATURES */
        .saas-features { padding: 5rem 5%; max-width: 1200px; margin: 0 auto; }
        .saas-features-label { text-align: center; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #818CF8; margin-bottom: 0.8rem; }
        .saas-features h2 { text-align: center; font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 900; letter-spacing: -0.02em; margin-bottom: 3.5rem; }
        .saas-features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.2rem; }
        .saas-feature { background: #0d1117; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 1.8rem; transition: border-color 0.2s; }
        .saas-feature:hover { border-color: rgba(99,102,241,0.3); }
        .saas-feature-icon { width: 40px; height: 40px; background: rgba(99,102,241,0.12); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; margin-bottom: 1rem; }
        .saas-feature h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
        .saas-feature p { font-size: 0.84rem; color: rgba(226,232,240,0.45); line-height: 1.65; }
        /* PRICING */
        .saas-pricing { padding: 5rem 5%; max-width: 1000px; margin: 0 auto; text-align: center; }
        .saas-pricing h2 { font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 900; letter-spacing: -0.02em; margin-bottom: 3rem; }
        .saas-pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.2rem; text-align: left; }
        .saas-plan { background: #0d1117; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 2rem; }
        .saas-plan.featured { border-color: rgba(99,102,241,0.4); background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05)); }
        .saas-plan-name { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(226,232,240,0.4); margin-bottom: 0.8rem; }
        .saas-plan.featured .saas-plan-name { color: #818CF8; }
        .saas-plan-price { font-size: 2.2rem; font-weight: 900; margin-bottom: 0.3rem; }
        .saas-plan-period { font-size: 0.8rem; color: rgba(226,232,240,0.35); margin-bottom: 1.5rem; }
        .saas-plan-features { list-style: none; margin-bottom: 1.5rem; }
        .saas-plan-features li { font-size: 0.84rem; color: rgba(226,232,240,0.6); padding: 0.35rem 0; display: flex; align-items: center; gap: 0.5rem; }
        .saas-plan-features li::before { content: "✓"; color: #818CF8; font-weight: 700; }
        .saas-plan-btn { width: 100%; padding: 0.75rem; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer; font-family: inherit; border: 1px solid rgba(255,255,255,0.12); background: transparent; color: #E2E8F0; transition: all 0.2s; }
        .saas-plan.featured .saas-plan-btn { background: linear-gradient(135deg, #6366F1, #8B5CF6); border: none; color: #fff; }
        /* FOOTER */
        .saas-footer { border-top: 1px solid rgba(255,255,255,0.06); padding: 2.5rem 5%; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .saas-footer-logo { font-size: 1rem; font-weight: 800; color: #fff; }
        .saas-footer-copy { font-size: 0.75rem; color: rgba(226,232,240,0.2); }
        @media (max-width: 768px) {
          .saas-nav-links { display: none; }
          .saas-features-grid, .saas-pricing-grid { grid-template-columns: 1fr; }
          .saas-preview-dash { grid-template-columns: 1fr; }
          .saas-preview-sidebar { display: none; }
          .saas-preview-stats { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      <nav className="saas-nav">
        <div className="saas-logo">
          <div className="saas-logo-icon">⚡</div>
          FlowSaaS
        </div>
        <ul className="saas-nav-links">
          <li><a href="#">Fonctionnalités</a></li>
          <li><a href="#">Tarifs</a></li>
          <li><a href="#">Intégrations</a></li>
          <li><a href="#">Documentation</a></li>
        </ul>
        <div className="saas-nav-right">
          <button className="saas-nav-login">Connexion</button>
          <button className="saas-nav-cta">Essai gratuit →</button>
        </div>
      </nav>

      <section className="saas-hero">
        <div className="saas-hero-glow" />
        <div className="saas-hero-badge">🚀 Version 2.0 disponible</div>
        <h1>Gérez votre business<br /><span>sans friction</span></h1>
        <p>FlowSaaS centralise vos clients, automatise vos workflows et booste votre productivité. Simple, puissant, intuitif.</p>
        <div className="saas-hero-btns">
          <button className="saas-btn">Démarrer gratuitement</button>
          <button className="saas-btn-out">Voir la démo →</button>
        </div>
        <div className="saas-hero-proof">
          <span>⭐⭐⭐⭐⭐</span>
          <span>+2 500 équipes font confiance à FlowSaaS</span>
        </div>
      </section>

      <div className="saas-preview">
        <div className="saas-preview-browser">
          <div className="saas-preview-bar">
            <div className="saas-preview-dot" style={{ background: "#FF5F57" }} />
            <div className="saas-preview-dot" style={{ background: "#FFBD2E" }} />
            <div className="saas-preview-dot" style={{ background: "#28CA41" }} />
          </div>
          <div className="saas-preview-dash">
            <div className="saas-preview-sidebar">
              {[["📊", "Dashboard", true], ["👥", "Clients", false], ["📋", "Projets", false], ["💬", "Messages", false], ["⚙️", "Paramètres", false]].map(([icon, label, active]) => (
                <div key={String(label)} className={`saas-preview-sidebar-item${active ? " active" : ""}`}>
                  <span>{String(icon)}</span> <span>{String(label)}</span>
                </div>
              ))}
            </div>
            <div className="saas-preview-content">
              <div className="saas-preview-header">
                <div className="saas-preview-title">Dashboard</div>
                <div style={{ background: "rgba(99,102,241,0.2)", color: "#818CF8", fontSize: "0.7rem", padding: "0.25rem 0.7rem", borderRadius: "99px", fontWeight: 600 }}>Aujourd'hui</div>
              </div>
              <div className="saas-preview-stats">
                {[["€48.2k", "Revenus", "#6366F1"], ["1 240", "Clients", "#8B5CF6"], ["98%", "Uptime", "#34D399"], ["4.2s", "Rép. moy.", "#F59E0B"]].map(([v, l, c]) => (
                  <div key={String(l)} className="saas-preview-stat">
                    <div className="saas-preview-stat-val" style={{ color: String(c) }}>{String(v)}</div>
                    <div className="saas-preview-stat-label">{String(l)}</div>
                  </div>
                ))}
              </div>
              <div className="saas-preview-chart">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div key={i} className="saas-chart-bar" style={{ height: `${h}%`, background: i === 9 ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : "rgba(99,102,241,0.2)" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="saas-features">
        <div className="saas-features-label">✦ Fonctionnalités</div>
        <h2>Tout ce dont vous avez besoin</h2>
        <div className="saas-features-grid">
          {[
            { icon: "🔄", title: "Automatisation", desc: "Créez des workflows automatisés sans coder. Gagnez 10h par semaine." },
            { icon: "📊", title: "Analytics avancés", desc: "Tableaux de bord en temps réel avec insights actionnables pour vos décisions." },
            { icon: "🔗", title: "50+ Intégrations", desc: "Connectez vos outils préférés : Stripe, Slack, Notion, Hubspot et plus." },
            { icon: "🛡️", title: "Sécurité enterprise", desc: "Chiffrement AES-256, SSO, 2FA et conformité RGPD inclus." },
            { icon: "👥", title: "Collaboration", desc: "Travaillez en équipe en temps réel avec gestion des rôles et permissions." },
            { icon: "📱", title: "Mobile-first", desc: "App iOS & Android complète. Gérez votre business depuis n'importe où." },
          ].map((f) => (
            <div key={f.title} className="saas-feature">
              <div className="saas-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="saas-pricing">
        <div className="saas-features-label">✦ Tarifs</div>
        <h2>Simple et transparent</h2>
        <div className="saas-pricing-grid">
          {[
            { name: "Starter", price: "29€", period: "/mois", features: ["5 utilisateurs", "10 projets", "5 Go stockage", "Support email"], featured: false },
            { name: "Pro", price: "79€", period: "/mois", features: ["Utilisateurs illimités", "Projets illimités", "100 Go stockage", "Toutes intégrations", "Support prioritaire"], featured: true },
            { name: "Enterprise", price: "Sur devis", period: "", features: ["Tout Pro inclus", "SLA garanti", "Déploiement privé", "Account manager dédié"], featured: false },
          ].map((plan) => (
            <div key={plan.name} className={`saas-plan${plan.featured ? " featured" : ""}`}>
              <div className="saas-plan-name">{plan.name}</div>
              <div className="saas-plan-price">{plan.price}</div>
              <div className="saas-plan-period">{plan.period || "\u00a0"}</div>
              <ul className="saas-plan-features">
                {plan.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <button className="saas-plan-btn">{plan.featured ? "Commencer →" : "Choisir"}</button>
            </div>
          ))}
        </div>
      </section>

      <footer className="saas-footer">
        <div className="saas-footer-logo">⚡ FlowSaaS</div>
        <div className="saas-footer-copy">© 2024 FlowSaaS · Tous droits réservés</div>
      </footer>
    </div>
  )
}
