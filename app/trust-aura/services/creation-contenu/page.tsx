import TrustAuraFooter from "@/components/trust-aura/Footer"

const process = [
  { step: "01", title: "Brief créatif", desc: "On définit ensemble votre identité visuelle, votre ton de communication et les messages clés à faire passer." },
  { step: "02", title: "Conception & Storyboard", desc: "Chaque contenu est pensé avant d'être produit — structure du message, format optimal, angle d'accroche." },
  { step: "03", title: "Production", desc: "Visuels, motion design, reels, UGC, copy — notre équipe produit des contenus premium adaptés à chaque plateforme." },
  { step: "04", title: "Validation & Révisions", desc: "Vous recevez les livrables pour validation. On intègre vos retours jusqu'à obtenir exactement ce que vous voulez." },
  { step: "05", title: "Livraison & Suivi", desc: "Contenus livrés en formats optimisés, prêts à publier. On analyse ensuite les performances pour améliorer en continu." },
]

const results = [
  { value: "3×", label: "Taux d'engagement" },
  { value: "+250%", label: "Portée organique" },
  { value: "48h", label: "Délai de livraison" },
  { value: "100%", label: "Contenus sur mesure" },
]

const faqs = [
  { q: "Quels types de contenus produisez-vous ?", a: "Visuels statiques, carrousels, reels/shorts, vidéos UGC, motion design, stories, bannières publicitaires et copy (accroches, légendes, scripts)." },
  { q: "Dois-je fournir des photos ou vidéos ?", a: "Non, ce n'est pas obligatoire. On peut travailler avec votre contenu existant ou créer de A à Z à partir de banques d'images premium et de tournages si nécessaire." },
  { q: "Combien de révisions sont incluses ?", a: "Deux séries de révisions sont incluses par livrable. On s'assure d'avoir une base créative claire en amont pour limiter les allers-retours." },
  { q: "Les contenus sont-ils adaptés à chaque réseau ?", a: "Oui, chaque contenu est optimisé pour la plateforme cible — formats, dimensions, durées et codes visuels de chaque réseau sont respectés." },
]

