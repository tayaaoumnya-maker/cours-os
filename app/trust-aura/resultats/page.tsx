"use client"

import TrustAuraFooter from "@/components/trust-aura/Footer"

const stats = [
  { value: "50+", label: "Clients accompagnés" },
  { value: "3M€+", label: "CA généré pour nos clients" },
  { value: "98%", label: "Taux de satisfaction" },
  { value: "5×", label: "ROI moyen constaté" },
]

const caseStudies = [
  {
    client: "KBFitness",
    sector: "Fitness & Coaching",
    service: "Meta Ads",
    duration: "3 mois",
    before: "12 leads/mois",
    after: "86 leads/mois",
    result: "+620%",
    resultLabel: "de leads",
    color: "#EC4899",
    testimonial: "En 3 mois, Trust Aura a multiplié mes leads par 6. Leur approche est chirurgicale — chaque euro investi est optimisé.",
    name: "Karim B.",
    role: "Fondateur, KBFitness",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face&q=80",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=220&fit=crop&q=80",
    actions: ["Refonte des audiences", "Création de 12 créatives", "A/B testing continu", "Optimisation hebdomadaire"],
  },
  {
    client: "MaisonSofia",
    sector: "Décoration & Maison",
    service: "Meta Ads + Contenu",
    duration: "6 mois",
    before: "45 000€/mois CA",
    after: "135 000€/mois CA",
    result: "+200%",
    resultLabel: "de chiffre d'affaires",
    color: "#2563EB",
    testimonial: "J'étais sceptique au départ. Aujourd'hui mon chiffre d'affaires a doublé grâce à leurs campagnes Meta.",
    name: "Sofia M.",
    role: "Directrice, MaisonSofia",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face&q=80",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=220&fit=crop&q=80",
    actions: ["Stratégie contenu Instagram", "Campagnes catalogue Shopify", "Retargeting dynamique", "Email automation"],
  },
  {
    client: "TechFlow SaaS",
    sector: "SaaS B2B",
    service: "Google Ads",
    duration: "4 mois",
    before: "0 clients",
    after: "150 clients",
    result: "0 → 150",
    resultLabel: "clients en 4 mois",
    color: "#60A5FA",
    testimonial: "La meilleure décision business de l'année. Leur stratégie Google Ads nous a permis de passer de 0 à 150 clients.",
    name: "Alexandre T.",
    role: "CEO, TechFlow SaaS",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face&q=80",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=220&fit=crop&q=80",
    actions: ["Search Ads sur mots-clés intention forte", "Landing pages optimisées", "Remarketing Display", "Suivi conversions précis"],
  },
  {
    client: "Chez Nadia",
    sector: "Restauration",
    service: "Réseaux Sociaux",
    duration: "4 mois",
    before: "800 abonnés Instagram",
    after: "12 400 abonnés",
    result: "+1450%",
    resultLabel: "d'abonnés Instagram",
    color: "#EC4899",
    testimonial: "Nos réservations sont complètes 3 semaines à l'avance. Le community management de Trust Aura a transformé notre présence en ligne.",
    name: "Nadia K.",
    role: "Gérante, Chez Nadia",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face&q=80",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=220&fit=crop&q=80",
    actions: ["Stratégie contenu hebdomadaire", "Reels viraux", "Partenariats micro-influenceurs", "Gestion des avis Google"],
  },
  {
    client: "LuxImmo Paris",
    sector: "Immobilier",
    service: "Google Ads + Meta Ads",
    duration: "5 mois",
    before: "3 mandats/mois",
    after: "19 mandats/mois",
    result: "+533%",
    resultLabel: "de mandats signés",
    color: "#2563EB",
    testimonial: "Trust Aura comprend notre marché. Leurs campagnes ciblées nous apportent des vendeurs qualifiés chaque semaine.",
    name: "Marc D.",
    role: "Directeur, LuxImmo Paris",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&q=80",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=220&fit=crop&q=80",
    actions: ["Ciblage géographique hyper-local", "Annonces Search intentions vendeurs", "Retargeting 30 jours", "Formulaires leads optimisés"],
  },
  {
    client: "GlowStudio",
    sector: "Salon de Beauté",
    service: "Meta Ads + Contenu",
    duration: "2 mois",
    before: "20 RDV/semaine",
    after: "58 RDV/semaine",
    result: "+190%",
    resultLabel: "de rendez-vous",
    color: "#60A5FA",
    testimonial: "En 2 mois notre agenda est plein. Le ROI est incroyable — pour 800€ investis on génère plus de 8 000€ de CA.",
    name: "Léa F.",
    role: "Fondatrice, GlowStudio",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&q=80",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=220&fit=crop&q=80",
    actions: ["Campagnes offre découverte", "Contenu avant/après", "Ciblage femmes 25-45 local", "Système de réservation en ligne"],
  },
]

