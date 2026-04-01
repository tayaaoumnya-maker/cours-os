"use client"

import TrustAuraFooter from "@/components/trust-aura/Footer"

// ─── Data ─────────────────────────────────────────────────────────────────────

const values = [
  {
    icon: "◈",
    title: "Résultats avant tout",
    desc: "Chaque décision est orientée performance. On ne s'intéresse pas aux vanity metrics — seulement aux chiffres qui font grandir ton business.",
  },
  {
    icon: "◉",
    title: "Transparence totale",
    desc: "Rapports clairs, communication directe. Tu sais toujours où va ton budget et ce qu'il génère. Zéro jargon, zéro bullshit.",
  },
  {
    icon: "◎",
    title: "Obsession client",
    desc: "Ton succès est le nôtre. On s'investit dans chaque projet comme si c'était notre propre business. Partenaires, pas prestataires.",
  },
  {
    icon: "◇",
    title: "Innovation continue",
    desc: "Les algos changent, les tendances évoluent. On reste toujours en avance pour que tes campagnes performent, maintenant et demain.",
  },
]

const team = [
  {
    name: "Rayan K.",
    role: "Fondateur & Stratège",
    bio: "Ex-growth manager chez une scale-up SaaS. 6 ans d'expérience sur Meta et Google Ads. A géré +2M€ de budget publicitaire.",
    initials: "RK",
    color: "#1e3a5f",
    accent: "#60A5FA",
  },
  {
    name: "Lina M.",
    role: "Directrice Créative",
    bio: "Ancienne motion designer en agence parisienne. Spécialiste du contenu qui convertit — de l'idée au Reel viral.",
    initials: "LM",
    color: "#2a1040",
    accent: "#A78BFA",
  },
  {
    name: "Adam S.",
    role: "Expert Google Ads",
    bio: "Certifié Google Partner. Maîtrise Search, Display, Shopping et YouTube Ads. Optimise chaque centime de CPC.",
    initials: "AS",
    color: "#0a2a1a",
    accent: "#34D399",
  },
  {
    name: "Sara B.",
    role: "Community Manager",
    bio: "Ancienne journaliste reconvertie au digital. Gère des communautés de 50k+ followers avec un taux d'engagement hors norme.",
    initials: "SB",
    color: "#2a1a0a",
    accent: "#F59E0B",
  },
]

