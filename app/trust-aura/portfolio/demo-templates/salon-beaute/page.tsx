"use client"
import { useState } from "react"

const services = [
  { name: "Coupe & Brushing", duration: "45 min", price: "55€", icon: "✂️" },
  { name: "Coloration complète", duration: "2h", price: "95€", icon: "🎨" },
  { name: "Balayage / Mèches", duration: "2h30", price: "130€", icon: "✨" },
  { name: "Soin Kératine", duration: "3h", price: "175€", icon: "💆" },
  { name: "Manucure + Gel", duration: "1h", price: "45€", icon: "💅" },
  { name: "Soin visage premium", duration: "1h15", price: "80€", icon: "🌸" },
  { name: "Épilation intégrale", duration: "1h30", price: "70€", icon: "🌙" },
  { name: "Maquillage événement", duration: "1h", price: "90€", icon: "💄" },
]

const team = [
  { name: "Amina R.", role: "Directrice & Coloriste", exp: "12 ans", img: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&q=80" },
  { name: "Léa M.", role: "Spécialiste Kératine", exp: "8 ans", img: "https://images.unsplash.com/photo-1614682950673-64e4f70ab681?w=300&q=80" },
  { name: "Sofia K.", role: "Esthéticienne", exp: "6 ans", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&q=80" },
]

export default function SalonBeauteDemo() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="sb-root">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');
        .sb-root { font-family: 'Inter', sans-serif; background: #FDF9F7; color: #1A1410; }

        /* NAV */
        .sb-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%; height: 72px; background: #fff;
          border-bottom: 1px solid #F0E8E0;
          position: sticky; top: 0; z-index: 10;
        }
        .sb-logo { font-size: 1.3rem; font-weight: 700; letter-spacing: 0.06em; color: #1A1410; }
        .sb-logo span { color: #C9847A; }
        .sb-nav-links { display: flex; gap: 2rem; list-style: none; }
        .sb-nav-links a { color: #777; font-size: 0.85rem; text-decoration: none; letter-spacing: 0.02em; }
        .sb-nav-links a:hover { color: #C9847A; }
        .sb-nav-btn { background: #1A1410; color: #fff; border: none; padding: 0.6rem 1.4rem; font-family: inherit; font-size: 0.82rem; font-weight: 600; letter-spacing: 0.04em; cursor: pointer; border-radius: 4px; }

        /* HERO */
        .sb-hero { display: grid; grid-template-columns: 1fr 1fr; min-height: 90vh; }
        .sb-hero-img {
          background: url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80') center/cover;
          position: relative;
        }
        .sb-hero-img::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(to right, transparent 60%, #FDF9F7 100%);
        }
        .sb-hero-text { display: flex; flex-direction: column; justify-content: center; padding: 4rem 5% 4rem 3rem; }
        .sb-hero-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: #FBF0EE; color: #C9847A; font-size: 0.7rem; font-weight: 700; padding: 0.3rem 0.85rem; border-radius: 99px; margin-bottom: 1.5rem; letter-spacing: 0.06em; text-transform: uppercase; width: fit-content; }
        .sb-hero h1 { font-size: clamp(2.2rem, 4vw, 3.6rem); font-weight: 700; line-height: 1.15; margin-bottom: 1.3rem; letter-spacing: -0.01em; }
        .sb-hero h1 em { color: #C9847A; font-style: italic; }
        .sb-hero p { color: #888; font-size: 0.95rem; line-height: 1.8; margin-bottom: 2rem; max-width: 420px; }
        .sb-hero-stars { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; font-size: 0.82rem; color: #888; }
        .sb-hero-stars span:first-child { color: #F59E0B; font-size: 1rem; }
        .sb-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .sb-btn { background: #C9847A; color: #fff; border: none; padding: 0.9rem 2rem; border-radius: 6px; font-weight: 700; font-size: 0.88rem; cursor: pointer; font-family: inherit; transition: background 0.2s; }
        .sb-btn:hover { background: #B8726A; }
        .sb-btn-out { background: transparent; color: #1A1410; border: 1.5px solid #D0C8C0; padding: 0.9rem 1.8rem; border-radius: 6px; font-weight: 600; font-size: 0.85rem; cursor: pointer; font-family: inherit; }

        /* ABOUT STRIP */
        .sb-strip { background: #1A1410; display: grid; grid-template-columns: repeat(4,1fr); }
        .sb-strip-item { padding: 2rem; border-right: 1px solid rgba(255,255,255,0.07); text-align: center; }
        .sb-strip-item:last-child { border: none; }
        .sb-strip-val { font-size: 1.6rem; font-weight: 900; color: #C9847A; margin-bottom: 0.3rem; }
        .sb-strip-label { font-size: 0.72rem; color: rgba(255,255,255,0.4); letter-spacing: 0.06em; }

        /* SERVICES */
        .sb-services { padding: 5rem 5%; max-width: 1200px; margin: 0 auto; }
        .sb-section-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #C9847A; margin-bottom: 0.7rem; }
        .sb-services h2 { font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 700; margin-bottom: 3rem; letter-spacing: -0.01em; }
        .sb-services-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: #F0E8E0; border: 1px solid #F0E8E0; border-radius: 12px; overflow: hidden; }
        .sb-service { background: #fff; padding: 1.8rem; cursor: pointer; transition: background 0.2s; }
        .sb-service:hover, .sb-service.active { background: #FBF0EE; }
        .sb-service-icon { font-size: 1.6rem; margin-bottom: 0.8rem; }
        .sb-service h3 { font-size: 0.92rem; font-weight: 700; margin-bottom: 0.3rem; }
        .sb-service-dur { font-size: 0.75rem; color: #aaa; margin-bottom: 0.5rem; }
        .sb-service-price { font-size: 1rem; font-weight: 800; color: #C9847A; }

        /* GALLERY */
        .sb-gallery { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 280px 280px; gap: 6px; margin: 3rem 0; }
        .sb-gallery-item { overflow: hidden; }
        .sb-gallery-item:first-child { grid-row: 1 / 3; }
        .sb-gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .sb-gallery-item:hover img { transform: scale(1.04); }

        /* TEAM */
        .sb-team { padding: 5rem 5%; background: #fff; }
        .sb-team-inner { max-width: 1100px; margin: 0 auto; }
        .sb-team h2 { font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; margin-bottom: 3rem; letter-spacing: -0.01em; }
        .sb-team-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
        .sb-team-card { border: 1px solid #F0E8E0; border-radius: 12px; overflow: hidden; }
        .sb-team-card img { width: 100%; height: 260px; object-fit: cover; display: block; }
        .sb-team-body { padding: 1.2rem; }
        .sb-team-name { font-size: 1rem; font-weight: 700; margin-bottom: 0.2rem; }
        .sb-team-role { font-size: 0.78rem; color: #C9847A; margin-bottom: 0.2rem; }
        .sb-team-exp { font-size: 0.75rem; color: #aaa; }

        /* BOOKING */
        .sb-booking { background: #1A1410; padding: 5rem 5%; text-align: center; }
        .sb-booking h2 { font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 700; color: #fff; margin-bottom: 0.8rem; }
        .sb-booking h2 em { color: #C9847A; font-style: italic; }
        .sb-booking p { color: rgba(255,255,255,0.4); margin-bottom: 2.5rem; font-size: 0.9rem; }
        .sb-booking-form { display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap; max-width: 800px; margin: 0 auto; }
        .sb-booking-input { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 0.85rem 1.2rem; border-radius: 7px; font-family: inherit; font-size: 0.88rem; flex: 1; min-width: 160px; }
        .sb-booking-input::placeholder { color: rgba(255,255,255,0.25); }
        .sb-booking-input:focus { outline: none; border-color: #C9847A; }
        .sb-booking-btn { background: #C9847A; color: #fff; border: none; padding: 0.85rem 2rem; border-radius: 7px; font-family: inherit; font-weight: 700; font-size: 0.88rem; cursor: pointer; white-space: nowrap; }

        /* FOOTER */
        .sb-footer { background: #0F0D0B; padding: 3rem 5%; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .sb-footer-logo { font-size: 1rem; font-weight: 700; color: #fff; letter-spacing: 0.06em; }
        .sb-footer-logo span { color: #C9847A; }
        .sb-footer-copy { font-size: 0.75rem; color: rgba(255,255,255,0.2); }

        @media (max-width: 900px) {
          .sb-nav-links { display: none; }
          .sb-hero { grid-template-columns: 1fr; }
          .sb-hero-img { height: 300px; }
          .sb-strip, .sb-services-grid, .sb-team-grid { grid-template-columns: repeat(2,1fr); }
          .sb-gallery { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
          .sb-gallery-item:first-child { grid-row: auto; grid-column: 1 / 3; height: 220px; }
          .sb-gallery-item { height: 180px; }
        }
      `}</style>

      <nav className="sb-nav">
        <div className="sb-logo">Bella<span>Studio</span></div>
        <ul className="sb-nav-links">
          <li><a href="#">Services</a></li>
          <li><a href="#">Notre équipe</a></li>
          <li><a href="#">Galerie</a></li>
          <li><a href="#">Tarifs</a></li>
        </ul>
        <button className="sb-nav-btn">Réserver →</button>
      </nav>

      <section className="sb-hero">
        <div className="sb-hero-img" />
        <div className="sb-hero-text">
          <div className="sb-hero-badge">✦ Salon premium · Paris 17e</div>
          <h1>La beauté<br />qui vous<br /><em>ressemble</em></h1>
          <p>Un salon d'exception où chaque détail est pensé pour votre bien-être. Coiffure, soin, beauté — une expérience complète.</p>
          <div className="sb-hero-stars">
            <span>★★★★★</span>
            <span>4.9/5 · 312 avis Google</span>
          </div>
          <div className="sb-btns">
            <button className="sb-btn">Prendre RDV en ligne</button>
            <button className="sb-btn-out">Voir nos services</button>
          </div>
        </div>
      </section>

      <div className="sb-strip">
        {[["500+","Clientes fidèles"],["10 ans","D'expérience"],["4.9★","Note Google"],["3","Expertes dédiées"]].map(([v,l]) => (
          <div key={l} className="sb-strip-item">
            <div className="sb-strip-val">{v}</div>
            <div className="sb-strip-label">{l}</div>
          </div>
        ))}
      </div>

      <section className="sb-services">
        <div className="sb-section-label">✦ Nos prestations</div>
        <h2>Tout pour prendre soin<br />de vous</h2>
        <div className="sb-services-grid">
          {services.map((s) => (
            <div key={s.name} className={`sb-service${selected === s.name ? " active" : ""}`} onClick={() => setSelected(s.name === selected ? null : s.name)}>
              <div className="sb-service-icon">{s.icon}</div>
              <h3>{s.name}</h3>
              <div className="sb-service-dur">⏱ {s.duration}</div>
              <div className="sb-service-price">{s.price}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ padding: "0 5%", maxWidth: 1200, margin: "0 auto" }}>
        <div className="sb-gallery">
          {[
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80",
            "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80",
            "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&q=80",
            "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80",
          ].map((url, i) => (
            <div key={i} className="sb-gallery-item">
              <img src={url} alt={`Galerie ${i+1}`} />
            </div>
          ))}
        </div>
      </div>

      <section className="sb-team">
        <div className="sb-team-inner">
          <div className="sb-section-label">✦ Notre équipe</div>
          <h2>Des expertes passionnées</h2>
          <div className="sb-team-grid">
            {team.map((m) => (
              <div key={m.name} className="sb-team-card">
                <img src={m.img} alt={m.name} />
                <div className="sb-team-body">
                  <div className="sb-team-name">{m.name}</div>
                  <div className="sb-team-role">{m.role}</div>
                  <div className="sb-team-exp">{m.exp} d&apos;expérience</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sb-booking">
        <div className="sb-section-label" style={{ color: "#C9847A" }}>✦ Réservation</div>
        <h2>Réservez votre moment<br /><em>bien-être</em></h2>
        <p>Disponible 7j/7 · Confirmation instantanée · Annulation gratuite 24h avant</p>
        <div className="sb-booking-form">
          <input className="sb-booking-input" placeholder="Votre prénom" />
          <input className="sb-booking-input" placeholder="Prestation souhaitée" />
          <input className="sb-booking-input" type="date" />
          <button className="sb-booking-btn">Réserver →</button>
        </div>
      </section>

      <footer className="sb-footer">
        <div className="sb-footer-logo">Bella<span>Studio</span></div>
        <div className="sb-footer-copy">© 2024 BellaStudio · Paris 17e · Tous droits réservés</div>
      </footer>
    </div>
  )
}
