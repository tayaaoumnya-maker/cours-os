export default function VitrineDemo() {
  return (
    <div className="vit-root">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .vit-root { font-family: 'Georgia', serif; background: #faf8f5; color: #1a1a1a; }
        /* NAV */
        .vit-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.2rem 5%; border-bottom: 1px solid #e8e0d5; background: #fff;
          position: sticky; top: 0; z-index: 10;
        }
        .vit-logo { font-size: 1.4rem; font-weight: 700; letter-spacing: 0.08em; color: #1a1a1a; }
        .vit-logo span { color: #b8860b; }
        .vit-nav-links { display: flex; gap: 2rem; list-style: none; }
        .vit-nav-links a { color: #555; font-size: 0.88rem; text-decoration: none; font-family: 'Inter', sans-serif; letter-spacing: 0.04em; }
        .vit-nav-links a:hover { color: #b8860b; }
        .vit-nav-btn { background: #1a1a1a; color: #fff; border: none; padding: 0.6rem 1.4rem; font-family: 'Inter', sans-serif; font-size: 0.82rem; letter-spacing: 0.06em; cursor: pointer; }
        /* HERO */
        .vit-hero {
          display: grid; grid-template-columns: 1fr 1fr; min-height: 85vh; align-items: center;
        }
        .vit-hero-text { padding: 4rem 5%; }
        .vit-hero-label { font-family: 'Inter', sans-serif; font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: #b8860b; margin-bottom: 1.5rem; }
        .vit-hero h1 { font-size: clamp(2.2rem, 4vw, 3.6rem); line-height: 1.15; margin-bottom: 1.5rem; font-weight: 400; }
        .vit-hero h1 em { font-style: italic; color: #b8860b; }
        .vit-hero p { font-family: 'Inter', sans-serif; color: #666; line-height: 1.8; font-size: 0.95rem; margin-bottom: 2.5rem; max-width: 400px; }
        .vit-hero-btns { display: flex; gap: 1rem; }
        .vit-btn { background: #1a1a1a; color: #fff; border: none; padding: 0.85rem 2rem; font-family: 'Inter', sans-serif; font-size: 0.82rem; letter-spacing: 0.06em; cursor: pointer; }
        .vit-btn-out { background: transparent; color: #1a1a1a; border: 1px solid #1a1a1a; padding: 0.85rem 2rem; font-family: 'Inter', sans-serif; font-size: 0.82rem; letter-spacing: 0.06em; cursor: pointer; }
        .vit-hero-img { height: 85vh; background: url('https://images.unsplash.com/photo-1560472355-536de3962603?w=900&q=80') center/cover; }
        /* STATS */
        .vit-stats { display: grid; grid-template-columns: repeat(4,1fr); background: #1a1a1a; }
        .vit-stat { padding: 2rem; text-align: center; border-right: 1px solid rgba(255,255,255,0.08); }
        .vit-stat:last-child { border: none; }
        .vit-stat-val { font-size: 2rem; font-weight: 700; color: #b8860b; margin-bottom: 0.3rem; }
        .vit-stat-label { font-family: 'Inter', sans-serif; font-size: 0.75rem; color: rgba(255,255,255,0.45); letter-spacing: 0.06em; }
        /* SERVICES */
        .vit-services { padding: 6rem 5%; max-width: 1200px; margin: 0 auto; }
        .vit-section-label { font-family: 'Inter', sans-serif; font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: #b8860b; margin-bottom: 0.8rem; }
        .vit-services h2 { font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 400; margin-bottom: 3rem; }
        .vit-services-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; }
        .vit-service { padding: 2rem; border: 1px solid #e8e0d5; background: #fff; }
        .vit-service-icon { font-size: 1.8rem; margin-bottom: 1rem; }
        .vit-service h3 { font-size: 1.1rem; margin-bottom: 0.6rem; font-weight: 600; }
        .vit-service p { font-family: 'Inter', sans-serif; font-size: 0.84rem; color: #777; line-height: 1.65; }
        /* ABOUT */
        .vit-about { display: grid; grid-template-columns: 1fr 1fr; min-height: 60vh; }
        .vit-about-img { background: url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80') center/cover; }
        .vit-about-text { padding: 4rem 5%; display: flex; flex-direction: column; justify-content: center; background: #f0ebe3; }
        .vit-about-text h2 { font-size: clamp(1.6rem, 2.5vw, 2.2rem); font-weight: 400; margin-bottom: 1.5rem; line-height: 1.3; }
        .vit-about-text p { font-family: 'Inter', sans-serif; color: #666; line-height: 1.8; font-size: 0.9rem; margin-bottom: 1.2rem; }
        /* TESTI */
        .vit-testi { padding: 6rem 5%; background: #fff; }
        .vit-testi-inner { max-width: 1200px; margin: 0 auto; }
        .vit-testi h2 { font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 400; margin-bottom: 3rem; }
        .vit-testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
        .vit-testi-card { padding: 2rem; border: 1px solid #e8e0d5; }
        .vit-testi-stars { color: #b8860b; font-size: 0.85rem; margin-bottom: 1rem; }
        .vit-testi-text { font-size: 0.9rem; color: #555; line-height: 1.7; margin-bottom: 1.2rem; font-style: italic; }
        .vit-testi-author { font-family: 'Inter', sans-serif; font-size: 0.8rem; font-weight: 600; }
        /* CTA */
        .vit-cta { padding: 6rem 5%; background: #1a1a1a; text-align: center; }
        .vit-cta h2 { font-size: clamp(1.8rem, 3vw, 2.8rem); color: #fff; font-weight: 400; margin-bottom: 1rem; }
        .vit-cta h2 em { color: #b8860b; font-style: italic; }
        .vit-cta p { font-family: 'Inter', sans-serif; color: rgba(255,255,255,0.5); margin-bottom: 2rem; }
        .vit-cta-btn { background: #b8860b; color: #fff; border: none; padding: 1rem 2.5rem; font-family: 'Inter', sans-serif; font-size: 0.9rem; letter-spacing: 0.06em; cursor: pointer; }
        /* FOOTER */
        .vit-footer { background: #0d0d0d; padding: 3rem 5%; display: flex; justify-content: space-between; align-items: center; }
        .vit-footer-logo { font-size: 1.1rem; font-weight: 700; letter-spacing: 0.08em; color: #fff; }
        .vit-footer-logo span { color: #b8860b; }
        .vit-footer-copy { font-family: 'Inter', sans-serif; font-size: 0.75rem; color: rgba(255,255,255,0.3); }
        @media (max-width: 768px) {
          .vit-hero, .vit-about { grid-template-columns: 1fr; }
          .vit-hero-img, .vit-about-img { height: 300px; }
          .vit-services-grid, .vit-testi-grid, .vit-stats { grid-template-columns: 1fr; }
          .vit-nav-links { display: none; }
        }
      `}</style>

      <nav className="vit-nav">
        <div className="vit-logo">Nova<span>Skin</span></div>
        <ul className="vit-nav-links">
          <li><a href="#">Soins</a></li>
          <li><a href="#">À propos</a></li>
          <li><a href="#">Résultats</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <button className="vit-nav-btn">Réserver →</button>
      </nav>

      <section className="vit-hero">
        <div className="vit-hero-text">
          <div className="vit-hero-label">✦ Clinique esthétique Paris</div>
          <h1>La beauté,<br /><em>réinventée</em><br />pour vous.</h1>
          <p>Des soins premium personnalisés pour révéler votre beauté naturelle. Expertise médicale, résultats visibles.</p>
          <div className="vit-hero-btns">
            <button className="vit-btn">Prendre RDV</button>
            <button className="vit-btn-out">Nos soins</button>
          </div>
        </div>
        <div className="vit-hero-img" />
      </section>

      <div className="vit-stats">
        {[["2 000+","Patients satisfaits"],["12 ans","D'expérience"],["98%","Taux satisfaction"],["15","Experts médicaux"]].map(([v,l]) => (
          <div key={l} className="vit-stat">
            <div className="vit-stat-val">{v}</div>
            <div className="vit-stat-label">{l}</div>
          </div>
        ))}
      </div>

      <section className="vit-services">
        <div className="vit-section-label">✦ Nos spécialités</div>
        <h2>Des soins conçus<br />pour chaque besoin</h2>
        <div className="vit-services-grid">
          {[
            { icon: "✦", title: "Médecine esthétique", desc: "Injections, fillers et traitements anti-âge réalisés par nos médecins certifiés." },
            { icon: "◈", title: "Soins du visage", desc: "Protocoles premium hydratants, éclat et anti-taches adaptés à votre peau." },
            { icon: "◉", title: "Laser & Technologies", desc: "Épilation laser, rajeunissement et traitements cutanés par technologies de pointe." },
          ].map((s) => (
            <div key={s.title} className="vit-service">
              <div className="vit-service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="vit-about">
        <div className="vit-about-img" />
        <div className="vit-about-text">
          <div className="vit-section-label">✦ Notre philosophie</div>
          <h2>La beauté authentique<br />commence par la confiance</h2>
          <p>Fondée par des médecins passionnés, NovaSkin allie expertise médicale et approche naturelle. Chaque patient repart avec des résultats visibles et discrets.</p>
          <p>Notre équipe de 15 spécialistes vous accompagne avec bienveillance dans chaque étape de votre parcours beauté.</p>
          <button className="vit-btn" style={{ alignSelf: "flex-start", marginTop: "1rem" }}>Découvrir l'équipe</button>
        </div>
      </section>

      <section className="vit-testi">
        <div className="vit-testi-inner">
          <div className="vit-section-label">✦ Témoignages</div>
          <h2>Ce que disent<br />nos patients</h2>
          <div className="vit-testi-grid">
            {[
              { stars: "★★★★★", text: "\"Résultats incroyables après 3 séances. L'équipe est professionnelle et à l'écoute. Je recommande vivement !\"", author: "Sophie L." },
              { stars: "★★★★★", text: "\"Enfin une clinique qui prend le temps d'expliquer. Mes injections sont naturelles, personne n'a remarqué !\"", author: "Marie-Claire D." },
              { stars: "★★★★★", text: "\"L'accueil est chaleureux, les résultats dépassent mes attentes. NovaSkin a transformé ma confiance en moi.\"", author: "Isabelle M." },
            ].map((t) => (
              <div key={t.author} className="vit-testi-card">
                <div className="vit-testi-stars">{t.stars}</div>
                <p className="vit-testi-text">{t.text}</p>
                <div className="vit-testi-author">— {t.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vit-cta">
        <div className="vit-section-label" style={{ color: "#b8860b" }}>✦ Consultation offerte</div>
        <h2>Prête pour votre<br /><em>transformation</em> ?</h2>
        <p>Réservez votre consultation gratuite de 30 min avec l'un de nos experts.</p>
        <button className="vit-cta-btn">Réserver maintenant →</button>
      </section>

      <footer className="vit-footer">
        <div className="vit-footer-logo">Nova<span>Skin</span></div>
        <div className="vit-footer-copy">© 2024 NovaSkin · Paris · Tous droits réservés</div>
      </footer>
    </div>
  )
}
