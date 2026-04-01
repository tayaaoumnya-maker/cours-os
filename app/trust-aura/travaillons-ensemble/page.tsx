"use client"

import { useState } from "react"
import TrustAuraFooter from "@/components/trust-aura/Footer"

const steps = [
  {
    num: "01",
    title: "Audit gratuit",
    desc: "On analyse votre situation actuelle : campagnes, audience, positionnement. 30 minutes qui changent tout.",
  },
  {
    num: "02",
    title: "Stratégie sur mesure",
    desc: "On vous présente un plan d'action concret, avec des objectifs chiffrés et un budget adapté à votre business.",
  },
  {
    num: "03",
    title: "Lancement & exécution",
    desc: "Notre équipe prend en main l'intégralité des campagnes. Vous vous concentrez sur votre cœur de métier.",
  },
  {
    num: "04",
    title: "Optimisation continue",
    desc: "Rapports hebdomadaires, ajustements en temps réel, et une communication transparente à chaque étape.",
  },
]

const faqs = [
  {
    q: "Quel budget minimum faut-il prévoir ?",
    a: "Nous travaillons avec des budgets à partir de 500€/mois en publicité. Notre accompagnement s'adapte à votre taille et vos objectifs.",
  },
  {
    q: "Combien de temps pour voir des résultats ?",
    a: "Les premières données arrivent dès la première semaine. Des résultats significatifs se constatent généralement entre 4 et 8 semaines selon le secteur.",
  },
  {
    q: "Y a-t-il un engagement de durée ?",
    a: "Non. Nous travaillons sans contrat forcé. Notre engagement : vous livrer des résultats. Le vôtre : nous faire confiance le temps que la stratégie déploie son plein potentiel.",
  },
  {
    q: "Comment se déroule le suivi ?",
    a: "Rapport hebdomadaire, point mensuel en visio, et accès à votre dashboard en temps réel. Vous savez toujours où va votre argent.",
  },
  {
    q: "Travaillez-vous avec tous les secteurs ?",
    a: "Oui — e-commerce, SaaS, restauration, immobilier, beauté, fitness, services B2B... Nous avons de l'expérience dans plus de 15 secteurs.",
  },
]

