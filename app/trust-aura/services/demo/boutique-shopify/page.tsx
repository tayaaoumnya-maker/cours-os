export default function BoutiqueShopifyDemo() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#fff", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .back-btn {
          position: fixed; top: 16px; left: 16px; z-index: 100;
          background: #96BF48; color: #fff; border: none; cursor: pointer;
          padding: 0.5rem 1.1rem; border-radius: 8px; font-weight: 700;
          font-size: 0.82rem; text-decoration: none; display: inline-block;
          box-shadow: 0 2px 12px rgba(150,191,72,0.4);
        }
        .shop-nav {
          position: sticky; top: 0; z-index: 50;
          background: #1a1a2e; color: #fff;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%; height: 62px;
        }
        .shop-logo { font-size: 1.3rem; font-weight: 900; letter-spacing: -0.02em; }
        .shop-logo span { color: #EC4899; }
        .shop-nav-links { display: flex; gap: 2rem; list-style: none; }
        .shop-nav-links a { color: rgba(255,255,255,0.75); text-decoration: none; font-size: 0.88rem; }
        .shop-nav-links a:hover { color: #fff; }
        .shop-cart { display: flex; align-items: center; gap: 6px; font-size: 0.88rem;
          background: #EC4899; padding: 0.45rem 1rem; border-radius: 6px; cursor: pointer; }

        /* HERO */
        .shop-hero {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #fff; padding: 80px 5%;
          display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
        }
        .shop-hero h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900;
          line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 1rem; }
        .shop-hero p { color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 2rem; }
        .shop-hero-img { border-radius: 16px; overflow: hidden; }
        .shop-hero-img img { width: 100%; height: 380px; object-fit: cover; display: block; }
        .hero-btns { display: flex; gap: 1rem; }
        .btn-primary {
          background: #EC4899; color: #fff; border: none; cursor: pointer;
          padding: 0.8rem 2rem; border-radius: 8px; font-weight: 700; font-size: 0.95rem;
        }
        .btn-outline {
          background: transparent; color: #fff;
          border: 1.5px solid rgba(255,255,255,0.3); cursor: pointer;
          padding: 0.8rem 1.6rem; border-radius: 8px; font-weight: 700; font-size: 0.95rem;
        }

        /* PRODUCTS */
        .section { padding: 4rem 5%; max-width: 1200px; margin: 0 auto; }
        .section-title { font-size: 1.6rem; font-weight: 900; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
        .section-sub { color: #64748b; margin-bottom: 2.5rem; }
        .products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .product-card { border-radius: 12px; overflow: hidden; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s; }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        .product-img { height: 220px; overflow: hidden; position: relative; }
        .product-img img { width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.3s; }
        .product-card:hover .product-img img { transform: scale(1.05); }
        .product-badge {
          position: absolute; top: 10px; left: 10px;
          background: #EC4899; color: #fff; font-size: 0.68rem; font-weight: 700;
          padding: 0.2rem 0.6rem; border-radius: 4px;
        }
        .product-info { padding: 12px; }
        .product-name { font-weight: 700; font-size: 0.92rem; margin-bottom: 4px; }
        .product-price { display: flex; align-items: center; gap: 8px; }
        .price-new { font-size: 1rem; font-weight: 900; color: #EC4899; }
        .price-old { font-size: 0.82rem; color: #94a3b8; text-decoration: line-through; }
        .product-add {
          margin-top: 10px; width: 100%; background: #1a1a2e; color: #fff;
          border: none; border-radius: 6px; padding: 0.55rem; font-weight: 700;
          font-size: 0.82rem; cursor: pointer; transition: background 0.2s;
        }
        .product-add:hover { background: #EC4899; }

        /* BANNER */
        .promo-banner {
          background: linear-gradient(135deg, #EC4899, #2563EB);
          color: #fff; text-align: center; padding: 3rem 5%;
          margin: 2rem 0;
        }
        .promo-banner h2 { font-size: 2rem; font-weight: 900; margin-bottom: 0.5rem; }
        .promo-banner p { opacity: 0.85; margin-bottom: 1.5rem; }

        /* REVIEWS */
        .reviews-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 2rem; }
        .review-card { background: #f8fafc; border-radius: 10px; padding: 1.4rem;
          border: 1px solid rgba(15,23,42,0.07); }
        .review-stars { color: #F59E0B; font-size: 0.9rem; margin-bottom: 0.6rem; }
        .review-text { font-size: 0.85rem; color: #475569; line-height: 1.6; margin-bottom: 0.8rem; }
        .review-author { font-weight: 700; font-size: 0.82rem; }

        /* FOOTER */
        .shop-footer {
          background: #1a1a2e; color: rgba(255,255,255,0.6);
          text-align: center; padding: 2rem; font-size: 0.82rem;
        }
      `}</style>

      <a href="/trust-aura/services" className="back-btn">← Retour aux services</a>

      <nav className="shop-nav">
        <div className="shop-logo">Luxe<span>Store</span></div>
        <ul className="shop-nav-links">
          <li><a href="#">Nouveautés</a></li>
          <li><a href="#">Collections</a></li>
          <li><a href="#">Promos</a></li>
          <li><a href="#">À propos</a></li>
        </ul>
        <div className="shop-cart">🛒 Panier (2)</div>
      </nav>

      <div className="shop-hero">
        <div>
          <div style={{ display: "inline-block", background: "rgba(236,72,153,0.15)", color: "#EC4899",
            fontSize: "0.75rem", fontWeight: 700, padding: "0.3rem 0.8rem", borderRadius: 99,
            marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            ✦ Nouvelle collection
          </div>
          <h1>Découvrez notre sélection <span style={{ color: "#EC4899" }}>Printemps 2025</span></h1>
          <p>Des pièces uniques, soigneusement sélectionnées pour sublimer votre style au quotidien.</p>
          <div className="hero-btns">
            <button className="btn-primary">Découvrir la collection</button>
            <button className="btn-outline">Voir les promos</button>
          </div>
        </div>
        <div className="shop-hero-img">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" alt="hero" />
        </div>
      </div>

      <div className="section">
        <div className="section-title">Nos best-sellers</div>
        <div className="section-sub">Les produits les plus appréciés par nos clients</div>
        <div className="products-grid">
          {[
            { name: "Robe Étoile Dorée", img: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80", price: "89€", old: "129€", badge: "-31%" },
            { name: "Sac Cuir Milano", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80", price: "149€", old: "199€", badge: "-25%" },
            { name: "Sneakers Urban", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", price: "119€", old: null, badge: "Nouveau" },
            { name: "Montre Prestige", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", price: "249€", old: "349€", badge: "-29%" },
          ].map((p) => (
            <div key={p.name} className="product-card">
              <div className="product-img">
                <img src={p.img} alt={p.name} />
                {p.badge && <div className="product-badge">{p.badge}</div>}
              </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div className="product-price">
                  <span className="price-new">{p.price}</span>
                  {p.old && <span className="price-old">{p.old}</span>}
                </div>
                <button className="product-add">+ Ajouter au panier</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="promo-banner">
        <h2>🎁 Livraison offerte dès 60€</h2>
        <p>Commandez maintenant et recevez votre colis en 24-48h</p>
        <button className="btn-primary">J'en profite →</button>
      </div>

      <div className="section">
        <div className="section-title">Ce que disent nos clients</div>
        <div className="reviews-grid">
          {[
            { text: "Qualité exceptionnelle, livraison ultra rapide. Je recommande sans hésiter !", author: "Sophie M.", stars: "★★★★★" },
            { text: "La boutique est magnifique et les produits correspondent parfaitement aux photos.", author: "Karim B.", stars: "★★★★★" },
            { text: "Service client au top, j'ai eu un problème et il a été résolu en moins d'une heure.", author: "Laura D.", stars: "★★★★★" },
          ].map((r) => (
            <div key={r.author} className="review-card">
              <div className="review-stars">{r.stars}</div>
              <div className="review-text">{r.text}</div>
              <div className="review-author">{r.author}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="shop-footer">
        © 2025 LuxeStore — Boutique créée par <strong style={{ color: "#EC4899" }}>Trust Aura</strong>
      </div>
    </div>
  )
}
