# App — CAF & Patronato in Tasca

PWA (Progressive Web App) del progetto: si installa sullo smartphone dal browser, senza app store.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS + design system custom (palette viola `#8c34ea`, navy `#181d4a`)
- PWA: `public/manifest.webmanifest` + `public/sw.js` (cache-first, offline-ready)
- Persistenza demo: `localStorage` (in produzione: backend cloud)

## Avvio in locale

```bash
npm install
npm run dev      # sviluppo su http://localhost:3000
npm run build    # build di produzione in dist/
npm run preview  # serve la build
```

## Struttura

```
src/
├── data/services.ts      # catalogo servizi (CAF, Patronato, Immigrazione, Digitale)
├── lib/
│   ├── assistant.ts      # motore dell'Assistente IA (matching on-device, prototipo)
│   ├── store.ts          # stato + persistenza locale (profilo, pratiche, appuntamenti)
│   └── utils.ts
├── pages/
│   ├── Onboarding.tsx    # lingua, nome, accesso SPID/CIE (demo)
│   ├── Home.tsx          # dashboard: pratiche, scadenze, servizi rapidi
│   ├── Assistant.tsx     # finestra IA cognitiva (chat + scenari guidati)
│   ├── Services.tsx      # catalogo con ricerca
│   ├── ServiceDetail.tsx # scheda servizio: documenti, passi, avvio pratica
│   ├── Practices.tsx     # pratiche con timeline di stato
│   ├── NewPractice.tsx   # wizard pratica: checklist, upload, invio
│   ├── Appointments.tsx  # prenotazione appuntamenti
│   └── ProfilePage.tsx   # lingua, accessibilità, privacy
└── App.tsx               # shell + navigazione a schede
```

## Note

- Le icone PWA (`public/icons/`) si generano con lo script Python in `docs/` o con qualsiasi editor (soggetto: casa con cuore su sfondo viola).
- L'assistente IA è un prototipo on-device con matching per keyword/scenari; l'architettura target (LLM + RAG su fonti ufficiali) è descritta in [docs/08-assistente-ia.md](../docs/08-assistente-ia.md).