export default function CreationContenuPage() {
  return (
    <div className="svc-root">
      <style>{`
        :root { --blue: #2563EB; --blue-light: #60A5FA; --blue-dim: rgba(37,99,235,0.08); --border: rgba(15,23,42,0.09); --text: #0f172a; --text-muted: rgba(15,23,42,0.55); --grad: linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .svc-root { font-family: 'Inter', system-ui, sans-serif; background: #f1f5f9; color: var(--text); min-height: 100vh; }
        .svc-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 5%; height: 70px; background: rgba(241,245,249,0.92); backdrop-filter: blur(14px); border-bottom: 1px solid rgba(15,23,42,0.08); }
        .svc-logo { font-size: 1.2rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text); text-decoration: none; }
        .svc-logo span { color: var(--blue); }
        .svc-nav-links { display: flex; gap: 2rem; list-style: none; }
        .svc-nav-links a { color: var(--text-muted); font-size: 0.9rem; text-decoration: none; transition: color 0.2s; }
        .svc-nav-links a:hover, .svc-nav-links a.active { color: var(--blue); font-weight: 600; }
        .svc-btn { background: var(--grad); color: #fff; border: none; padding: 0.55rem 1.3rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer; text-decoration: none; transition: opacity 0.2s, transform 0.15s; }
        .svc-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        @media (max-width: 768px) { .svc-nav-links { display: none; } }
        .svc-hero { padding: 130px 5% 70px; max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
        .svc-hero-tag { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25); color: #F59E0B; font-size: 0.72rem; font-weight: 700; padding: 0.3rem 0.85rem; border-radius: 99px; margin-bottom: 1.5rem; letter-spacing: 0.08em; text-transform: uppercase; }
        .svc-hero h1 { font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 900; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 1.2rem; }
        .svc-grad { background: var(--grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .svc-hero p { font-size: 1.02rem; color: var(--text-muted); line-height: 1.75; margin-bottom: 2rem; }
        .svc-hero-ctas { display: flex; gap: 0.8rem; flex-wrap: wrap; }
        .svc-btn-outline { color: var(--text); padding: 0.6rem 1.4rem; border-radius: 7px; font-weight: 700; font-size: 0.88rem; cursor: pointer; font-family: inherit; text-decoration: none; display: inline-block; border: 1.5px solid transparent; background-image: linear-gradient(#f1f5f9, #f1f5f9), linear-gradient(135deg, #EC4899 0%, #2563EB 60%, #60A5FA 100%); background-origin: border-box; background-clip: padding-box, border-box; transition: opacity 0.2s; }
        .svc-btn-outline:hover { opacity: 0.75; }
        .svc-hero-visual { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 2rem; box-shadow: 0 4px 24px rgba(15,23,42,0.07); }
        .svc-visual-title { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 1.2rem; }
        .svc-stat-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .svc-stat-box { background: #f8fafc; border-radius: 10px; padding: 1.2rem; text-align: center; }
        .svc-stat-val { font-size: 1.8rem; font-weight: 900; background: var(--grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .svc-stat-lbl { font-size: 0.72rem; color: var(--text-muted); margin-top: 0.2rem; }
        .svc-visual-divider { border: none; border-top: 1px solid var(--border); margin: 1.2rem 0; }
        .svc-platform-row { display: flex; gap: 0.6rem; flex-wrap: wrap; }
        .svc-platform { background: var(--blue-dim); color: var(--blue); font-size: 0.72rem; font-weight: 700; padding: 0.3rem 0.7rem; border-radius: 6px; }
        @media (max-width: 768px) { .svc-hero { grid-template-columns: 1fr; gap: 2.5rem; padding-top: 110px; } }
        .svc-section { max-width: 1200px; margin: 0 auto; padding: 5rem 5%; }
        .svc-section-label { color: var(--blue); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.6rem; display: block; }
        .svc-section h2 { font-size: clamp(1.8rem, 3.5vw, 2.5rem); font-weight: 900; line-height: 1.15; letter-spacing: -0.025em; margin-bottom: 0.8rem; }
        .svc-section-sub { color: var(--text-muted); font-size: 1rem; line-height: 1.7; max-width: 500px; margin-bottom: 3rem; }
        .svc-divider { border: none; border-top: 1px solid rgba(15,23,42,0.07); }
        .svc-explain { max-width: 1200px; margin: 0 auto; padding: 5rem 5%; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
        .svc-explain-left h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 900; line-height: 1.2; letter-spacing: -0.025em; margin-bottom: 1rem; }
        .svc-explain-left p { font-size: 0.95rem; color: var(--text-muted); line-height: 1.8; }
        .svc-explain-points { display: flex; flex-direction: column; gap: 1.2rem; }
        .svc-explain-point { background: #fff; border: 1px solid var(--border); border-radius: 10px; padding: 1.3rem 1.5rem; display: flex; gap: 1rem; align-items: flex-start; }
        .svc-explain-point-icon { font-size: 1.1rem; background: var(--grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; flex-shrink: 0; margin-top: 2px; }
        .svc-explain-point-title { font-size: 0.92rem; font-weight: 800; margin-bottom: 0.25rem; }
        .svc-explain-point-desc { font-size: 0.82rem; color: var(--text-muted); line-height: 1.6; }
        @media (max-width: 768px) { .svc-explain { grid-template-columns: 1fr; gap: 2.5rem; } }
        .svc-results { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .svc-result-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 1.8rem; text-align: center; }
        .svc-result-val { font-size: 2.2rem; font-weight: 900; background: var(--grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.4rem; }
        .svc-result-lbl { font-size: 0.8rem; color: var(--text-muted); }
        @media (max-width: 768px) { .svc-results { grid-template-columns: repeat(2, 1fr); } }
        .svc-process { display: flex; flex-direction: column; }
        .svc-process-item { display: grid; grid-template-columns: 80px 1fr; gap: 1.5rem; padding: 2rem 0; border-bottom: 1px solid var(--border); align-items: start; }
        .svc-process-item:last-child { border-bottom: none; }
        .svc-process-step { font-size: 2rem; font-weight: 900; background: var(--grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; }
        .svc-process-title { font-size: 1.05rem; font-weight: 800; margin-bottom: 0.4rem; }
        .svc-process-desc { font-size: 0.88rem; color: var(--text-muted); line-height: 1.65; }
        .svc-faq { display: flex; flex-direction: column; }
        .svc-faq-item { border-bottom: 1px solid var(--border); padding: 1.5rem 0; }
        .svc-faq-q { font-size: 1rem; font-weight: 700; margin-bottom: 0.6rem; }
        .svc-faq-a { font-size: 0.88rem; color: var(--text-muted); line-height: 1.7; }
        .svc-cta { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 3.5rem; display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap; position: relative; overflow: hidden; max-width: 1200px; margin: 0 auto 5rem; }
        .svc-cta::before { content: ''; position: absolute; top: -80px; right: -60px; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%); pointer-events: none; }
        .svc-cta h3 { font-size: clamp(1.3rem, 2.5vw, 1.9rem); font-weight: 900; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
        .svc-cta p { font-size: 0.92rem; color: var(--text-muted); max-width: 400px; line-height: 1.6; }
        .svc-cta-actions { display: flex; gap: 0.8rem; flex-wrap: wrap; flex-shrink: 0; }
      `}</style>

      <nav className="svc-nav">
        <a href="/trust-aura" className="svc-logo">Trust<span>Aura</span></a>
        <ul className="svc-nav-links">
          <li><a href="/trust-aura#services" className="active">Services</a></li>
          <li><a href="/trust-aura/a-propos">À propos</a></li>
          <li><a href="/trust-aura/portfolio">Portfolio</a></li>
          <li><a href="/trust-aura#contact">Contact</a></li>
        </ul>
        <a href="/trust-aura#contact" className="svc-btn">Audit gratuit →</a>
      </nav>

      <div className="svc-hero">
        <div>
          <div className="svc-hero-tag">◇ Création de Contenu</div>
          <h1>Du contenu qui <span className="svc-grad">arrête le scroll</span> et déclenche l&apos;action</h1>
          <p>Visuels, vidéos, reels, copy — on crée des contenus premium qui reflètent votre marque et convertissent votre audience en clients réels.</p>
          <div className="svc-hero-ctas">
            <a href="/trust-aura#contact" className="svc-btn" style={{ padding: "0.75rem 1.8rem", fontSize: "0.92rem" }}>Créer mon contenu →</a>
            <a href="/trust-aura/resultats" className="svc-btn-outline">Voir les résultats</a>
          </div>
        </div>
        <div className="svc-hero-visual">
          <div className="svc-visual-title">Résultats moyens clients</div>
          <div className="svc-stat-row">
            {results.map((r) => (
              <div key={r.label} className="svc-stat-box">
                <div className="svc-stat-val">{r.value}</div>
                <div className="svc-stat-lbl">{r.label}</div>
              </div>
            ))}
          </div>
          <hr className="svc-visual-divider" />
          <div className="svc-visual-title">Formats produits</div>
          <div className="svc-platform-row">
            {["Reels / TikToks", "Visuels statiques", "Carrousels", "Motion Design", "UGC", "Copywriting"].map((p) => (
              <span key={p} className="svc-platform">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* EXPLICATION */}
      <div className="svc-explain">
        <div className="svc-explain-left">
          <span className="svc-section-label">✦ C&apos;est quoi & pourquoi c&apos;est essentiel</span>
          <h2>La Création de Contenu, <span className="svc-grad">c&apos;est quoi exactement ?</span></h2>
          <p>
            La création de contenu, c&apos;est tout ce que votre audience voit de vous en ligne :
            vos visuels, vos vidéos, vos reels, vos textes publicitaires.
            C&apos;est la première impression que vous donnez — et dans un monde où chacun
            fait défiler son fil d&apos;actualité en quelques secondes,
            <strong style={{color:"#0f172a"}}> un contenu médiocre est invisible, un contenu percutant est inoubliable.</strong>
          </p>
          <br />
          <p>
            Que ce soit pour alimenter vos réseaux sociaux, vos campagnes publicitaires
            ou votre site web, la qualité du contenu détermine directement vos résultats.
            Une bonne publicité avec un mauvais visuel ne convertit pas.
            Un bon produit mal présenté ne se vend pas.
            Le contenu, c&apos;est ce qui transforme l&apos;attention en action.
          </p>
        </div>
        <div className="svc-explain-points">
          {[
            { icon: "◈", title: "Arrêter le scroll et capter l'attention en moins de 2 secondes", desc: "Sur les réseaux, vous avez 1 à 2 secondes pour convaincre quelqu'un de s'arrêter. Un contenu bien conçu fait toute la différence entre être ignoré et être vu." },
            { icon: "◉", title: "Renforcer la crédibilité et la confiance de votre marque", desc: "Un contenu professionnel et cohérent signale que vous êtes sérieux. Vos prospects jugent la qualité de votre offre à travers la qualité de ce qu'ils voient." },
            { icon: "◎", title: "Multiplier les performances de vos publicités", desc: "La meilleure stratégie Meta Ads ou Google Ads ne donne rien avec des visuels faibles. Un contenu créatif fort peut réduire votre coût par clic de 30 à 50%." },
            { icon: "◇", title: "Générer de l'engagement organique durable", desc: "Un reel qui cartonne, un carrousel qui apporte de la valeur — ce type de contenu continue de travailler pour vous des mois après sa publication, gratuitement." },
          ].map((p) => (
            <div key={p.title} className="svc-explain-point">
              <span className="svc-explain-point-icon">{p.icon}</span>
              <div>
                <div className="svc-explain-point-title">{p.title}</div>
                <div className="svc-explain-point-desc">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="svc-divider" />
      <section className="svc-section">
        <span className="svc-section-label">✦ Ce qu&apos;on génère</span>
        <h2>Des contenus qui <span className="svc-grad">performent</span></h2>
        <p className="svc-section-sub">Moyennes constatées sur nos clients en production de contenu.</p>
        <div className="svc-results">{results.map((r) => (<div key={r.label} className="svc-result-card"><div className="svc-result-val">{r.value}</div><div className="svc-result-lbl">{r.label}</div></div>))}</div>
      </section>
      <hr className="svc-divider" />
      <section className="svc-section">
        <span className="svc-section-label">✦ Notre méthode</span>
        <h2>Du brief au <span className="svc-grad">contenu final</span></h2>
        <p className="svc-section-sub">Un processus créatif structuré pour des livrables impeccables à chaque fois.</p>
        <div className="svc-process">{process.map((p) => (<div key={p.step} className="svc-process-item"><div className="svc-process-step">{p.step}</div><div><div className="svc-process-title">{p.title}</div><div className="svc-process-desc">{p.desc}</div></div></div>))}</div>
      </section>
      <hr className="svc-divider" />
      <section className="svc-section">
        <span className="svc-section-label">✦ Questions fréquentes</span>
        <h2>Tout ce que vous <span className="svc-grad">voulez savoir</span></h2>
        <div className="svc-faq" style={{ marginTop: "2rem" }}>{faqs.map((f) => (<div key={f.q} className="svc-faq-item"><div className="svc-faq-q">{f.q}</div><div className="svc-faq-a">{f.a}</div></div>))}</div>
      </section>

      <div className="svc-cta">
        <div>
          <h3>Prêt à créer du contenu qui <span className="svc-grad">convertit</span> ?</h3>
          <p>Audit gratuit de 30 min. On analyse votre présence et on vous propose un plan de contenu sur mesure.</p>
        </div>
        <div className="svc-cta-actions">
          <a href="/trust-aura#contact" className="svc-btn" style={{ padding: "0.75rem 1.8rem", fontSize: "0.92rem" }}>Obtenir mon audit gratuit →</a>
          <a href="/trust-aura/services/meta-ads" className="svc-btn-outline">Voir Meta Ads →</a>
        </div>
      </div>
      <TrustAuraFooter />
    </div>
  )
}
