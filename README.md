# Il Quotidiano - Sito Web di Notizie

Un moderno sito web di notizie costruito con React, TypeScript, Tailwind CSS e Supabase.

## 🚀 Funzionalità Implementate

### ✅ Funzionalità Core
- **Homepage** con articoli in evidenza, notizie del giorno e sidebar dinamica
- **Pagine categoria** per Politica, Esteri, Economia, Sport, Cultura, Tecnologia
- **Dettaglio articolo** con contenuto completo, metadati e condivisione
- **Sistema di autenticazione** con registrazione e login
- **Gestione utenti** con ruoli (admin, editor, user)

### ✅ Funzionalità Avanzate
- **Ricerca articoli** con dialog modale e risultati in tempo reale
- **Sistema bookmark** per salvare articoli (localStorage)
- **Commenti** con moderazione e autenticazione
- **Newsletter** con iscrizione e validazione email
- **Tema dark/light** con persistenza delle preferenze
- **Statistiche sito** (articoli, visualizzazioni, iscritti)

### ✅ UX/UI Migliorata
- **Barra di progresso lettura** negli articoli
- **Back to top** button con scroll smooth
- **Design responsive** ottimizzato per mobile
- **Loading states** e skeleton loaders
- **Toast notifications** per feedback utente
- **Paginazione** per liste articoli lunghe

### ✅ Pagine Statiche
- Chi siamo
- Redazione  
- Contatti
- Pubblicità
- Privacy Policy
- Cookie Policy
- Termini e Condizioni
- Codice Etico
- Dashboard CMS (placeholder)
- Articoli Salvati

## 🛠 Tecnologie Utilizzate

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (database, auth, real-time)
- **State Management**: TanStack Query, React hooks
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Forms**: React Hook Form, Zod validation

## 📦 Installazione e Avvio

### Prerequisiti
- Node.js 18+ 
- npm o yarn

### Setup Locale

```bash
# 1. Clona il repository
git clone <repository-url>
cd inkwell-chronicle-61-main

# 2. Installa le dipendenze
npm install

# 3. Configura le variabili d'ambiente
# Il file .env è già presente con le configurazioni Supabase

# 4. Avvia il server di sviluppo
npm run dev

# 5. Apri http://localhost:8080 nel browser
```

### Script Disponibili

```bash
npm run dev          # Server di sviluppo
npm run build        # Build per produzione  
npm run preview      # Preview build locale
npm run lint         # Linting del codice
```

## 🗄 Struttura Database (Supabase)

Il progetto utilizza le seguenti tabelle:

- `articles` - Articoli con metadati, contenuto, categorie
- `categories` - Categorie degli articoli
- `profiles` - Profili utente estesi
- `user_roles` - Ruoli e permessi utente
- `comments` - Commenti agli articoli con moderazione
- `newsletter_subscribers` - Iscritti alla newsletter
- `article_views` - Tracking visualizzazioni articoli

## 🎨 Personalizzazione

### Temi e Colori
I colori sono configurati in `src/index.css` con variabili CSS per supportare tema chiaro/scuro.

### Componenti UI
Tutti i componenti UI sono in `src/components/ui/` e seguono il design system di shadcn/ui.

### Layout e Stili
- Layout responsive con Tailwind CSS
- Font: Merriweather (serif) per titoli, Inter (sans) per testo
- Palette colori ottimizzata per leggibilità

## 🚀 Deploy

### Opzione 1: Lovable (Consigliato)
1. Vai su [Lovable](https://lovable.dev/projects/e9756fe2-4b34-4735-a9fd-2697dff2efdb)
2. Clicca su Share → Publish

### Opzione 2: Netlify/Vercel
1. Esegui `npm run build`
2. Carica la cartella `dist/` sul servizio di hosting
3. Configura le variabili d'ambiente Supabase

## 🔧 Configurazione Avanzata

### Supabase Setup
Le configurazioni Supabase sono in:
- `src/integrations/supabase/client.ts` - Client setup
- `src/integrations/supabase/types.ts` - Tipi database generati
- `.env` - Variabili d'ambiente

### Autenticazione
Il sistema di auth supporta:
- Registrazione/Login con email/password
- Gestione sessioni persistenti
- Ruoli utente (admin, editor, user)
- Protezione route basata su ruoli

## 📱 Responsive Design

Il sito è completamente responsive con breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## 🔍 SEO e Performance

- Meta tags ottimizzati
- Open Graph per social sharing
- Lazy loading immagini
- Code splitting automatico con Vite
- Ottimizzazione bundle size

## 🤝 Contribuire

1. Fork del repository
2. Crea un branch per la feature (`git checkout -b feature/nuova-funzionalita`)
3. Commit delle modifiche (`git commit -m 'Aggiunge nuova funzionalità'`)
4. Push del branch (`git push origin feature/nuova-funzionalita`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT.

## 📞 Supporto

Per supporto tecnico o domande:
- Email: info@ilquotidiano.it
- GitHub Issues: [Apri un issue](https://github.com/your-repo/issues)
