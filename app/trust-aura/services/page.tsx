import TrustAuraFooter from "@/components/trust-aura/Footer"

const services = [
  {
    icon: "◈",
    title: "Meta Ads",
    desc: "Campagnes Facebook & Instagram ultra-ciblées qui convertissent. ROI garanti ou remboursé.",
    features: ["Ciblage avancé", "A/B Testing", "Rapports hebdomadaires"],
    detail: "Nous créons et gérons vos campagnes Meta de A à Z : audiences personnalisées, créatives percutantes, optimisation continue. Chaque euro dépensé est tracé et optimisé pour maximiser votre retour sur investissement.",
    demoSlug: "meta-ads",
  },
  {
    icon: "◉",
    title: "Google Ads",
    desc: "Capturez les clients qui cherchent exactement vos services au bon moment.",
    features: ["Search & Display", "Remarketing", "Optimisation CPC"],
    detail: "Search, Display, Shopping, YouTube — nous couvrons tous les canaux Google. Notre approche data-driven garantit que vos annonces apparaissent au bon moment, devant la bonne personne, avec le bon message.",
    demoSlug: "google-ads",
  },
  {
    icon: "◇",
    title: "Création de Contenu",
    desc: "Visuels, vidéos et copy qui arrêtent le scroll et déclenchent l'action.",
    features: ["Motion design", "Reels & Shorts", "Copywriting persuasif", "Flyers personnalisables"],
    detail: "Notre équipe créative produit des contenus qui performent : visuels impactants, vidéos courtes optimisées pour chaque plateforme, copywriting conçu pour convertir, et flyers personnalisables à votre image pour vos événements, promotions et communications print ou digitales.",
    demoSlug: "creation-contenu",
  },
  {
    icon: "◒",
    title: "Bot IA Personnalisé",
    desc: "Création de bots sur mesure pour votre site web. Automatisez vos réponses, qualifiez vos leads et convertissez 24h/24 sans lever le petit doigt.",
    features: ["Chatbot IA intégré", "Qualification automatique", "Disponible 24h/24"],
    detail: "Nous concevons et intégrons un bot IA entièrement personnalisé à votre site : réponses automatiques, prise de rendez-vous, qualification de leads et suivi client. Votre business tourne même quand vous dormez.",
    demoSlug: "bot-ia",
  },
  {
    icon: "◑",
    title: "Boutique Shopify",
    desc: "Création de votre boutique Shopify sur mesure, designée selon vos goûts et votre identité de marque.",
    features: ["Design personnalisé", "Catalogue produits", "Paiement & livraison"],
    detail: "De la conception au lancement, nous créons votre boutique Shopify clé en main : design personnalisé, intégration produits, configuration paiement, livraison, et optimisation des conversions.",
    demoSlug: "boutique-shopify",
  },
]

