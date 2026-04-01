"use client"

import { useState } from "react"
import TrustAuraFooter from "@/components/trust-aura/Footer"

// ─── Data ───────────────────────────────────────────────────────────────────

const services = [
  {
    icon: "◈",
    title: "Meta Ads",
    desc: "Campagnes Facebook & Instagram ultra-ciblées qui convertissent. ROI garanti ou remboursé.",
    features: ["Ciblage avancé", "A/B Testing", "Rapports hebdomadaires"],
  },
  {
    icon: "◉",
    title: "Google Ads",
    desc: "Capturez les clients qui cherchent exactement vos services au bon moment.",
    features: ["Search & Display", "Remarketing", "Optimisation CPC"],
  },
  {
    icon: "◎",
    title: "Réseaux Sociaux",
    desc: "Community management premium. Votre marque prend vie, engage et fidélise.",
    features: ["Stratégie éditoriale", "Création contenu", "Engagement daily"],
  },
  {
    icon: "◇",
    title: "Création de Contenu",
    desc: "Visuels, vidéos et copy qui arrêtent le scroll et déclenchent l'action.",
    features: ["Motion design", "Reels & Shorts", "Copywriting persuasif"],
  },
  {
    icon: "◒",
    title: "Bot Personnalisé",
    desc: "Création de bots sur mesure pour votre site web. Automatisez vos réponses, qualifiez vos leads et convertissez 24h/24 sans lever le petit doigt.",
    features: ["Chatbot IA intégré", "Qualification automatique", "Disponible 24h/24"],
  },
  {
    icon: "◑",
    title: "Boutique Shopify",
    desc: "Création de votre boutique Shopify sur mesure, designée selon vos goûts et votre identité de marque. Clé en main, prête à vendre.",
    features: ["Design personnalisé", "Catalogue produits", "Paiement & livraison"],
  },
]

const stats = [
  { value: "50+", label: "Clients accompagnés" },
  { value: "3M€+", label: "CA généré pour nos clients" },
  { value: "98%", label: "Taux de satisfaction" },
  { value: "5×", label: "ROI moyen constaté" },
]