const testimonials = [
  { name: "Karim B.", role: "KBFitness", text: "En 3 mois, Trust Aura a multiplié mes leads par 6.", result: "+620% leads", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face&q=80" },
  { name: "Sofia M.", role: "MaisonSofia", text: "Mon chiffre d'affaires a doublé grâce à leurs campagnes Meta.", result: "+200% CA", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face&q=80" },
  { name: "Alexandre T.", role: "TechFlow SaaS", text: "De 0 à 150 clients en 4 mois. Résultats incroyables.", result: "0 → 150 clients", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face&q=80" },
  { name: "Nadia K.", role: "Chez Nadia", text: "Nos réservations sont complètes 3 semaines à l'avance.", result: "+1450% abonnés", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face&q=80" },
  { name: "Marc D.", role: "LuxImmo Paris", text: "Des mandats qualifiés chaque semaine. Service exceptionnel.", result: "+533% mandats", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&q=80" },
  { name: "Léa F.", role: "GlowStudio", text: "Pour 800€ investis, on génère plus de 8 000€ de CA.", result: "ROI x10", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&q=80" },
]

export default function ResultatsPage() {
  return (
    <div className="ta-root">
      <style>{`
        :root {
          --blue: #2563EB;
          --blue-light: #60A5FA;
          --blue-dim: rgba(37,99,235,0.08);
          --border: rgba(37,99,235,0.15);
          --text: #0f172a;
          --text-muted: rgba(15,23,42,0.55);
        }
        .ta-root {
          font-family: 'Inter', system-ui, sans-serif;
          background: #f1f5f9;
          color: var(--text);
          min-height: 100vh;
        }
        .ta-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%; height: 70px;
          background: rgba(241,245,249,0.92);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(15,23,42,0.08);
        }
        .ta-logo {
          font-size: 1.35rem; font-weight: 800; letter-spacing: -0.02em;
          color: var(--text); text-decoration: none;
        }
        .ta-logo span { color: var(--blue); }
        .ta-nav-links {
          display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0;
        }
        .ta-nav-links a {
          color: rgba(15,23,42,0.55); font-size: 0.9rem; text-decoration: none;
          transition: color 0.2s;
        }
        .ta-nav-links a:hover { color: var(--blue); }
        .ta-btn-primary {
          background: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          color: #fff; border: none;
          padding: 0.55rem 1.4rem; border-radius: 6px; font-weight: 700;
          font-size: 0.88rem; cursor: pointer; transition: opacity 0.2s, transform 0.15s;
          text-decoration: none; display: inline-block;
        }
        .ta-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .ta-gold-text {
          background: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ta-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: var(--blue-dim); border: 1px solid var(--border);
          color: var(--blue); font-size: 0.78rem; font-weight: 600;
          padding: 0.35rem 0.9rem; border-radius: 99px; margin-bottom: 1.5rem;
          letter-spacing: 0.04em; text-transform: uppercase;
        }
        /* PAGE HEADER */
        .ta-page-header {
          padding: 140px 5% 60px;
          text-align: center;
          background: #f1f5f9;
          position: relative; overflow: hidden;
        }
        .ta-page-header-bg {
          position: absolute; inset: 0; z-index: 0;
          background-image: url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80');
          background-size: cover; background-position: center;
          opacity: 0.06;
        }
        .ta-page-header::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 30%, rgba(37,99,235,0.07) 0%, transparent 65%);
          pointer-events: none; z-index: 1;
        }
        .ta-page-header > * { position: relative; z-index: 2; }
        .ta-page-header h1 {
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 900; line-height: 1.1; letter-spacing: -0.03em;
          margin: 0 0 1rem; color: var(--text);
        }
        .ta-page-header p {
          font-size: 1.1rem; color: var(--text-muted);
          max-width: 540px; margin: 0 auto; line-height: 1.7;
        }
        /* STATS */
        .ta-stats-bar {
          display: flex; justify-content: center; flex-wrap: wrap;
          gap: 0; max-width: 860px; margin: 4rem auto 0;
          border: 1px solid var(--border); border-radius: 14px;
          background: #fff; overflow: hidden;
        }
        .ta-stat {
          flex: 1; min-width: 140px; padding: 2rem 1rem; text-align: center;
          border-right: 1px solid var(--border);
        }
        .ta-stat:last-child { border-right: none; }
        .ta-stat-value {
          font-size: 2.4rem; font-weight: 900;
          background: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ta-stat-label { font-size: 0.78rem; color: var(--text-muted); margin-top: 0.3rem; }
        /* SECTION */
        .ta-section { max-width: 1200px; margin: 0 auto; padding: 5rem 5%; }
        .ta-section-label {
          color: var(--blue); font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem;
          display: block;
        }
        .ta-section h2 {
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 900; line-height: 1.15; letter-spacing: -0.025em;
          margin: 0 0 0.8rem; color: var(--text);
        }
        .ta-section-sub {
          color: var(--text-muted); font-size: 1rem; line-height: 1.7;
          max-width: 520px; margin-bottom: 3rem;
        }
        /* CASE STUDIES */
        .ta-cases-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;
        }
        .ta-case-card {
          background: #fff; border: 1px solid rgba(15,23,42,0.09);
          border-radius: 14px; padding: 2rem; overflow: hidden;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .ta-case-card:hover {
          box-shadow: 0 8px 32px rgba(37,99,235,0.10);
          border-color: var(--blue);
        }
        .ta-case-top {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        .ta-case-meta { display: flex; flex-direction: column; gap: 0.3rem; }
        .ta-case-client {
          font-size: 1.1rem; font-weight: 800; color: var(--text);
        }
        .ta-case-sector {
          font-size: 0.78rem; color: var(--text-muted);
        }
        .ta-case-tag {
          font-size: 0.72rem; font-weight: 700; padding: 0.25rem 0.7rem;
          border-radius: 4px; background: var(--blue-dim); color: var(--blue);
          white-space: nowrap;
        }
        .ta-case-numbers {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .ta-case-num-block {
          background: #f8fafc; border-radius: 10px; padding: 1rem;
        }
        .ta-case-num-label {
          font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 0.3rem;
        }
        .ta-case-num-val {
          font-size: 0.95rem; font-weight: 700; color: var(--text);
        }
        .ta-case-result {
          font-size: 2.2rem; font-weight: 900; line-height: 1;
        }
        .ta-case-result-label {
          font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;
        }
        .ta-case-divider { border: none; border-top: 1px solid rgba(15,23,42,0.07); margin: 1.2rem 0; }
        .ta-case-quote {
          font-size: 0.85rem; color: var(--text-muted); line-height: 1.6;
          font-style: italic; margin-bottom: 1rem;
        }
        .ta-case-author { font-size: 0.82rem; font-weight: 700; color: var(--text); }
        .ta-case-role { font-size: 0.75rem; color: var(--text-muted); }
        .ta-case-img {
          width: 100%; height: 180px; object-fit: cover;
          border-radius: 10px; margin-bottom: 1.5rem;
          display: block;
        }
        .ta-case-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          object-fit: cover; border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          flex-shrink: 0;
        }
        .ta-case-author-row {
          display: flex; align-items: center; gap: 0.75rem;
        }
        .ta-case-actions { list-style: none; margin: 1.2rem 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .ta-case-actions li {
          font-size: 0.72rem; background: #f1f5f9;
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 4px; padding: 0.2rem 0.6rem; color: var(--text-muted);
        }
        /* TESTIMONIALS */
        .ta-testi-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem;
        }
        .ta-testi-card {
          background: #fff; border: 1px solid rgba(15,23,42,0.09);
          border-radius: 10px; padding: 1.6rem; position: relative; overflow: hidden;
        }
        .ta-testi-card::before {
          content: '"';
          position: absolute; top: -0.5rem; right: 1.2rem;
          font-size: 5rem; color: rgba(37,99,235,0.06); font-family: Georgia, serif;
          line-height: 1; pointer-events: none;
        }
        .ta-testi-result {
          display: inline-block; background: var(--blue-dim);
          color: var(--blue); font-size: 0.72rem; font-weight: 700;
          padding: 0.2rem 0.6rem; border-radius: 4px; margin-bottom: 0.8rem;
        }
        .ta-testi-text {
          font-size: 0.87rem; color: rgba(15,23,42,0.65);
          line-height: 1.65; margin-bottom: 1.2rem;
        }
        .ta-testi-author-row { display: flex; align-items: center; gap: 0.7rem; }
        .ta-testi-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          object-fit: cover; flex-shrink: 0;
        }
        .ta-testi-author { font-weight: 700; font-size: 0.9rem; color: var(--text); }
        .ta-testi-role { font-size: 0.75rem; color: var(--text-muted); }
        /* CTA BANNER */
        .ta-cta-banner { max-width: 1200px; margin: 0 auto 5rem; padding: 0 5%; }
        .ta-cta-inner {
          background: linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(37,99,235,0.08) 100%);
          border: 1px solid var(--border);
          border-radius: 16px; padding: 3rem; text-align: center;
        }
        .ta-cta-inner h2 {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 900; margin: 0 0 0.8rem; color: var(--text); letter-spacing: -0.02em;
        }
        .ta-cta-inner p { color: var(--text-muted); margin: 0 0 2rem; font-size: 0.95rem; }
        .ta-divider { border: none; border-top: 1px solid rgba(15,23,42,0.07); margin: 0; }
        @media (max-width: 900px) {
          .ta-cases-grid { grid-template-columns: 1fr; }
          .ta-testi-grid { grid-template-columns: 1fr; }
          .ta-nav-links { display: none; }
          .ta-stat { border-right: none; border-bottom: 1px solid var(--border); }
          .ta-stat:last-child { border-bottom: none; }
          .ta-stats-bar { flex-direction: column; }
        }
        @media (max-width: 600px) {
          .ta-testi-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAV */}
      <nav className="ta-nav">
        <a href="/trust-aura" className="ta-logo">Trust<span>Aura</span></a>
        <ul className="ta-nav-links">
          <li><a href="/trust-aura">Accueil</a></li>
          <li><a href="/trust-aura/services">Services</a></li>
          <li><a href="/trust-aura/a-propos">À propos</a></li>
          <li><a href="/trust-aura/portfolio">Portfolio</a></li>
          <li><a href="/trust-aura/resultats">Résultats</a></li>
          <li><a href="/trust-aura#contact">Contact</a></li>
        </ul>
        <a href="/trust-aura#contact" className="ta-btn-primary" style={{ fontSize: "0.82rem" }}>
          Audit gratuit →
        </a>
      </nav>

      {/* PAGE HEADER */}
      <header className="ta-page-header">
        <div className="ta-page-header-bg" />
        <div className="ta-badge">✦ Résultats clients</div>
        <h1>Des chiffres réels,<br />pas des <span className="ta-gold-text">promesses</span></h1>
        <p>Voici ce que nos clients ont obtenu. Chaque résultat est documenté, chaque chiffre est vérifié.</p>
        <div className="ta-stats-bar">
          {stats.map((s) => (
            <div key={s.label} className="ta-stat">
              <div className="ta-stat-value">{s.value}</div>
              <div className="ta-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </header>

      <hr className="ta-divider" />

      {/* CASE STUDIES */}
      <section className="ta-section">
        <span className="ta-section-label">✦ Études de cas</span>
        <h2>Ce que nous avons <span className="ta-gold-text">accompli</span></h2>
        <p className="ta-section-sub">Chaque client a une histoire unique. Voici les nôtres.</p>
        <div className="ta-cases-grid">
          {caseStudies.map((c) => (
            <div key={c.client} className="ta-case-card">
              <img src={c.image} alt={c.client} className="ta-case-img" />
              <div className="ta-case-top">
                <div className="ta-case-meta">
                  <div className="ta-case-client">{c.client}</div>
                  <div className="ta-case-sector">{c.sector} · {c.duration}</div>
                </div>
                <div className="ta-case-tag">{c.service}</div>
              </div>
              <div className="ta-case-numbers">
                <div className="ta-case-num-block">
                  <div className="ta-case-num-label">Avant</div>
                  <div className="ta-case-num-val">{c.before}</div>
                </div>
                <div className="ta-case-num-block">
                  <div className="ta-case-num-label">Après</div>
                  <div className="ta-case-num-val">{c.after}</div>
                </div>
                <div className="ta-case-num-block" style={{ gridColumn: "1 / -1", background: "var(--blue-dim)" }}>
                  <div className="ta-case-num-label">Résultat</div>
                  <div className="ta-case-result" style={{ color: c.color }}>{c.result}</div>
                  <div className="ta-case-result-label">{c.resultLabel}</div>
                </div>
              </div>
              <hr className="ta-case-divider" />
              <p className="ta-case-quote">"{c.testimonial}"</p>
              <div className="ta-case-author-row">
                <img src={c.avatar} alt={c.name} className="ta-case-avatar" />
                <div>
                  <div className="ta-case-author">{c.name}</div>
                  <div className="ta-case-role">{c.role}</div>
                </div>
              </div>
              <ul className="ta-case-actions">
                {c.actions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <hr className="ta-divider" />

      {/* TESTIMONIALS */}
      <section className="ta-section">
        <span className="ta-section-label">✦ Témoignages</span>
        <h2>Ils parlent mieux que <span className="ta-gold-text">nous</span></h2>
        <p className="ta-section-sub">La satisfaction de nos clients est notre meilleure carte de visite.</p>
        <div className="ta-testi-grid">
          {testimonials.map((t) => (
            <div key={t.name} className="ta-testi-card">
              <div className="ta-testi-result">{t.result}</div>
              <p className="ta-testi-text">"{t.text}"</p>
              <div className="ta-testi-author-row">
                <img src={t.avatar} alt={t.name} className="ta-testi-avatar" />
                <div>
                  <div className="ta-testi-author">{t.name}</div>
                  <div className="ta-testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="ta-cta-banner">
        <div className="ta-cta-inner">
          <h2>Votre business sera<br />notre <span className="ta-gold-text">prochain succès</span></h2>
          <p>Rejoignez les 50+ clients qui ont fait confiance à Trust Aura pour scaler leur business.</p>
          <a href="/trust-aura#contact" className="ta-btn-primary" style={{ padding: "0.85rem 2.2rem", fontSize: "0.95rem" }}>
            Obtenir mon audit gratuit →
          </a>
        </div>
      </div>

      <TrustAuraFooter />
    </div>
  )
}