const timeline = [
  { year: "2020", title: "La naissance", desc: "Trust Aura est fondée avec une vision simple : prouver que le marketing digital peut être honnête ET ultra-performant." },
  { year: "2021", title: "Premiers grands clients", desc: "On gère nos premières campagnes à 6 chiffres. Nos méthodes font leurs preuves avec un ROI moyen de 4,2×." },
  { year: "2022", title: "Expansion de l'équipe", desc: "On recrute les meilleurs talents — créatifs, stratèges, data analysts. L'agence passe de 2 à 8 personnes." },
  { year: "2023", title: "3M€ générés pour nos clients", desc: "Cap symbolique franchi. 50+ clients accompagnés, 98% de satisfaction. Trust Aura devient une référence." },
  { year: "2024", title: "Aujourd'hui", desc: "On continue de scaler avec les mêmes valeurs : résultats mesurables, transparence totale, obsession client." },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function AProposPage() {
  return (
    <div className="ap-root">
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
          --grad: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
        }
        * { box-sizing: border-box; }
        .ap-root {
          font-family: 'Inter', system-ui, sans-serif;
          background: #f1f5f9;
          color: var(--text);
          min-height: 100vh;
        }

        /* NAV */
        .ap-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%; height: 70px;
          background: rgba(241,245,249,0.92);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(15,23,42,0.08);
        }
        .ap-logo {
          font-size: 1.2rem; font-weight: 800; letter-spacing: -0.02em;
          color: var(--text); text-decoration: none;
        }
        .ap-logo span { color: var(--blue); }
        .ap-nav-links {
          display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0;
        }
        .ap-nav-links a {
          color: rgba(15,23,42,0.55); font-size: 0.9rem; text-decoration: none;
          transition: color 0.2s;
        }
        .ap-nav-links a:hover { color: var(--blue); }
        .ap-btn {
          background: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          color: #fff; border: none;
          padding: 0.55rem 1.3rem; border-radius: 6px; font-weight: 700;
          font-size: 0.85rem; cursor: pointer; text-decoration: none;
          transition: opacity 0.2s, transform 0.15s;
        }
        .ap-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        /* HERO */
        .ap-hero-banner {
          min-height: 420px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 120px 5% 60px;
          position: relative; overflow: hidden;
          background-image: url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=80');
          background-size: cover; background-position: center;
        }
        .ap-hero-banner::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(8,12,28,0.70); z-index: 0;
        }
        .ap-hero-banner::after {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 40%, rgba(236,72,153,0.25) 0%, transparent 65%);
          z-index: 0;
        }
        .ap-hero-banner > * { position: relative; z-index: 1; }
        .ap-hero-banner .ap-badge {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.4);
          color: #ffffff;
          font-size: 0.85rem;
          padding: 0.45rem 1.1rem;
        }
        .ap-hero-banner h1 {
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          font-weight: 900; line-height: 1.1; letter-spacing: -0.03em;
          margin: 0 0 1rem; color: #ffffff;
        }
        .ap-hero-banner p {
          font-size: 1.05rem; color: rgba(255,255,255,0.75);
          max-width: 540px; line-height: 1.75; margin: 0;
        }
        .ap-hero {
          padding: 60px 5% 80px;
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 4rem; align-items: center;
        }
        .ap-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: var(--blue-dim); border: 1px solid rgba(37,99,235,0.18);
          color: var(--blue); font-size: 0.75rem; font-weight: 600;
          padding: 0.3rem 0.85rem; border-radius: 99px; margin-bottom: 1.5rem;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .ap-hero h1 {
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          font-weight: 900; line-height: 1.1; letter-spacing: -0.03em;
          margin: 0 0 1.3rem; color: var(--text);
        }
        .ap-grad {
          background: var(--grad);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ap-hero p {
          font-size: 1.05rem; color: var(--text-muted);
          line-height: 1.75; margin: 0 0 2rem;
        }
        .ap-btn-outline {
          color: var(--text); padding: 0.65rem 1.5rem; border-radius: 7px;
          font-weight: 700; font-size: 0.9rem; cursor: pointer; font-family: inherit;
          transition: opacity 0.2s, transform 0.15s; text-decoration: none; display: inline-block;
          border: 1.5px solid transparent;
          background-image: linear-gradient(#f1f5f9, #f1f5f9),
            linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }
        .ap-btn-outline:hover { opacity: 0.8; transform: translateY(-1px); }

        /* HERO VISUAL */
        .ap-hero-visual {
          position: relative; height: 420px;
          display: flex; align-items: center; justify-content: center;
        }
        .ap-hero-glow {
          position: absolute; width: 360px; height: 360px; border-radius: 50%;
          background: radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(236,72,153,0.08) 50%, transparent 70%);
        }
        .ap-hero-card {
          background: #fff; border: 1px solid rgba(15,23,42,0.09);
          border-radius: 16px; padding: 2rem; width: 300px;
          position: relative; z-index: 1;
          box-shadow: 0 4px 24px rgba(15,23,42,0.08);
        }
        .ap-hero-card-stat {
          font-size: 2.8rem; font-weight: 900; margin-bottom: 0.2rem;
          background: var(--grad);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ap-hero-card-label {
          font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;
        }
        .ap-hero-card-divider {
          border: none; border-top: 1px solid rgba(15,23,42,0.08); margin: 1.2rem 0;
        }
        .ap-mini-stat { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.7rem; }
        .ap-mini-stat:last-child { margin-bottom: 0; }
        .ap-mini-val { font-weight: 800; font-size: 1.1rem; }
        .ap-mini-label { font-size: 0.78rem; color: rgba(15,23,42,0.4); }
        .ap-floating {
          position: absolute; background: #fff;
          border: 1px solid rgba(15,23,42,0.1); border-radius: 10px;
          padding: 0.7rem 1rem; font-size: 0.8rem; font-weight: 700;
          white-space: nowrap; box-shadow: 0 2px 12px rgba(15,23,42,0.08);
        }
        .ap-floating-1 { top: 40px; right: -20px; color: #34D399; }
        .ap-floating-2 { bottom: 60px; left: -30px; color: #F59E0B; }

        /* SECTION BASE */
        .ap-section {
          max-width: 1200px; margin: 0 auto;
          padding: 5rem 5%;
        }
        .ap-section-label {
          color: var(--blue); font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.7rem;
          display: block;
        }
        .ap-section h2 {
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 900; line-height: 1.15; letter-spacing: -0.025em;
          margin: 0 0 1rem; color: var(--text);
        }
        .ap-section-sub {
          color: var(--text-muted); font-size: 1rem; line-height: 1.7;
          max-width: 500px; margin-bottom: 3.5rem;
        }
        .ap-divider { border: none; border-top: 1px solid rgba(15,23,42,0.07); margin: 0; }

        /* VALUES */
        .ap-values-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1px; background: rgba(15,23,42,0.08);
          border: 1px solid rgba(15,23,42,0.08); border-radius: 14px; overflow: hidden;
        }
        .ap-value-card {
          background: #fff; padding: 2rem;
          transition: background 0.2s;
        }
        .ap-value-card:hover { background: #f8fafc; }
        .ap-value-icon {
          font-size: 1.5rem; margin-bottom: 1rem;
          background: var(--grad);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ap-value-card h3 { font-size: 1.05rem; font-weight: 800; margin: 0 0 0.6rem; color: var(--text); }
        .ap-value-card p { font-size: 0.85rem; color: var(--text-muted); line-height: 1.65; margin: 0; }

        /* TIMELINE */
        .ap-timeline { position: relative; padding-left: 2rem; }
        .ap-timeline::before {
          content: ''; position: absolute; left: 0; top: 6px; bottom: 6px;
          width: 1px; background: rgba(15,23,42,0.12);
        }
        .ap-tl-item {
          position: relative; padding: 0 0 2.5rem 2rem;
        }
        .ap-tl-item:last-child { padding-bottom: 0; }
        .ap-tl-dot {
          position: absolute; left: -6px; top: 6px;
          width: 13px; height: 13px; border-radius: 50%;
          background: var(--grad); border: 2px solid #f1f5f9;
        }
        .ap-tl-year {
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--blue); margin-bottom: 0.35rem;
        }
        .ap-tl-title { font-size: 1.05rem; font-weight: 800; margin-bottom: 0.4rem; color: var(--text); }
        .ap-tl-desc { font-size: 0.87rem; color: var(--text-muted); line-height: 1.65; }

        /* TEAM */
        .ap-team-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.2rem;
        }
        .ap-team-card {
          background: #fff; border: 1px solid rgba(15,23,42,0.09);
          border-radius: 14px; overflow: hidden;
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
        }
        .ap-team-card:hover {
          transform: translateY(-4px);
          border-color: var(--blue);
          box-shadow: 0 8px 28px rgba(37,99,235,0.10);
        }
        .ap-team-avatar {
          height: 140px; display: flex; align-items: center; justify-content: center;
          font-size: 2.5rem; font-weight: 900; letter-spacing: -0.02em;
          position: relative; overflow: hidden;
        }
        .ap-team-avatar-glow {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 60%, rgba(255,255,255,0.12) 0%, transparent 70%);
        }
        .ap-team-body { padding: 1.3rem; }
        .ap-team-name { font-size: 1rem; font-weight: 800; margin-bottom: 0.2rem; color: var(--text); }
        .ap-team-role { font-size: 0.75rem; font-weight: 600; margin-bottom: 0.85rem; }
        .ap-team-bio { font-size: 0.82rem; color: var(--text-muted); line-height: 1.6; }

        /* CTA BANNER */
        .ap-cta-banner {
          margin: 5rem 5%;
          max-width: 1200px; margin-left: auto; margin-right: auto;
          background: #fff;
          border: 1px solid rgba(15,23,42,0.09);
          border-radius: 16px; padding: 3.5rem;
          display: flex; align-items: center; justify-content: space-between;
          gap: 2rem; flex-wrap: wrap;
          position: relative; overflow: hidden;
        }
        .ap-cta-banner::before {
          content: '';
          position: absolute; top: -80px; right: -80px;
          width: 280px; height: 280px; border-radius: 50%;
          background: radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .ap-cta-banner::after {
          content: '';
          position: absolute; bottom: -60px; left: 30%;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .ap-cta-text h3 {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 900; letter-spacing: -0.02em; margin: 0 0 0.5rem; color: var(--text);
        }
        .ap-cta-text p {
          font-size: 0.95rem; color: var(--text-muted);
          max-width: 420px; line-height: 1.65; margin: 0;
        }
        .ap-cta-actions { display: flex; gap: 0.8rem; flex-wrap: wrap; flex-shrink: 0; }

        /* MANIFESTE */
        .ap-manifeste {
          max-width: 1200px; margin: 0 auto;
          padding: 6rem 5%;
          display: grid; grid-template-columns: 1fr 1.6fr;
          gap: 6rem; align-items: start;
        }
        .ap-manifeste-left { position: sticky; top: 90px; }
        .ap-manifeste-quote {
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 900; line-height: 1.25;
          letter-spacing: -0.025em; color: var(--text);
          margin-bottom: 1.5rem;
        }
        .ap-manifeste-quote em {
          font-style: normal;
          background: var(--grad);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ap-manifeste-author {
          display: flex; align-items: center; gap: 0.8rem;
          margin-top: 2rem;
        }
        .ap-manifeste-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, #1e3a5f, #2563EB);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.88rem; font-weight: 900; color: #60A5FA;
          flex-shrink: 0;
        }
        .ap-manifeste-author-name { font-size: 0.88rem; font-weight: 700; color: var(--text); }
        .ap-manifeste-author-role { font-size: 0.75rem; color: var(--text-muted); }
        .ap-manifeste-right {}
        .ap-manifeste-para {
          font-size: 1rem; color: var(--text-muted); line-height: 1.85;
          margin-bottom: 1.8rem;
        }
        .ap-manifeste-para strong { color: var(--text); font-weight: 700; }
        .ap-manifeste-para:last-of-type { margin-bottom: 0; }
        .ap-manifeste-highlight {
          border-left: 3px solid;
          border-image: linear-gradient(to bottom, #EC4899, #2563EB) 1;
          padding: 1.2rem 1.5rem;
          background: rgba(37,99,235,0.04);
          border-radius: 0 8px 8px 0;
          margin: 2rem 0;
        }
        .ap-manifeste-highlight p {
          font-size: 1.02rem; font-weight: 700; color: var(--text);
          line-height: 1.6; margin: 0; font-style: italic;
        }
        .ap-manifeste-pills {
          display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 2rem;
        }
        .ap-manifeste-pill {
          background: #fff; border: 1px solid rgba(37,99,235,0.2);
          border-radius: 99px; padding: 0.4rem 1rem;
          font-size: 0.78rem; font-weight: 600; color: var(--blue);
          display: flex; align-items: center; gap: 0.35rem;
        }
        @media (max-width: 768px) {
          .ap-manifeste { grid-template-columns: 1fr; gap: 3rem; }
          .ap-manifeste-left { position: static; }
        }

        /* FOOTER */
        .ap-footer {
          border-top: 1px solid rgba(15,23,42,0.08);
          padding: 2.5rem 5%; text-align: center;
          color: rgba(15,23,42,0.35); font-size: 0.8rem;
        }
        .ap-footer-logo { color: var(--text); font-weight: 800; font-size: 1rem; margin-bottom: 0.4rem; }
        .ap-footer-logo span { color: var(--blue); }

        /* MOBILE */
        @media (max-width: 768px) {
          .ap-nav-links { display: none; }
          .ap-hero { grid-template-columns: 1fr; gap: 3rem; padding-top: 120px; }
          .ap-hero-visual { height: 280px; }
          .ap-hero-card { width: 260px; }
          .ap-floating { display: none; }
          .ap-cta-banner { flex-direction: column; padding: 2rem; }
        }
      `}</style>

      {/* NAV */}
      <nav className="ap-nav">
        <a href="/trust-aura" className="ap-logo">Trust<span>Aura</span></a>
        <ul className="ap-nav-links">
          <li><a href="/trust-aura#services">Services</a></li>
          <li><a href="/trust-aura/a-propos" style={{ color: "var(--blue-light)", fontWeight: 700 }}>À propos</a></li>
          <li><a href="/trust-aura/portfolio">Portfolio</a></li>
          <li><a href="/trust-aura#resultats">Résultats</a></li>
          <li><a href="/trust-aura#contact">Contact</a></li>
        </ul>
        <a href="/trust-aura#contact" className="ap-btn">Audit gratuit →</a>
      </nav>

      {/* BANNER */}
      <div className="ap-hero-banner">
        <div className="ap-badge">✦ Notre histoire</div>
        <h1>On ne vend pas de la pub.<br /><span className="ap-grad">On vend des résultats.</span></h1>
        <p>Fondée en 2025 à Paris, Trust Aura accompagne les entrepreneurs ambitieux qui veulent faire de leur marketing un vrai levier de croissance.</p>
      </div>

      {/* HERO */}
      <div className="ap-hero">
        <div>
          <h1>
            On ne vend pas<br />de la pub.<br />
            <span className="ap-grad">On vend des résultats.</span>
          </h1>
          <p>
            Trust Aura est née d&apos;une frustration simple : trop d&apos;agences promettent la lune
            et livrent des rapports flatteurs. On a voulu faire différemment — transparence totale,
            stratégies chirurgicales, résultats prouvés.
          </p>
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            <a href="/trust-aura#contact" className="ap-btn">Travailler avec nous →</a>
            <a href="/trust-aura/portfolio" className="ap-btn-outline">Voir nos réalisations</a>
          </div>
        </div>

        <div className="ap-hero-visual">
          <div className="ap-hero-glow" />
          <div className="ap-hero-card">
            <div className="ap-hero-card-stat">50+</div>
            <div className="ap-hero-card-label">Clients accompagnés depuis 2020</div>
            <hr className="ap-hero-card-divider" />
            <div className="ap-mini-stat">
              <span className="ap-mini-label">CA généré</span>
              <span className="ap-mini-val" style={{ color: "#60A5FA" }}>3M€+</span>
            </div>
            <div className="ap-mini-stat">
              <span className="ap-mini-label">ROI moyen</span>
              <span className="ap-mini-val" style={{ color: "#34D399" }}>5×</span>
            </div>
            <div className="ap-mini-stat">
              <span className="ap-mini-label">Satisfaction</span>
              <span className="ap-mini-val" style={{ color: "#EC4899" }}>98%</span>
            </div>
          </div>
          <div className="ap-floating ap-floating-1">✓ Certifié Meta Partner</div>
          <div className="ap-floating ap-floating-2">★ Google Partner</div>
        </div>
      </div>

      <hr className="ap-divider" />

      {/* MANIFESTE */}
      <section className="ap-manifeste">
        <div className="ap-manifeste-left">
          <span className="ap-section-label">✦ Notre vision</span>
          <p className="ap-manifeste-quote">
            De la petite boutique<br />à la grande entreprise —<br />
            <em>une confiance durable.</em>
          </p>
          <div className="ap-manifeste-author">
            <div className="ap-manifeste-avatar">RK</div>
            <div>
              <div className="ap-manifeste-author-name">Rayan K.</div>
              <div className="ap-manifeste-author-role">Fondateur, Trust Aura</div>
            </div>
          </div>
        </div>

        <div className="ap-manifeste-right">
          <p className="ap-manifeste-para">
            Trust Aura, je l&apos;ai créée avec une idée simple mais profonde :
            <strong> le marketing digital ne devrait pas être réservé aux grandes entreprises.</strong>
            Une petite boutique, un artisan, un entrepreneur qui démarre — ils méritent
            exactement le même niveau d&apos;expertise, la même rigueur, le même engagement
            qu&apos;un grand groupe avec des millions de budget.
          </p>

          <div className="ap-manifeste-highlight">
            <p>
              &ldquo; Ma mission depuis le premier jour : accompagner chaque client
              là où il en est — et l&apos;emmener là où il veut aller. &rdquo;
            </p>
          </div>

          <p className="ap-manifeste-para">
            Ce qui m&apos;a motivé à construire cette agence, c&apos;est la conviction que
            <strong> la confiance se construit dans la durée, pas en un seul coup.</strong>
            On ne cherche pas à signer des contrats — on cherche à devenir le partenaire
            de croissance à qui vous pensez en premier quand vous avez une décision
            importante à prendre pour votre business.
          </p>

          <p className="ap-manifeste-para">
            Petite structure ou grande entreprise, chaque client reçoit une stratégie
            pensée pour lui, une communication honnête et des résultats qui parlent d&apos;eux-mêmes.
            <strong> C&apos;est cette confiance durable, bâtie client après client,
            qui est la vraie fierté de Trust Aura.</strong>
          </p>

          <div className="ap-manifeste-pills">
            {["✦ Petites & grandes entreprises", "◈ Confiance sur le long terme", "◉ Stratégies personnalisées", "◎ Résultats transparents", "◇ Certifiés Meta & Google"].map((pill) => (
              <span key={pill} className="ap-manifeste-pill">{pill}</span>
            ))}
          </div>
        </div>
      </section>

      <hr className="ap-divider" />

      {/* VALEURS */}
      <section className="ap-section">
        <span className="ap-section-label">✦ Ce qui nous définit</span>
        <h2>Nos <span className="ap-grad">valeurs</span> ne sont pas<br />des mots sur un mur</h2>
        <p className="ap-section-sub">
          Elles guident chaque décision, chaque stratégie, chaque relation client.
        </p>
        <div className="ap-values-grid">
          {values.map((v) => (
            <div key={v.title} className="ap-value-card">
              <div className="ap-value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="ap-divider" />

      {/* HISTOIRE */}
      <section className="ap-section" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
        <div>
          <span className="ap-section-label">✦ Notre parcours</span>
          <h2>De l&apos;idée à la <span className="ap-grad">référence</span></h2>
          <p className="ap-section-sub" style={{ marginBottom: 0 }}>
            En 4 ans, Trust Aura est passée de 2 cofondateurs à une équipe de 10 experts,
            avec une seule boussole : les résultats de nos clients.
          </p>
        </div>
        <div className="ap-timeline">
          {timeline.map((t) => (
            <div key={t.year} className="ap-tl-item">
              <div className="ap-tl-dot" />
              <div className="ap-tl-year">{t.year}</div>
              <div className="ap-tl-title">{t.title}</div>
              <div className="ap-tl-desc">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="ap-divider" />

      {/* ÉQUIPE */}
      <section className="ap-section">
        <span className="ap-section-label">✦ Les visages derrière les résultats</span>
        <h2>Une équipe de <span className="ap-grad">passionnés</span>,<br />pas de commerciaux</h2>
        <p className="ap-section-sub">
          Chaque membre de Trust Aura est expert dans son domaine et obsédé par la performance.
        </p>
        <div className="ap-team-grid">
          {team.map((m) => (
            <div key={m.name} className="ap-team-card">
              <div className="ap-team-avatar" style={{ background: m.color }}>
                <div className="ap-team-avatar-glow" />
                <span style={{ color: m.accent, position: "relative", zIndex: 1 }}>{m.initials}</span>
              </div>
              <div className="ap-team-body">
                <div className="ap-team-name">{m.name}</div>
                <div className="ap-team-role" style={{ color: m.accent }}>{m.role}</div>
                <div className="ap-team-bio">{m.bio}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="ap-cta-banner">
        <div className="ap-cta-text">
          <h3>
            Prêt à rejoindre nos{" "}
            <span className="ap-grad">clients qui scalent</span> ?
          </h3>
          <p>
            Réservez votre audit gratuit. 30 minutes pour analyser votre situation
            et vous proposer une stratégie concrète, sans engagement.
          </p>
        </div>
        <div className="ap-cta-actions">
          <a href="/trust-aura#contact" className="ap-btn" style={{ padding: "0.75rem 1.8rem", fontSize: "0.95rem" }}>
            Obtenir mon audit gratuit →
          </a>
          <a href="/trust-aura/portfolio" className="ap-btn-outline">
            Voir le portfolio
          </a>
        </div>
      </div>

      <TrustAuraFooter />
    </div>
  )
}