export default function ServicesPage() {

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
        /* PAGE HEADER BANNER */
        .ta-page-header {
          min-height: 480px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 120px 5% 70px;
          position: relative; overflow: hidden;
          background-image: url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1800&q=80');
          background-size: cover; background-position: center;
        }
        .ta-page-header::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(8, 12, 28, 0.68);
          z-index: 0;
        }
        .ta-page-header::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 40%, rgba(37,99,235,0.35) 0%, transparent 65%);
          z-index: 0; pointer-events: none;
        }
        .ta-page-header > * { position: relative; z-index: 1; }
        .ta-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: rgba(37,99,235,0.2); border: 1px solid rgba(96,165,250,0.35);
          color: #93C5FD; font-size: 0.78rem; font-weight: 600;
          padding: 0.35rem 0.9rem; border-radius: 99px; margin-bottom: 1.5rem;
          letter-spacing: 0.04em; text-transform: uppercase;
        }
        .ta-page-header h1 {
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 900; line-height: 1.1; letter-spacing: -0.03em;
          margin: 0 0 1rem; color: #ffffff;
        }
        .ta-gold-text {
          background: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ta-page-header p {
          font-size: 1.1rem; color: rgba(255,255,255,0.72);
          max-width: 540px; margin: 0 auto; line-height: 1.7;
        }
        /* SERVICES */
        .ta-services-section {
          max-width: 1200px; margin: 0 auto; padding: 4rem 5% 6rem;
        }
        .ta-services-list {
          display: flex; flex-direction: column; gap: 1.5rem;
        }
        .ta-service-row {
          background: #fff; border: 1px solid rgba(15,23,42,0.09);
          border-radius: 14px; padding: 2.2rem 2.4rem;
          display: grid; grid-template-columns: 80px 1fr 1fr auto;
          gap: 2rem; align-items: center;
          transition: border-color 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .ta-service-row:hover {
          border-color: var(--blue);
          box-shadow: 0 4px 24px rgba(37,99,235,0.10);
        }
        .ta-service-icon-big {
          font-size: 2.2rem; color: var(--blue);
          width: 60px; height: 60px;
          background: var(--blue-dim); border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .ta-service-row h3 {
          font-size: 1.2rem; font-weight: 800; margin: 0 0 0.4rem; color: var(--text);
        }
        .ta-service-row > div:nth-child(2) p {
          font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;
        }
        .ta-features { list-style: none; margin: 0; padding: 0; }
        .ta-features li {
          font-size: 0.82rem; color: rgba(15,23,42,0.5);
          padding: 0.25rem 0; display: flex; align-items: center; gap: 0.4rem;
        }
        .ta-features li::before { content: '—'; color: var(--blue); font-weight: 700; }
        .ta-service-detail {
          font-size: 0.85rem; color: var(--text-muted); line-height: 1.65;
        }
        .ta-demo-btn {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: var(--blue-dim); border: 1px solid var(--blue);
          color: var(--blue); font-size: 0.8rem; font-weight: 700;
          padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;
          transition: background 0.2s, transform 0.15s; white-space: nowrap;
          margin-top: 0.8rem;
        }
        .ta-demo-btn:hover { background: rgba(37,99,235,0.15); transform: translateY(-1px); }
        /* MODAL */
        .ta-modal-overlay {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(8,12,28,0.85);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .ta-modal {
          background: #fff; border-radius: 20px;
          max-width: 860px; width: 100%;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0,0,0,0.35);
          animation: slideUp 0.25s ease;
        }
        /* Faux navigateur */
        .ta-modal-browser {
          position: relative; overflow: hidden;
          border-radius: 14px 14px 0 0;
        }
        .ta-modal-browser-bar {
          position: absolute; top: 0; left: 0; right: 0;
          height: 38px; background: rgba(255,255,255,0.90);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; padding: 0 14px; gap: 6px;
          z-index: 2;
        }
        .ta-modal-dot { width: 10px; height: 10px; border-radius: 50%; }
        .ta-modal-url {
          flex: 1; margin: 0 10px;
          background: rgba(15,23,42,0.06); border-radius: 6px;
          height: 22px; display: flex; align-items: center;
          padding: 0 10px; font-size: 0.7rem; color: rgba(15,23,42,0.4);
        }
        .ta-modal-img {
          width: 100%; height: 400px; object-fit: cover; display: block;
        }
        .ta-modal-preview-label {
          position: absolute; bottom: 12px; left: 14px;
          background: rgba(255,255,255,0.88); backdrop-filter: blur(6px);
          color: rgba(15,23,42,0.7); font-size: 0.72rem;
          padding: 0.25rem 0.7rem; border-radius: 99px;
          border: 1px solid rgba(15,23,42,0.1); z-index: 2;
        }
        .ta-modal-body {
          padding: 1.8rem 2.2rem;
          display: flex; align-items: flex-start; justify-content: space-between; gap: 1.5rem;
        }
        .ta-modal-info { flex: 1; }
        .ta-modal-icon {
          font-size: 1.6rem; color: var(--blue);
          width: 46px; height: 46px; background: var(--blue-dim);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          margin-bottom: 0.8rem;
        }
        .ta-modal-title {
          font-size: 1.3rem; font-weight: 900; color: var(--text);
          margin: 0 0 0.4rem; letter-spacing: -0.02em;
        }
        .ta-modal-caption {
          font-size: 0.86rem; color: var(--text-muted); line-height: 1.65;
          margin: 0 0 1.2rem;
        }
        .ta-modal-close {
          background: rgba(15,23,42,0.06); border: none; cursor: pointer;
          width: 36px; height: 36px; border-radius: 50%;
          font-size: 1rem; color: var(--text);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s; flex-shrink: 0;
        }
        .ta-modal-close:hover { background: rgba(15,23,42,0.12); }
        /* CTA BANNER */
        .ta-cta-banner {
          max-width: 1200px; margin: 0 auto 6rem; padding: 0 5%;
        }
        .ta-cta-inner {
          background: linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(37,99,235,0.08) 100%);
          border: 1px solid var(--border);
          border-radius: 16px; padding: 3rem;
          text-align: center;
        }
        .ta-cta-inner h2 {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 900; margin: 0 0 0.8rem; color: var(--text);
          letter-spacing: -0.02em;
        }
        .ta-cta-inner p {
          color: var(--text-muted); margin: 0 0 2rem; font-size: 0.95rem;
        }
        .ta-divider { border: none; border-top: 1px solid rgba(15,23,42,0.07); margin: 0; }
        @media (max-width: 900px) {
          .ta-service-row {
            grid-template-columns: 60px 1fr;
            grid-template-rows: auto auto auto;
          }
          .ta-service-icon-big { width: 48px; height: 48px; font-size: 1.6rem; }
          .ta-service-row > div:nth-child(3),
          .ta-service-row > div:nth-child(4) {
            grid-column: 1 / -1;
          }
          .ta-nav-links { display: none; }
          .ta-modal-img { height: 240px; }
          .ta-modal-body { flex-direction: column; }
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
          <li><a href="/trust-aura#resultats">Résultats</a></li>
          <li><a href="/trust-aura#contact">Contact</a></li>
        </ul>
        <a href="/trust-aura#contact" className="ta-btn-primary" style={{ fontSize: "0.82rem" }}>
          Audit gratuit →
        </a>
      </nav>

      {/* PAGE HEADER */}
      <header className="ta-page-header">
        <div className="ta-badge">✦ Nos services</div>
        <h1>Tout ce dont vous avez besoin<br />pour <span className="ta-gold-text">dominer votre marché</span></h1>
        <p>Des services pensés pour générer des résultats mesurables, pas des promesses.</p>
      </header>

      <hr className="ta-divider" />

      {/* SERVICES LIST */}
      <section className="ta-services-section">
        <div className="ta-services-list">
          {services.map((s) => (
            <div key={s.title} className="ta-service-row">
              <div className="ta-service-icon-big">{s.icon}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <a href={`/trust-aura/services/demo/${s.demoSlug}`} className="ta-demo-btn">▶ Voir la démo</a>
              </div>
              <div>
                <ul className="ta-features">
                  {s.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="ta-service-detail" style={{ maxWidth: "260px" }}>
                {s.detail}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* CTA */}
      <div className="ta-cta-banner">
        <div className="ta-cta-inner">
          <h2>Prêt à passer à la <span className="ta-gold-text">vitesse supérieure</span> ?</h2>
          <p>Réservez votre audit gratuit et découvrez comment on peut faire grandir votre business.</p>
          <a href="/trust-aura#contact" className="ta-btn-primary" style={{ padding: "0.85rem 2.2rem", fontSize: "0.95rem" }}>
            Obtenir mon audit gratuit →
          </a>
        </div>
      </div>

      <TrustAuraFooter />
    </div>
  )
}
