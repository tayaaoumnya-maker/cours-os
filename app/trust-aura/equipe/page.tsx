import TrustAuraFooter from "@/components/trust-aura/Footer"

const team = [
  {
    name: "Rayan K.",
    role: "Fondateur & Stratège",
    bio: "Ex-growth manager chez une scale-up SaaS. 6 ans d'expérience sur Meta et Google Ads. A géré plus de 2M€ de budget publicitaire avec un ROI moyen de 5×.",
    initials: "RK",
    color: "#1e3a5f",
    accent: "#60A5FA",
    skills: ["Stratégie digitale", "Meta Ads", "Google Ads", "Growth Hacking"],
  },
  {
    name: "Lina M.",
    role: "Directrice Créative",
    bio: "Ancienne motion designer en agence parisienne. Spécialiste du contenu qui convertit — de l'idée au Reel viral. Elle transforme chaque brief en campagne mémorable.",
    initials: "LM",
    color: "#2a1040",
    accent: "#A78BFA",
    skills: ["Direction artistique", "Motion Design", "Copywriting", "UGC"],
  },
  {
    name: "Adam S.",
    role: "Expert Google Ads",
    bio: "Certifié Google Partner. Maîtrise Search, Display, Shopping et YouTube Ads. Son obsession : optimiser chaque centime de CPC pour maximiser votre rentabilité.",
    initials: "AS",
    color: "#0a2a1a",
    accent: "#34D399",
    skills: ["Search Ads", "Shopping", "YouTube Ads", "Display"],
  },
  {
    name: "Sara B.",
    role: "Community Manager",
    bio: "Ancienne journaliste reconvertie au digital. Gère des communautés de 50k+ followers avec un taux d'engagement hors norme. Elle donne une vraie voix à votre marque.",
    initials: "SB",
    color: "#2a1a0a",
    accent: "#F59E0B",
    skills: ["Community Management", "Stratégie éditoriale", "Instagram", "TikTok"],
  },
  {
    name: "Karim D.",
    role: "Data Analyst & Media Buyer",
    bio: "Ancien consultant en data chez une grande enseigne retail. Transforme les chiffres en décisions stratégiques. Chaque campagne est pilotée à la donnée.",
    initials: "KD",
    color: "#1a0a2a",
    accent: "#EC4899",
    skills: ["Media Buying", "Data Analytics", "A/B Testing", "Reporting"],
  },
  {
    name: "Nadia R.",
    role: "Responsable Clientèle",
    bio: "6 ans en gestion de comptes grands clients. Votre interlocutrice au quotidien — réactive, à l'écoute, disponible. Elle s'assure que chaque engagement est tenu.",
    initials: "NR",
    color: "#0a1a2a",
    accent: "#38BDF8",
    skills: ["Gestion de compte", "Suivi ROI", "Reporting client", "Stratégie"],
  },
]

const values = [
  { icon: "◈", label: "Expertise certifiée", desc: "Meta Partner & Google Partner — nos certifications sont la preuve de notre niveau d'exigence." },
  { icon: "◉", label: "Équipe soudée", desc: "On travaille ensemble depuis des années. Cette cohésion se ressent dans la qualité de chaque livrable." },
  { icon: "◎", label: "Passion du résultat", desc: "On ne compte pas nos heures quand il s'agit de faire performer une campagne. C'est notre nature." },
]

