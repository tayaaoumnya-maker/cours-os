"use client"

import { useState } from "react"

const botResponses: Record<string, string> = {
  "bonjour": "Bonjour ! 👋 Je suis l'assistant virtuel de votre boutique. Comment puis-je vous aider aujourd'hui ?",
  "tarif": "Nos tarifs démarrent à 29€/mois. Souhaitez-vous que je vous envoie notre grille tarifaire complète ?",
  "rdv": "Parfait ! Je peux vous réserver un créneau. Êtes-vous disponible cette semaine ou la semaine prochaine ?",
  "info": "Bien sûr ! Je peux vous renseigner sur nos services, tarifs, délais de livraison ou toute autre question. Que souhaitez-vous savoir ?",
  "default": "Merci pour votre message ! Un conseiller va prendre en charge votre demande très prochainement. ⚡ Temps de réponse moyen : 2 min.",
}

const suggestions = ["Voir les tarifs", "Prendre RDV", "En savoir plus", "Parler à un conseiller"]

type Message = { from: "user" | "bot"; text: string; time: string }

export default function BotIADemo() {
  const now = new Date()
  const fmt = (d: Date) => d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Bonjour ! 👋 Je suis Alex, votre assistant IA. Comment puis-je vous aider ?", time: fmt(now) },
    { from: "bot", text: "Je peux répondre à vos questions, vous aider à trouver un produit ou réserver un rendez-vous. 🚀", time: fmt(now) },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)

  function send(text: string) {
    if (!text.trim()) return
    const t = fmt(new Date())
    setMessages((m) => [...m, { from: "user", text, time: t }])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      const key = Object.keys(botResponses).find((k) => text.toLowerCase().includes(k)) || "default"
      setMessages((m) => [...m, { from: "bot", text: botResponses[key], time: fmt(new Date()) }])
      setTyping(false)
    }, 1200)
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#f1f5f9", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .back-btn {
          position: fixed; top: 16px; left: 16px; z-index: 100;
          background: linear-gradient(135deg, #EC4899, #2563EB); color: #fff;
          border: none; cursor: pointer; padding: 0.5rem 1.1rem; border-radius: 8px;
          font-weight: 700; font-size: 0.82rem; text-decoration: none; display: inline-block;
        }
        .page { display: flex; gap: 2rem; align-items: flex-start; padding: 2rem;
          max-width: 1100px; width: 100%; margin: 0 auto; }

        /* Site mock */
        .site-mock {
          flex: 1; background: #fff; border-radius: 16px;
          overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1);
          min-height: 560px; position: relative;
        }
        .site-header { background: #1a1a2e; color: #fff; padding: 18px 24px;
          display: flex; align-items: center; justify-content: space-between; }
        .site-logo { font-weight: 900; font-size: 1.1rem; }
        .site-logo span { color: #EC4899; }
        .site-nav { display: flex; gap: 1.5rem; font-size: 0.82rem; opacity: 0.7; }
        .site-hero { padding: 3rem 2rem; text-align: center;
          background: linear-gradient(135deg, #f8fafc, #eff6ff); }
        .site-hero h2 { font-size: 1.8rem; font-weight: 900; margin-bottom: 0.8rem; }
        .site-hero p { color: #64748b; max-width: 400px; margin: 0 auto 1.5rem; }
        .site-cta { background: linear-gradient(135deg, #EC4899, #2563EB);
          color: #fff; border: none; border-radius: 8px; padding: 0.75rem 2rem;
          font-weight: 700; cursor: pointer; }
        .site-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding: 1.5rem 2rem; }
        .site-card { background: #f8fafc; border-radius: 10px; padding: 1.2rem;
          border: 1px solid rgba(15,23,42,0.07); }
        .site-card-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .site-card-title { font-weight: 700; font-size: 0.88rem; margin-bottom: 0.3rem; }
        .site-card-desc { font-size: 0.78rem; color: #64748b; }

        /* Chat widget */
        .chat-widget {
          width: 360px; flex-shrink: 0;
          background: #fff; border-radius: 20px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.15);
          overflow: hidden; display: flex; flex-direction: column;
          height: 560px;
        }
        .chat-header {
          background: linear-gradient(135deg, #EC4899, #2563EB);
          padding: 16px 18px; display: flex; align-items: center; gap: 12px;
        }
        .chat-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: rgba(255,255,255,0.2); display: flex; align-items: center;
          justify-content: center; font-size: 1.2rem; flex-shrink: 0;
        }
        .chat-header-info { flex: 1; }
        .chat-header-name { color: #fff; font-weight: 800; font-size: 0.95rem; }
        .chat-header-status { color: rgba(255,255,255,0.8); font-size: 0.72rem;
          display: flex; align-items: center; gap: 4px; }
        .chat-header-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ADE80; }
        .chat-messages {
          flex: 1; overflow-y: auto; padding: 16px; display: flex;
          flex-direction: column; gap: 12px; background: #f8fafc;
        }
        .msg { display: flex; gap: 8px; align-items: flex-end; }
        .msg.user { flex-direction: row-reverse; }
        .msg-bubble {
          max-width: 75%; padding: 10px 14px; border-radius: 18px;
          font-size: 0.85rem; line-height: 1.5;
        }
        .msg.bot .msg-bubble { background: #fff; color: #0f172a;
          border: 1px solid rgba(15,23,42,0.08); border-bottom-left-radius: 4px; }
        .msg.user .msg-bubble {
          background: linear-gradient(135deg, #EC4899, #2563EB);
          color: #fff; border-bottom-right-radius: 4px;
        }
        .msg-time { font-size: 0.65rem; color: #94a3b8; }
        .msg-avatar { width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #EC4899, #2563EB);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; color: #fff; flex-shrink: 0; }
        .typing-dot { display: flex; gap: 4px; padding: 10px 14px; background: #fff;
          border-radius: 18px; width: fit-content; border: 1px solid rgba(15,23,42,0.08); }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: #94a3b8;
          animation: bounce 1.2s infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
        .chat-suggestions { padding: 8px 12px; display: flex; gap: 6px; flex-wrap: wrap;
          background: #fff; border-top: 1px solid rgba(15,23,42,0.06); }
        .suggestion { background: rgba(37,99,235,0.07); border: 1px solid rgba(37,99,235,0.18);
          color: #2563EB; font-size: 0.75rem; font-weight: 600; padding: 0.3rem 0.8rem;
          border-radius: 99px; cursor: pointer; transition: background 0.2s; }
        .suggestion:hover { background: rgba(37,99,235,0.15); }
        .chat-input-row { display: flex; gap: 8px; padding: 12px; border-top: 1px solid rgba(15,23,42,0.07); }
        .chat-input { flex: 1; border: 1.5px solid rgba(15,23,42,0.12); border-radius: 99px;
          padding: 0.55rem 1rem; font-size: 0.85rem; outline: none; font-family: inherit; }
        .chat-input:focus { border-color: #2563EB; }
        .chat-send { background: linear-gradient(135deg, #EC4899, #2563EB);
          color: #fff; border: none; border-radius: 50%; width: 38px; height: 38px;
          cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; }
      `}</style>

      <a href="/trust-aura/services" className="back-btn">← Retour aux services</a>

      <div className="page">
        {/* Site mock */}
        <div className="site-mock">
          <div className="site-header">
            <div className="site-logo">Mon<span>Business</span></div>
            <div className="site-nav"><span>Services</span><span>À propos</span><span>Contact</span></div>
          </div>
          <div className="site-hero">
            <h2>Bienvenue sur <span style={{ color: "#EC4899" }}>MonBusiness</span></h2>
            <p>Votre partenaire de confiance. Découvrez nos services et obtenez un devis en quelques secondes grâce à notre assistant IA.</p>
            <button className="site-cta">Découvrir nos services</button>
          </div>
          <div className="site-cards">
            {[
              { icon: "🚀", title: "Service Premium", desc: "Accompagnement personnalisé" },
              { icon: "💡", title: "Consultation", desc: "Experts disponibles 24h/24" },
              { icon: "📈", title: "Croissance", desc: "Résultats mesurables" },
            ].map((c) => (
              <div key={c.title} className="site-card">
                <div className="site-card-icon">{c.icon}</div>
                <div className="site-card-title">{c.title}</div>
                <div className="site-card-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat widget */}
        <div className="chat-widget">
          <div className="chat-header">
            <div className="chat-avatar">🤖</div>
            <div className="chat-header-info">
              <div className="chat-header-name">Alex — Assistant IA</div>
              <div className="chat-header-status">
                <div className="chat-header-dot" />
                En ligne · Répond en quelques secondes
              </div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}>
                {m.from === "bot" && <div className="msg-avatar">🤖</div>}
                <div>
                  <div className="msg-bubble">{m.text}</div>
                  <div className="msg-time">{m.time}</div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="msg bot">
                <div className="msg-avatar">🤖</div>
                <div className="typing-dot">
                  <div className="dot" /><div className="dot" /><div className="dot" />
                </div>
              </div>
            )}
          </div>

          <div className="chat-suggestions">
            {suggestions.map((s) => (
              <button key={s} className="suggestion" onClick={() => send(s)}>{s}</button>
            ))}
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Écrire un message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
            />
            <button className="chat-send" onClick={() => send(input)}>➤</button>
          </div>
        </div>
      </div>
    </div>
  )
}