const testimonials = [
  {
    name: "Karim B.",
    role: "Fondateur, KBFitness",
    text: "En 3 mois, Trust Aura a multiplié mes leads par 6. Leur approche est chirurgicale — chaque euro investi est optimisé.",
    result: "+620% de leads",
  },
  {
    name: "Sofia M.",
    role: "Directrice, MaisonSofia",
    text: "J'étais sceptique au départ. Aujourd'hui mon chiffre d'affaires a doublé grâce à leurs campagnes Meta. Équipe réactive et professionnelle.",
    result: "+200% CA",
  },
  {
    name: "Alexandre T.",
    role: "CEO, TechFlow SaaS",
    text: "La meilleure décision business de l'année. Leur stratégie Google Ads nous a permis de passer de 0 à 150 clients en 4 mois.",
    result: "0 → 150 clients",
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function TrustAuraPage() {
  const [form, setForm] = useState({ name: "", email: "", business: "", message: "" })
  const [sent, setSent] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAllServices, setShowAllServices] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="ta-root">
      <style>{`
        :root {
          --blue: #2563EB;
          --blue-light: #60A5FA;
          --blue-dim: rgba(37,99,235,0.08);
          --black: #ffffff;
          --surface: #f8fafc;
          --border: rgba(37,99,235,0.15);
          --text: #0f172a;
          --text-muted: rgba(15,23,42,0.55);
        }
        .ta-root {
          font-family: 'Inter', system-ui, sans-serif;
          background: #f1f5f9;
          color: var(--text);
          min-height: 100vh;
          scroll-behavior: smooth;
        }
        /* NAV */
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
          color: var(--text);
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
        .ta-btn-outline {
          background: transparent; color: #0f172a;
          border: 1.5px solid transparent;
          background-clip: padding-box;
          box-shadow: 0 0 0 1.5px #EC4899, inset 0 0 0 1.5px transparent;
          background-image: linear-gradient(var(--black), var(--black)),
            linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          border: 1.5px solid transparent;
          padding: 0.55rem 1.4rem; border-radius: 6px; font-weight: 700; font-size: 0.88rem;
          cursor: pointer; transition: opacity 0.2s, transform 0.15s; text-decoration: none; display: inline-block;
        }
        .ta-btn-outline:hover { opacity: 0.8; transform: translateY(-1px); }
        /* HERO */
        .ta-hero {
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 100px 5% 60px;
          position: relative; overflow: hidden;
          background-image: url('https://images.unsplash.com/photo-1551434678-e076c223a692?w=1800&q=80');
          background-size: cover; background-position: center;
        }
        .ta-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(8, 12, 28, 0.72);
          z-index: 0; pointer-events: none;
        }
        .ta-hero::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 30%, rgba(37,99,235,0.30) 0%, transparent 65%);
          z-index: 0; pointer-events: none;
        }
        .ta-hero > * { position: relative; z-index: 1; }
        .ta-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: rgba(37,99,235,0.2); border: 1px solid rgba(96,165,250,0.35);
          color: #93C5FD; font-size: 0.78rem; font-weight: 600;
          padding: 0.35rem 0.9rem; border-radius: 99px; margin-bottom: 1.5rem;
          letter-spacing: 0.04em; text-transform: uppercase;
        }
        .ta-hero h1 {
          font-size: clamp(2.4rem, 6vw, 4.5rem);
          font-weight: 900; line-height: 1.08; margin: 0 0 1.2rem;
          letter-spacing: -0.03em; max-width: 820px;
          color: #ffffff;
        }
        .ta-gold-text {
          background: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ta-hero p {
          font-size: 1.15rem; color: rgba(255,255,255,0.72);
          max-width: 560px; line-height: 1.7; margin: 0 0 2.5rem;
        }
        .ta-hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
        .ta-stats {
          display: flex; gap: 0; flex-wrap: wrap; justify-content: center;
          margin-top: 5rem; border-top: 1px solid rgba(255,255,255,0.12);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          width: 100%; max-width: 860px;
        }
        .ta-stat {
          flex: 1; min-width: 140px; padding: 1.8rem 1rem; text-align: center;
          border-right: 1px solid rgba(255,255,255,0.12);
        }
        .ta-stat:last-child { border-right: none; }
        .ta-stat-value {
          font-size: 2.2rem; font-weight: 900;
          background: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ta-stat-label { font-size: 0.78rem; color: rgba(255,255,255,0.55); margin-top: 0.3rem; }
        /* SECTION */
        .ta-section {
          padding: 6rem 5%;
          max-width: 1200px; margin: 0 auto;
        }
        .ta-section-label {
          display: inline-block;
          color: var(--blue); font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }
        .ta-section h2 {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 900; line-height: 1.15; letter-spacing: -0.025em;
          margin: 0 0 1rem; color: var(--text);
        }
        .ta-section-sub {
          color: var(--text-muted); font-size: 1rem; line-height: 1.7;
          max-width: 520px; margin-bottom: 3.5rem;
        }
        /* NOTRE HISTOIRE */
        .ta-histoire {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 5rem; align-items: center;
        }
        .ta-histoire-img-wrap {
          position: relative; border-radius: 16px; overflow: visible;
        }
        .ta-histoire-img {
          width: 100%; height: 480px; object-fit: cover;
          border-radius: 16px; display: block;
          border: 1px solid var(--border);
        }
        .ta-histoire-badge {
          position: absolute; bottom: -20px; right: -20px;
          background: #fff; border: 1px solid rgba(15,23,42,0.1);
          border-radius: 12px; padding: 1rem 1.4rem;
          display: flex; flex-direction: column; align-items: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
        }
        .ta-histoire-badge-val {
          font-size: 2rem; font-weight: 900;
          background: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ta-histoire-badge-label {
          font-size: 0.72rem; color: rgba(15,23,42,0.45);
          font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
        }
        @media (max-width: 768px) {
          .ta-histoire { grid-template-columns: 1fr; gap: 3rem; }
          .ta-histoire-img { height: 280px; }
          .ta-histoire-badge { bottom: -14px; right: 12px; }
        }
        /* SERVICES */
        .ta-services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.2rem;
        }
        .ta-service-card {
          background: #f8fafc; padding: 2rem 1.8rem;
          border: 1px solid rgba(15,23,42,0.09); border-radius: 12px;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .ta-service-card:hover { background: #fff; border-color: var(--blue); box-shadow: 0 4px 24px rgba(37,99,235,0.10); }
        @media (max-width: 900px) {
          .ta-services-grid { grid-template-columns: repeat(2, 1fr); }
          .ta-service-card:last-child { grid-column: auto; }
        }
        @media (max-width: 560px) {
          .ta-services-grid { grid-template-columns: 1fr; }
        }
        .ta-service-icon {
          font-size: 1.6rem; color: var(--blue); margin-bottom: 1rem;
        }
        .ta-service-card h3 {
          font-size: 1.15rem; font-weight: 800; margin: 0 0 0.6rem; color: var(--text);
        }
        .ta-service-card p {
          font-size: 0.88rem; color: var(--text-muted);
          line-height: 1.6; margin: 0 0 1.2rem;
        }
        .ta-features { list-style: none; margin: 0; padding: 0; }
        .ta-features li {
          font-size: 0.82rem; color: rgba(15,23,42,0.5);
          padding: 0.25rem 0; display: flex; align-items: center; gap: 0.4rem;
        }
        .ta-features li::before { content: '—'; color: var(--blue); font-weight: 700; }
        /* TESTIMONIALS */
        .ta-testi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.2rem;
        }
        .ta-testi-card {
          background: #f8fafc; border: 1px solid rgba(15,23,42,0.09);
          border-radius: 10px; padding: 1.8rem;
          position: relative; overflow: hidden;
        }
        .ta-testi-card::before {
          content: '"';
          position: absolute; top: -0.5rem; right: 1.2rem;
          font-size: 5rem; color: rgba(37,99,235,0.08); font-family: Georgia, serif;
          line-height: 1; pointer-events: none;
        }
        .ta-testi-result {
          display: inline-block; background: var(--blue-dim);
          color: var(--blue); font-size: 0.75rem; font-weight: 700;
          padding: 0.25rem 0.7rem; border-radius: 4px; margin-bottom: 1rem;
          letter-spacing: 0.04em;
        }
        .ta-testi-text {
          font-size: 0.9rem; color: rgba(15,23,42,0.65);
          line-height: 1.65; margin-bottom: 1.3rem;
        }
        .ta-testi-author { font-weight: 700; font-size: 0.92rem; color: var(--text); }
        .ta-testi-role { font-size: 0.78rem; color: var(--text-muted); margin-top: 0.1rem; }
        /* CONTACT */
        .ta-contact-wrap {
          display: grid; grid-template-columns: 1fr 1.3fr; gap: 5rem; align-items: start;
        }
        .ta-contact-info h3 {
          font-size: 1.1rem; font-weight: 700; margin: 0 0 0.5rem; color: var(--text);
        }
        .ta-contact-info p {
          font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin: 0 0 2rem;
        }
        .ta-contact-point {
          display: flex; align-items: flex-start; gap: 0.8rem; margin-bottom: 1.2rem;
        }
        .ta-contact-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--blue); margin-top: 0.35rem; flex-shrink: 0;
        }
        .ta-contact-point-text { font-size: 0.85rem; color: rgba(15,23,42,0.6); line-height: 1.5; }
        .ta-form { display: flex; flex-direction: column; gap: 1rem; }
        .ta-input {
          background: #f8fafc; border: 1.5px solid rgba(15,23,42,0.15);
          color: var(--text); padding: 0.85rem 1.1rem; border-radius: 8px;
          font-size: 0.9rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit; width: 100%; box-sizing: border-box;
        }
        .ta-input:focus {
          border-color: var(--blue);
          box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
        }
        .ta-input::placeholder { color: rgba(15,23,42,0.4); }
        textarea.ta-input { resize: vertical; min-height: 130px; }
        .ta-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .ta-success {
          background: rgba(201,168,76,0.1); border: 1px solid var(--blue);
          color: var(--blue); padding: 1.2rem; border-radius: 8px;
          text-align: center; font-weight: 600; font-size: 0.95rem;
        }
        /* FOOTER */
        .ta-footer {
          border-top: 1px solid rgba(15,23,42,0.08);
          padding: 2.5rem 5%; text-align: center;
          color: rgba(15,23,42,0.35); font-size: 0.8rem;
        }
        .ta-footer-logo { color: var(--text); font-weight: 800; font-size: 1rem; margin-bottom: 0.4rem; }
        .ta-footer-logo span { color: var(--blue); }
        /* DIVIDER */
        .ta-divider { border: none; border-top: 1px solid rgba(15,23,42,0.07); margin: 0; }
        /* MOBILE */
        .ta-hamburger {
          display: none; background: none; border: none; cursor: pointer;
          flex-direction: column; gap: 5px; padding: 4px;
        }
        .ta-hamburger span {
          display: block; width: 22px; height: 2px; background: var(--text); border-radius: 2px;
        }
        @media (max-width: 768px) {
          .ta-nav-links { display: none; }
          .ta-hamburger { display: flex; }
          .ta-contact-wrap { grid-template-columns: 1fr; gap: 3rem; }
          .ta-form-row { grid-template-columns: 1fr; }
          .ta-stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.12); }
          .ta-stat:last-child { border-bottom: none; }
          .ta-stats { flex-direction: column; }
        }
      `}</style>

      {/* NAV */}
      <nav className="ta-nav">
        <div className="ta-logo">Trust<span>Aura</span></div>
        <ul className="ta-nav-links">
          <li><a href="#services">Services</a></li>
          <li><a href="/trust-aura/a-propos">À propos</a></li>
          <li><a href="/trust-aura/portfolio">Portfolio</a></li>
          <li><a href="/trust-aura/resultats">Résultats</a></li>
          <li><a href="/trust-aura/travaillons-ensemble">Contact</a></li>
        </ul>
        <a href="/trust-aura/travaillons-ensemble" className="ta-btn-primary" style={{ fontSize: "0.82rem" }}>
          Audit gratuit →
        </a>
      </nav>

      {/* HERO */}
      <section className="ta-hero" id="accueil">
        <div className="ta-badge">✦ Agence Marketing Digital Premium</div>
        <h1>
          Votre croissance,<br />
          <span className="ta-gold-text">notre obsession.</span>
        </h1>
        <p>
          Trust Aura transforme votre investissement publicitaire en résultats mesurables.
          Meta Ads, Google Ads, Réseaux Sociaux — nous gérons tout, vous encaissez.
        </p>
        <div className="ta-hero-ctas">
          <a href="#contact" className="ta-btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "0.95rem" }}>
            Obtenir mon audit gratuit
          </a>
          <a href="/trust-aura/services" className="ta-btn-outline" style={{ padding: "0.75rem 2rem", fontSize: "0.95rem" }}>
            Nos services
          </a>
        </div>
        <div className="ta-stats">
          {stats.map((s) => (
            <div key={s.label} className="ta-stat">
              <div className="ta-stat-value">{s.value}</div>
              <div className="ta-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="ta-divider" />

      {/* NOTRE HISTOIRE */}
      <section className="ta-section ta-histoire">
        <div className="ta-histoire-img-wrap">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80"
            alt="L'équipe Trust Aura"
            className="ta-histoire-img"
          />
          <div className="ta-histoire-badge">
            <span className="ta-histoire-badge-val">2025</span>
            <span className="ta-histoire-badge-label">Fondée à Paris</span>
          </div>
        </div>
        <div className="ta-histoire-content">
          <div className="ta-section-label">✦ Notre histoire</div>
          <h2>Nés de la <span className="ta-gold-text">frustration</span>,<br />obsédés par les résultats.</h2>
          <p style={{ color: "rgba(15,23,42,0.55)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
            Trust Aura est née en 2020 d&apos;un constat simple : trop d&apos;agences
            promettent la lune et livrent des rapports flatteurs sans résultats concrets.
            On a voulu faire différemment.
          </p>
          <p style={{ color: "rgba(15,23,42,0.55)", lineHeight: 1.75, marginBottom: "2rem" }}>
            Aujourd&apos;hui, notre équipe de 10 experts gère des campagnes pour 50+ clients
            à travers la France, avec une seule boussole : les chiffres qui font grandir votre business.
          </p>
          <a href="/trust-aura/a-propos" className="ta-btn-primary" style={{ padding: "0.75rem 1.8rem", fontSize: "0.92rem" }}>
            Découvrir notre histoire →
          </a>
        </div>
      </section>

      <hr className="ta-divider" />

      {/* SERVICES */}
      <section className="ta-section" id="services">
        <div className="ta-section-label">✦ Ce qu&apos;on fait</div>
        <h2>Des services qui <span className="ta-gold-text">génèrent</span><br />de vrais résultats</h2>
        <p className="ta-section-sub">
          Chaque stratégie est construite sur mesure. Zéro template, zéro copier-coller.
          Votre business est unique — votre marketing aussi.
        </p>
        <div className="ta-services-grid">
          {(showAllServices ? services : services.slice(0, 3)).map((s) => (
            <div key={s.title} className="ta-service-card">
              <div className="ta-service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <ul className="ta-features">
                {s.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <a href="/trust-aura/services" className="ta-btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "0.92rem" }}>
            Voir tous nos services →
          </a>
        </div>
      </section>

      <hr className="ta-divider" />

      {/* TESTIMONIALS */}
      <section className="ta-section" id="resultats">
        <div className="ta-section-label">✦ Résultats clients</div>
        <h2>Ils nous ont fait <span className="ta-gold-text">confiance</span><br />— voici les chiffres</h2>
        <p className="ta-section-sub">
          Pas de promesses vides. Voici ce que nos clients ont obtenu en travaillant avec nous.
        </p>
        <div className="ta-testi-grid">
          {testimonials.map((t) => (
            <div key={t.name} className="ta-testi-card">
              <div className="ta-testi-result">{t.result}</div>
              <p className="ta-testi-text">{t.text}</p>
              <div className="ta-testi-author">{t.name}</div>
              <div className="ta-testi-role">{t.role}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <a href="/trust-aura/resultats" className="ta-btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "0.92rem" }}>
            Voir tous les résultats →
          </a>
        </div>
      </section>

      <hr className="ta-divider" />

      {/* CONTACT */}
      <section className="ta-section" id="contact">
        <div className="ta-contact-wrap">
          <div className="ta-contact-info">
            <div className="ta-section-label">✦ Travaillons ensemble</div>
            <h2>Prêt à <span className="ta-gold-text">scaler</span><br />votre business ?</h2>
            <p>
              Réservez votre audit gratuit de 30 min. On analyse votre situation,
              on identifie les opportunités et on vous propose une stratégie concrète.
            </p>
            <div className="ta-contact-point">
              <div className="ta-contact-dot" />
              <div className="ta-contact-point-text">
                <strong>Audit gratuit</strong><br />
                Analyse complète de vos campagnes actuelles sans engagement
              </div>
            </div>
            <div className="ta-contact-point">
              <div className="ta-contact-dot" />
              <div className="ta-contact-point-text">
                <strong>Réponse sous 24h</strong><br />
                Notre équipe vous contacte rapidement pour planifier l&apos;appel
              </div>
            </div>
            <div className="ta-contact-point">
              <div className="ta-contact-dot" />
              <div className="ta-contact-point-text">
                <strong>Zéro engagement</strong><br />
                Aucun contrat forcé — on prouve notre valeur avant tout
              </div>
            </div>
          </div>

          <div>
            {sent ? (
              <div className="ta-success">
                ✓ Message envoyé ! On vous recontacte sous 24h.
              </div>
            ) : (
              <form className="ta-form" onSubmit={handleSubmit}>
                <div className="ta-form-row">
                  <input
                    className="ta-input" placeholder="Votre nom" required
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    className="ta-input" placeholder="Email professionnel" type="email" required
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <input
                  className="ta-input" placeholder="Nom de votre business"
                  value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })}
                />
                <textarea
                  className="ta-input" placeholder="Parlez-nous de votre projet et vos objectifs..."
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <button type="submit" className="ta-btn-primary" style={{ padding: "0.9rem", fontSize: "0.95rem", borderRadius: "8px" }}>
                  Envoyer ma demande d&apos;audit →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <TrustAuraFooter />
    </div>
  )
}