export default function TravaillonsEnsemblePage() {
  const [form, setForm] = useState({ name: "", email: "", business: "", budget: "", service: "", message: "" })
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
        /* HERO */
        .ta-hero-banner {
          min-height: 380px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 120px 5% 60px;
          position: relative; overflow: hidden;
          background-image: url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1800&q=80');
          background-size: cover; background-position: center;
        }
        .ta-hero-banner::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(8,12,28,0.70); z-index: 0;
        }
        .ta-hero-banner::after {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 40%, rgba(37,99,235,0.28) 0%, transparent 65%);
          z-index: 0;
        }
        .ta-hero-banner > * { position: relative; z-index: 1; }
        .ta-hero-banner h1 {
          font-size: clamp(2.2rem, 4.5vw, 3.6rem);
          font-weight: 900; line-height: 1.1; letter-spacing: -0.03em;
          margin: 0 0 1rem; color: #ffffff;
        }
        .ta-hero-banner p {
          font-size: 1.05rem; color: rgba(255,255,255,0.75);
          max-width: 520px; line-height: 1.75; margin: 0;
        }
        .ta-hero {
          padding: 60px 5% 80px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 5rem; align-items: center;
          max-width: 1200px; margin: 0 auto;
        }
        .ta-hero h1 {
          font-size: clamp(2.2rem, 4.5vw, 3.6rem);
          font-weight: 900; line-height: 1.1; letter-spacing: -0.03em;
          margin: 0 0 1.2rem; color: var(--text);
        }
        .ta-hero p {
          font-size: 1.05rem; color: var(--text-muted); line-height: 1.75;
          margin: 0 0 2rem;
        }
        .ta-hero-trust {
          display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 2rem;
        }
        .ta-hero-trust-item {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.82rem; color: var(--text-muted);
        }
        .ta-hero-trust-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: linear-gradient(135deg, #EC4899, #2563EB);
          flex-shrink: 0;
        }
        /* FORM CARD */
        .ta-form-card {
          background: #fff; border: 1px solid rgba(15,23,42,0.09);
          border-radius: 16px; padding: 2.4rem;
          box-shadow: 0 8px 40px rgba(37,99,235,0.08);
        }
        .ta-form-card h3 {
          font-size: 1.2rem; font-weight: 800; margin: 0 0 0.4rem; color: var(--text);
        }
        .ta-form-card p {
          font-size: 0.85rem; color: var(--text-muted); margin: 0 0 1.8rem;
        }
        .ta-form { display: flex; flex-direction: column; gap: 1rem; }
        .ta-input {
          background: #f8fafc; border: 1.5px solid rgba(15,23,42,0.12);
          color: var(--text); padding: 0.85rem 1.1rem; border-radius: 8px;
          font-size: 0.9rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit; width: 100%; box-sizing: border-box;
        }
        .ta-input:focus {
          border-color: var(--blue);
          box-shadow: 0 0 0 3px rgba(37,99,235,0.10);
        }
        .ta-input::placeholder { color: rgba(15,23,42,0.38); }
        textarea.ta-input { resize: vertical; min-height: 110px; }
        select.ta-input { appearance: none; cursor: pointer; }
        .ta-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .ta-success {
          background: var(--blue-dim); border: 1px solid var(--border);
          color: var(--blue); padding: 1.5rem; border-radius: 10px;
          text-align: center; font-weight: 600; font-size: 0.95rem; line-height: 1.6;
        }
        /* PROCESS */
        .ta-process { max-width: 1200px; margin: 0 auto; padding: 5rem 5%; }
        .ta-process h2 {
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 900; line-height: 1.15; letter-spacing: -0.025em;
          margin: 0 0 0.8rem; color: var(--text);
        }
        .ta-section-label {
          color: var(--blue); font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem;
          display: block;
        }
        .ta-section-sub {
          color: var(--text-muted); font-size: 1rem; line-height: 1.7;
          max-width: 480px; margin-bottom: 3rem;
        }
        .ta-steps {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;
        }
        .ta-step {
          background: #fff; border: 1px solid rgba(15,23,42,0.08);
          border-radius: 14px; padding: 2rem 1.6rem;
          position: relative; overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ta-step:hover { border-color: var(--blue); box-shadow: 0 4px 24px rgba(37,99,235,0.10); }
        .ta-step-num {
          font-size: 3rem; font-weight: 900; line-height: 1;
          background: linear-gradient(135deg, #EC4899 0%, #2563EB 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; margin-bottom: 1rem; display: block;
          opacity: 0.25;
        }
        .ta-step h4 { font-size: 1rem; font-weight: 800; margin: 0 0 0.5rem; color: var(--text); }
        .ta-step p { font-size: 0.84rem; color: var(--text-muted); line-height: 1.65; margin: 0; }
        /* FAQ */
        .ta-faq { max-width: 800px; margin: 0 auto; padding: 5rem 5%; }
        .ta-faq h2 {
          font-size: clamp(1.8rem, 4vw, 2.4rem);
          font-weight: 900; letter-spacing: -0.025em;
          margin: 0 0 2.5rem; color: var(--text);
        }
        .ta-faq-item {
          border-bottom: 1px solid rgba(15,23,42,0.08);
        }
        .ta-faq-q {
          width: 100%; background: none; border: none; cursor: pointer;
          text-align: left; padding: 1.3rem 0;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 0.95rem; font-weight: 700; color: var(--text);
          font-family: inherit; gap: 1rem;
        }
        .ta-faq-q:hover { color: var(--blue); }
        .ta-faq-icon {
          font-size: 1.2rem; color: var(--blue); flex-shrink: 0;
          transition: transform 0.2s;
        }
        .ta-faq-icon.open { transform: rotate(45deg); }
        .ta-faq-a {
          font-size: 0.88rem; color: var(--text-muted); line-height: 1.7;
          padding-bottom: 1.3rem; max-width: 640px;
        }
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
          .ta-hero { grid-template-columns: 1fr; gap: 3rem; padding-top: 120px; }
          .ta-steps { grid-template-columns: repeat(2, 1fr); }
          .ta-nav-links { display: none; }
          .ta-form-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .ta-steps { grid-template-columns: 1fr; }
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
          <li><a href="/trust-aura/travaillons-ensemble">Contact</a></li>
        </ul>
        <a href="/trust-aura/travaillons-ensemble" className="ta-btn-primary" style={{ fontSize: "0.82rem" }}>
          Audit gratuit →
        </a>
      </nav>

      {/* BANNER */}
      <div className="ta-hero-banner">
        <div className="ta-badge">✦ Travaillons ensemble</div>
        <h1>Votre succès commence par<br /><span className="ta-gold-text">une conversation.</span></h1>
        <p>Dites-nous où vous en êtes. On s&apos;occupe du reste — stratégie, exécution, résultats.</p>
      </div>

      {/* HERO + FORM */}
      <div className="ta-hero">
        <div>
          <div className="ta-badge">✦ Travaillons ensemble</div>
          <h1>Votre succès<br />commence par<br /><span className="ta-gold-text">une conversation.</span></h1>
          <p>
            Dites-nous où vous en êtes. On s&apos;occupe du reste —
            stratégie, exécution, résultats. Sans jargon, sans promesses vides.
          </p>
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=80"
            alt="Équipe Trust Aura"
            style={{ width: "100%", borderRadius: "14px", border: "1px solid rgba(15,23,42,0.08)", display: "block" }}
          />
          <div className="ta-hero-trust">
            <div className="ta-hero-trust-item"><div className="ta-hero-trust-dot" />Réponse sous 24h</div>
            <div className="ta-hero-trust-item"><div className="ta-hero-trust-dot" />Audit 100% gratuit</div>
            <div className="ta-hero-trust-item"><div className="ta-hero-trust-dot" />Zéro engagement</div>
          </div>
        </div>

        <div className="ta-form-card">
          <h3>Démarrons votre projet</h3>
          <p>Remplissez ce formulaire, on vous recontacte sous 24h.</p>
          {sent ? (
            <div className="ta-success">
              ✓ Message bien reçu !<br />
              Notre équipe vous contacte sous 24h pour planifier votre audit gratuit.
            </div>
          ) : (
            <form className="ta-form" onSubmit={handleSubmit}>
              <div className="ta-form-row">
                <input
                  className="ta-input" placeholder="Votre prénom" required
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="ta-input" placeholder="Email professionnel" type="email" required
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <input
                className="ta-input" placeholder="Nom de votre entreprise"
                value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })}
              />
              <select
                className="ta-input"
                value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
              >
                <option value="">Quel service vous intéresse ?</option>
                <option>Meta Ads (Facebook & Instagram)</option>
                <option>Google Ads</option>
                <option>Réseaux Sociaux</option>
                <option>Création de Contenu</option>
                <option>Boutique Shopify</option>
                <option>Compte LLC</option>
                <option>Plusieurs services</option>
              </select>
              <select
                className="ta-input"
                value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}
              >
                <option value="">Budget mensuel envisagé</option>
                <option>500€ – 1 000€</option>
                <option>1 000€ – 3 000€</option>
                <option>3 000€ – 5 000€</option>
                <option>5 000€ – 10 000€</option>
                <option>+ 10 000€</option>
              </select>
              <textarea
                className="ta-input"
                placeholder="Décrivez votre projet et vos objectifs..."
                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button type="submit" className="ta-btn-primary" style={{ padding: "0.95rem", fontSize: "0.95rem", borderRadius: "8px" }}>
                Envoyer ma demande →
              </button>
            </form>
          )}
        </div>
      </div>

      <hr className="ta-divider" />

      {/* PROCESS */}
      <section className="ta-process">
        <span className="ta-section-label">✦ Notre processus</span>
        <h2>Comment ça <span className="ta-gold-text">fonctionne</span></h2>
        <p className="ta-section-sub">Simple, transparent, orienté résultats. Voici les 4 étapes de notre collaboration.</p>
        <div className="ta-steps">
          {steps.map((s) => (
            <div key={s.num} className="ta-step">
              <span className="ta-step-num">{s.num}</span>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="ta-divider" />

      {/* FAQ */}
      <section className="ta-faq">
        <span className="ta-section-label">✦ Questions fréquentes</span>
        <h2>Tout ce que vous voulez <span className="ta-gold-text">savoir</span></h2>
        {faqs.map((f, i) => (
          <div key={i} className="ta-faq-item">
            <button className="ta-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              {f.q}
              <span className={`ta-faq-icon${openFaq === i ? " open" : ""}`}>+</span>
            </button>
            {openFaq === i && <div className="ta-faq-a">{f.a}</div>}
          </div>
        ))}
      </section>

      {/* CTA */}
      <div className="ta-cta-banner">
        <div className="ta-cta-inner">
          <h2>Prêt à faire <span className="ta-gold-text">décoller</span> votre business ?</h2>
          <p>50+ entrepreneurs nous ont déjà fait confiance. Vous êtes le prochain.</p>
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }} className="ta-btn-primary" style={{ padding: "0.85rem 2.2rem", fontSize: "0.95rem" }}>
            Remplir le formulaire →
          </a>
        </div>
      </div>

      <TrustAuraFooter />
    </div>
  )
}