export default function EquipePage() {
  return (
    <div className="eq-root">
      <style>{`
        :root {
          --blue: #2563EB;
          --blue-light: #60A5FA;
          --blue-dim: rgba(37,99,235,0.08);
          --surface: #ffffff;
          --border: rgba(15,23,42,0.09);
          --text: #0f172a;
          --text-muted: rgba(15,23,42,0.55);
          --grad: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .eq-root {
          font-family: 'Inter', system-ui, sans-serif;
          background: #f1f5f9;
          color: var(--text);
          min-height: 100vh;
        }

        /* NAV */
        .eq-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%; height: 70px;
          background: rgba(241,245,249,0.92);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(15,23,42,0.08);
        }
        .eq-logo {
          font-size: 1.2rem; font-weight: 800; letter-spacing: -0.02em;
          color: var(--text); text-decoration: none;
        }
        .eq-logo span { color: var(--blue); }
        .eq-nav-links {
          display: flex; gap: 2rem; list-style: none;
        }
        .eq-nav-links a {
          color: var(--text-muted); font-size: 0.9rem;
          text-decoration: none; transition: color 0.2s;
        }
        .eq-nav-links a:hover { color: var(--blue); }
        .eq-nav-links a.active { color: var(--blue); font-weight: 600; }
        .eq-btn {
          background: var(--grad);
          color: #fff; border: none;
          padding: 0.55rem 1.3rem; border-radius: 6px; font-weight: 700;
          font-size: 0.85rem; cursor: pointer; text-decoration: none;
          transition: opacity 0.2s, transform 0.15s;
        }
        .eq-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        @media (max-width: 768px) { .eq-nav-links { display: none; } }

        /* HERO */
        .eq-hero {
          min-height: 420px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 140px 5% 70px; text-align: center;
          position: relative; overflow: hidden;
          background-image: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1800&q=80');
          background-size: cover; background-position: center top;
        }
        .eq-hero::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(8,12,28,0.68); z-index: 0;
        }
        .eq-hero::after {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 40%, rgba(37,99,235,0.28) 0%, transparent 65%);
          z-index: 0;
        }
        .eq-hero > * { position: relative; z-index: 1; }
        .eq-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: rgba(37,99,235,0.2); border: 1px solid rgba(96,165,250,0.35);
          color: #93C5FD; font-size: 0.75rem; font-weight: 600;
          padding: 0.3rem 0.85rem; border-radius: 99px; margin-bottom: 1.5rem;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .eq-hero h1 {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900; line-height: 1.1; letter-spacing: -0.03em;
          margin-bottom: 1.2rem; color: #ffffff;
        }
        .eq-grad {
          background: var(--grad);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .eq-hero p {
          font-size: 1.05rem; color: rgba(255,255,255,0.75);
          max-width: 520px; margin: 0 auto; line-height: 1.75;
        }

        /* VALEURS ÉQUIPE */
        .eq-values {
          max-width: 1200px; margin: 0 auto;
          padding: 0 5% 4rem;
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .eq-value-card {
          background: #fff; padding: 1.8rem;
          border: 1px solid var(--border); border-radius: 12px;
          display: flex; gap: 1rem; align-items: flex-start;
        }
        .eq-value-icon {
          font-size: 1.3rem;
          background: var(--grad);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; flex-shrink: 0; margin-top: 2px;
        }
        .eq-value-label { font-size: 0.95rem; font-weight: 800; margin-bottom: 0.35rem; }
        .eq-value-desc { font-size: 0.82rem; color: var(--text-muted); line-height: 1.6; }
        @media (max-width: 768px) { .eq-values { grid-template-columns: 1fr; } }

        /* DIVIDER */
        .eq-divider { border: none; border-top: 1px solid rgba(15,23,42,0.07); }

        /* TEAM GRID */
        .eq-section {
          max-width: 1200px; margin: 0 auto;
          padding: 5rem 5%;
        }
        .eq-section-label {
          color: var(--blue); font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.6rem;
          display: block;
        }
        .eq-section h2 {
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 900; line-height: 1.15; letter-spacing: -0.025em;
          margin-bottom: 0.8rem;
        }
        .eq-section-sub {
          color: var(--text-muted); font-size: 1rem; line-height: 1.7;
          max-width: 500px; margin-bottom: 3rem;
        }
        .eq-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .eq-card {
          background: #fff; border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden;
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
        }
        .eq-card:hover {
          transform: translateY(-5px);
          border-color: var(--blue);
          box-shadow: 0 10px 32px rgba(37,99,235,0.12);
        }
        .eq-avatar {
          height: 160px; display: flex; align-items: center; justify-content: center;
          font-size: 2.8rem; font-weight: 900; letter-spacing: -0.02em;
          position: relative; overflow: hidden;
        }
        .eq-avatar-glow {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 60%, rgba(255,255,255,0.14) 0%, transparent 65%);
        }
        .eq-avatar span { position: relative; z-index: 1; }
        .eq-card-body { padding: 1.5rem; }
        .eq-card-name { font-size: 1.05rem; font-weight: 800; margin-bottom: 0.2rem; }
        .eq-card-role { font-size: 0.75rem; font-weight: 700; margin-bottom: 0.9rem; letter-spacing: 0.02em; }
        .eq-card-bio { font-size: 0.82rem; color: var(--text-muted); line-height: 1.65; margin-bottom: 1.2rem; }
        .eq-card-skills { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .eq-skill {
          background: var(--blue-dim); color: var(--blue);
          font-size: 0.68rem; font-weight: 600;
          padding: 0.25rem 0.6rem; border-radius: 4px;
          letter-spacing: 0.03em;
        }
        @media (max-width: 900px) { .eq-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .eq-grid { grid-template-columns: 1fr; } }

        /* CTA */
        .eq-cta {
          max-width: 1200px; margin: 0 auto 5rem;
          padding: 0 5%;
        }
        .eq-cta-inner {
          background: #fff; border: 1px solid var(--border);
          border-radius: 16px; padding: 3rem 3.5rem;
          display: flex; align-items: center; justify-content: space-between;
          gap: 2rem; flex-wrap: wrap;
          position: relative; overflow: hidden;
        }
        .eq-cta-inner::before {
          content: '';
          position: absolute; top: -80px; right: -60px;
          width: 260px; height: 260px; border-radius: 50%;
          background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .eq-cta-inner::after {
          content: '';
          position: absolute; bottom: -60px; left: 25%;
          width: 180px; height: 180px; border-radius: 50%;
          background: radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .eq-cta-text h3 {
          font-size: clamp(1.3rem, 2.5vw, 1.9rem);
          font-weight: 900; letter-spacing: -0.02em; margin-bottom: 0.5rem;
        }
        .eq-cta-text p {
          font-size: 0.92rem; color: var(--text-muted); max-width: 400px; line-height: 1.6;
        }
        .eq-cta-actions { display: flex; gap: 0.8rem; flex-wrap: wrap; flex-shrink: 0; }
        .eq-btn-outline {
          color: var(--text); padding: 0.65rem 1.4rem; border-radius: 7px;
          font-weight: 700; font-size: 0.88rem; cursor: pointer; font-family: inherit;
          text-decoration: none; display: inline-block;
          border: 1.5px solid transparent;
          background-image: linear-gradient(#f1f5f9, #f1f5f9),
            linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          transition: opacity 0.2s, transform 0.15s;
        }
        .eq-btn-outline:hover { opacity: 0.8; transform: translateY(-1px); }
      `}</style>

      {/* NAV */}
      <nav className="eq-nav">
        <a href="/trust-aura" className="eq-logo">Trust<span>Aura</span></a>
        <ul className="eq-nav-links">
          <li><a href="/trust-aura#services">Services</a></li>
          <li><a href="/trust-aura/a-propos">À propos</a></li>
          <li><a href="/trust-aura/portfolio">Portfolio</a></li>
          <li><a href="/trust-aura/equipe" className="active">Notre équipe</a></li>
          <li><a href="/trust-aura#contact">Contact</a></li>
        </ul>
        <a href="/trust-aura#contact" className="eq-btn">Audit gratuit →</a>
      </nav>

      {/* HERO */}
      <div className="eq-hero">
        <div className="eq-badge">✦ L&apos;équipe</div>
        <h1>
          Des experts passionnés<br />
          <span className="eq-grad">à votre service</span>
        </h1>
        <p>
          Derrière chaque campagne qui performe, il y a une équipe qui s&apos;investit à 100%.
          Voici les personnes qui travaillent chaque jour pour faire grandir votre business.
        </p>
      </div>

      {/* VALEURS */}
      <div className="eq-values">
        {values.map((v) => (
          <div key={v.label} className="eq-value-card">
            <span className="eq-value-icon">{v.icon}</span>
            <div>
              <div className="eq-value-label">{v.label}</div>
              <div className="eq-value-desc">{v.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <hr className="eq-divider" />

      {/* TEAM */}
      <section className="eq-section">
        <span className="eq-section-label">✦ L&apos;équipe complète</span>
        <h2>Ceux qui font <span className="eq-grad">la différence</span></h2>
        <p className="eq-section-sub">
          6 experts, une seule mission : transformer votre investissement publicitaire
          en croissance mesurable et durable.
        </p>
        <div className="eq-grid">
          {team.map((m) => (
            <div key={m.name} className="eq-card">
              <div className="eq-avatar" style={{ background: m.color }}>
                <div className="eq-avatar-glow" />
                <span style={{ color: m.accent }}>{m.initials}</span>
              </div>
              <div className="eq-card-body">
                <div className="eq-card-name">{m.name}</div>
                <div className="eq-card-role" style={{ color: m.accent }}>{m.role}</div>
                <div className="eq-card-bio">{m.bio}</div>
                <div className="eq-card-skills">
                  {m.skills.map((s) => (
                    <span key={s} className="eq-skill">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="eq-cta">
        <div className="eq-cta-inner">
          <div className="eq-cta-text">
            <h3>
              Prêt à travailler avec{" "}
              <span className="eq-grad">notre équipe</span> ?
            </h3>
            <p>
              Réservez un audit gratuit de 30 min. On analyse votre situation
              et on vous propose une stratégie concrète, sans engagement.
            </p>
          </div>
          <div className="eq-cta-actions">
            <a href="/trust-aura#contact" className="eq-btn" style={{ padding: "0.75rem 1.8rem", fontSize: "0.92rem" }}>
              Obtenir mon audit gratuit →
            </a>
            <a href="/trust-aura/portfolio" className="eq-btn-outline">
              Voir le portfolio
            </a>
          </div>
        </div>
      </div>

      <TrustAuraFooter />
    </div>
  )
}
