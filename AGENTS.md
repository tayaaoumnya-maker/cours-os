# AGENTS.md — Cours OS

Guide for AI agents (Claude Code, Codex, etc.) working on this codebase.

---

## AI Team

### Sylvia — System Architect
- Responsable de l'architecture globale
- Décide structure des dossiers et modules
- Ne code pas les composants
- Valide toute décision structurelle

### Camelia — Frontend Engineer
- Implémente les interfaces
- Suit strictement les specs de Sylvia
- Ne modifie pas l'architecture

### Amaya — QA & Reliability
- Teste les features
- Identifie bugs et incohérences
- Valide avant déploiement

### Alaia — Product Strategist
- Définit roadmap
- Priorise les fonctionnalités
- Optimise pour valeur business

---

## Global Security & Execution Policy

### 1. Legal Compliance (Non-Negotiable)
- No illegal actions
- No scraping or automation that violates Terms of Service
- No access to protected platforms without explicit authorization
- No bypassing paywalls, authentication systems, or security protections

### 2. System Protection Rules
Agents MUST NOT:
- Execute system-level commands (`sudo`, `rm -rf` outside project, `chmod` system paths, etc.)
- Modify files outside the project directory
- Access `/System`, `/Library`, `/Users`, or other OS directories
- Install global packages
- Run unknown external scripts
- Launch background processes without explicit approval
- Change system settings or network configuration

### 3. Execution Scope Limitation
Agents MAY ONLY:
- Create, edit, delete files inside the project repository
- Modify application code within the repo
- Run local project scripts (`npm run dev`, `npm run build`)
- Use dependencies already declared in `package.json`

Agents MAY NOT:
- Install new dependencies without approval
- Perform external API calls unless explicitly approved
- Execute arbitrary shell commands
- Access environment variables not defined in the project

---

## Approval Policies

### Auto-Execution Policy
- **Condition:** Proposal risk level = low AND no schema change
- **Effect:** Strategy can approve and trigger implementation without CEO validation
- **Applies to:** AI_Research proposals, UX improvements
- **Excludes:** Any change touching `lib/db.ts`, new dependencies, or external integrations

### Risk Assessment Protocol
- Risk level must be justified with exactly 3 bullet points
- Security can override any risk classification at any time
- A false low-risk classification permanently removes auto-approval privilege from the submitting agent

---

## Level 4 — Support Agents

### UX
- Role: Optimise expérience utilisateur
- Reports to: Product (Alaia)
- Can decide on: UI improvements
- Cannot override: Strategy, CEO
- Status: active

### AI_Research
- Role: Recherche IA & veille technologique
- Reports to: Strategy
- Can propose: New tools & automation
- Cannot deploy without: CEO approval
- Status: active

### Security
- Role: Sécurité système & conformité
- Reports to: Ops
- Can block: Non-compliant deployments
- Cannot change: Product roadmap
- Status: active

---

## Project Overview

**Cours OS** is a local personal dashboard for organizing SMMA and e-commerce course notes. Runs entirely on the user's machine — no cloud, no auth, no public access.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + dark premium theme |
| UI Components | Radix UI / ShadCN custom |
| Database | SQLite via `better-sqlite3` (local) |
| PDF parsing | pdf-parse |

---

## Project Structure

```
cours-os/
├── app/
│   ├── api/
│   │   ├── notes/
│   │   │   ├── route.ts            # GET /api/notes?category=
│   │   │   └── [id]/route.ts       # GET / PUT / DELETE /api/notes/:id
│   │   └── upload/
│   │       └── route.ts            # POST /api/upload (multipart)
│   ├── notes/
│   │   ├── layout.tsx              # Layout avec Sidebar
│   │   ├── page.tsx                # Dashboard principal
│   │   └── [id]/page.tsx           # Vue détail d'une note
│   ├── layout.tsx
│   ├── page.tsx                    # Redirect → /notes
│   └── globals.css
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx             # Sidebar fixe — catégories
│   ├── notes/
│   │   ├── NoteCard.tsx            # Carte compacte (grille)
│   │   ├── NoteCardFeatured.tsx    # Carte large (récentes)
│   │   ├── NoteDetail.tsx          # Affichage sections structurées
│   │   ├── NoteActions.tsx         # Boutons modifier / supprimer
│   │   ├── NoteList.tsx            # Liste avec état vide
│   │   ├── TableOfContents.tsx     # TOC sticky avec active state
│   │   └── UploadZone.tsx          # Drag & drop PDF
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       └── dialog.tsx
├── lib/
│   ├── db.ts                       # SQLite — schema, CRUD, stats
│   ├── parser.ts                   # Extraction PDF + structuration
│   └── utils.ts                    # cn(), formatDate, couleurs catégories
├── types/
│   └── index.ts                    # Types centralisés
├── data/                           # cours-os.db (auto-créé)
└── uploads/                        # PDFs stockés localement (auto-créé)
```

---

## Note Structure (Parser)

Chaque PDF est structuré automatiquement en :
1. **Titre** — première ligne non vide
2. **Sous-titre** — deuxième ligne courte (si détectée)
3. **Introduction** — contenu avant le premier chapitre
4. **Chapitres** — sections détectées par numérotation ou caps
5. **Conclusion** — détectée par mots-clés (`conclusion`, `synthèse`, `à retenir`…)

---

## Coding Conventions

- **TypeScript strict** — toujours typer paramètres et retours
- **App Router only** — Server Components par défaut, `"use client"` uniquement si nécessaire
- **Pas d'import `lib/db.ts` côté client** — toujours passer par les routes API
- **Tailwind uniquement** pour le styling
- **Pas d'ORM** — queries directes `better-sqlite3`

---

## Adding a New Module

1. `app/<module>/page.tsx` — page UI
2. `app/api/<module>/route.ts` — API handler
3. Tables dans `lib/db.ts`
4. Types dans `types/index.ts`
5. Entrée nav dans `components/layout/Sidebar.tsx`

---

## Running the Project

```bash
npm install
npm run dev       # http://localhost:3000
```

---

## Constraints

- Local uniquement — pas d'API externe, pas de cloud
- Usage personnel — pas de multi-utilisateurs
- Données dans `data/cours-os.db`, PDFs dans `uploads/`
