const links = {
  Agence: [
    { label: "À propos", href: "/trust-aura/a-propos" },
    { label: "Notre équipe", href: "/trust-aura/equipe" },
    { label: "Portfolio", href: "/trust-aura/portfolio" },
    { label: "Résultats clients", href: "/trust-aura#resultats" },
  ],
  Services: [
    { label: "Meta Ads", href: "/trust-aura/services/meta-ads" },
    { label: "Google Ads", href: "/trust-aura/services/google-ads" },
    { label: "Réseaux Sociaux", href: "/trust-aura/services/reseaux-sociaux" },
    { label: "Création de Contenu", href: "/trust-aura/services/creation-contenu" },
  ],
  Contact: [
    { label: "Audit gratuit", href: "/trust-aura#contact" },
    { label: "contact@trustaura.fr", href: "mailto:contact@trustaura.fr" },
    { label: "+33 6 00 00 00 00", href: "tel:+33600000000" },
    { label: "Paris, France", href: "#" },
  ],
}

const socials = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
]

export default function TrustAuraFooter() {
  return (
    <>
      <style>{`
        @keyframes rainbow-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .ta-footer-wrap {
          background: linear-gradient(270deg, #EC4899, #f472b6, #60A5FA, #93C5FD, #EC4899);
          background-size: 300% 300%;
          animation: rainbow-shift 6s ease infinite;
          font-family: 'Inter', system-ui, sans-serif;
          position: relative;
        }
        .ta-footer-main {
          max-width: 1200px; margin: 0 auto;
          padding: 4rem 5% 3rem;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 3rem;
        }
        .ta-footer-brand p {
          font-size: 0.85rem; color: rgba(255,255,255,0.85);
          line-height: 1.7; margin: 1rem 0 1.5rem; max-width: 260px;
        }
        .ta-footer-logo-text {
          font-size: 1.4rem; font-weight: 900; letter-spacing: -0.02em; color: #ffffff;
        }
        .ta-footer-logo-text span {
          background: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ta-footer-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
          color: #ffffff; font-size: 0.7rem; font-weight: 600;
          padding: 0.3rem 0.75rem; border-radius: 99px;
          letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.6rem;
          display: block; width: fit-content;
        }
        .ta-footer-socials {
          display: flex; gap: 0.6rem; margin-top: 1.5rem;
        }
        .ta-footer-social {
          width: 36px; height: 36px; border-radius: 8px;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.8);
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; transition: all 0.2s;
        }
        .ta-footer-social:hover {
          background: rgba(255,255,255,0.28); border-color: rgba(255,255,255,0.5);
          color: #fff; transform: translateY(-2px);
        }
        .ta-footer-col h4 {
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: rgba(255,255,255,0.9);
          margin: 0 0 1.2rem;
        }
        .ta-footer-col ul { list-style: none; margin: 0; padding: 0; }
        .ta-footer-col li { margin-bottom: 0.7rem; }
        .ta-footer-col a {
          font-size: 0.88rem; color: rgba(255,255,255,0.9);
          text-decoration: none; transition: color 0.2s;
        }
        .ta-footer-col a:hover { color: #ffffff; }
        .ta-footer-bottom {
          max-width: 1200px; margin: 0 auto;
          padding: 1.5rem 5%;
          border-top: 1px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
        }
        .ta-footer-copy {
          font-size: 0.78rem; color: rgba(255,255,255,0.75);
        }
        .ta-footer-bottom-links {
          display: flex; gap: 1.5rem;
        }
        .ta-footer-bottom-links a {
          font-size: 0.78rem; color: rgba(255,255,255,0.75);
          text-decoration: none; transition: color 0.2s;
        }
        .ta-footer-bottom-links a:hover { color: #ffffff; }
        .ta-footer-cta {
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
          border-radius: 12px; padding: 1.5rem 2rem;
          display: flex; align-items: center; justify-content: space-between;
          gap: 1.5rem; flex-wrap: wrap; margin-bottom: 3rem;
        }
        .ta-footer-cta-text {
          font-size: 0.95rem; color: rgba(255,255,255,0.8); font-weight: 500;
        }
        .ta-footer-cta-text strong { color: #ffffff; }
        .ta-footer-cta-btn {
          background: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%);
          color: #fff; border: none;
          padding: 0.6rem 1.4rem; border-radius: 7px; font-weight: 700;
          font-size: 0.88rem; cursor: pointer; text-decoration: none;
          white-space: nowrap; transition: opacity 0.2s, transform 0.15s;
          font-family: inherit;
        }
        .ta-footer-cta-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        @media (max-width: 900px) {
          .ta-footer-main { grid-template-columns: 1fr 1fr; }
          .ta-footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 560px) {
          .ta-footer-main { grid-template-columns: 1fr; }
          .ta-footer-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer className="ta-footer-wrap">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 5% 0" }}>
          <div className="ta-footer-cta">
            <div className="ta-footer-cta-text">
              <strong>Prêt à scaler votre business ?</strong> — Audit gratuit de 30 min, sans engagement.
            </div>
            <a href="/trust-aura#contact" className="ta-footer-cta-btn">
              Obtenir mon audit →
            </a>
          </div>
        </div>

        <div className="ta-footer-main">
          {/* Brand */}
          <div className="ta-footer-brand">
            <span className="ta-footer-badge">✦ Agence Marketing Digital</span>
            <div className="ta-footer-logo-text">Trust<span>Aura</span></div>
            <p>
              On transforme votre investissement publicitaire en résultats mesurables.
              Meta Ads, Google Ads, Social Media — on gère tout, vous encaissez.
            </p>
            <div className="ta-footer-socials">
              {socials.map((s) => (
                <a key={s.label} href={s.href} className="ta-footer-social" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="ta-footer-col">
              <h4>{title}</h4>
              <ul>
                {items.map((item) => (
                  <li key={item.label}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="ta-footer-bottom">
          <div className="ta-footer-copy">
            © {new Date().getFullYear()} TrustAura. Tous droits réservés.
          </div>
          <div className="ta-footer-bottom-links">
            <a href="#">Mentions légales</a>
            <a href="#">Politique de confidentialité</a>
            <a href="#">CGV</a>
          </div>
        </div>
      </footer>
    </>
  )
}
