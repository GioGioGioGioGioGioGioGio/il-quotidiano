# 🚀 Migrazione da Supabase a PostgreSQL

Guida completa per migrare "Il Quotidiano" da Supabase a PostgreSQL esterno.

## 📋 Prerequisiti

- Node.js 18+
- Account PostgreSQL (Neon, Railway, DigitalOcean, etc.)
- Accesso ai dati Supabase esistenti

## 🔧 Step 1: Setup Database PostgreSQL

### Opzione A: Neon (Consigliato)
1. Vai su [neon.tech](https://neon.tech)
2. Crea account gratuito
3. Crea nuovo progetto "il-quotidiano"
4. Copia la connection string dal dashboard

### Opzione B: Railway
1. Vai su [railway.app](https://railway.app)
2. Crea nuovo progetto
3. Aggiungi servizio PostgreSQL
4. Copia connection string dalle variabili

### Opzione C: DigitalOcean
1. Vai su DigitalOcean Managed Databases
2. Crea cluster PostgreSQL
3. Configura utente e database
4. Copia connection string

## 🛠 Step 2: Installa Dipendenze

```bash
# Installa Prisma e dipendenze
npm install @prisma/client prisma

# Installa dipendenze per script
npm install
```

## ⚙️ Step 3: Configura Environment

```bash
# Copia e modifica .env
cp .env.example .env

# Aggiungi la tua connection string PostgreSQL
DATABASE_URL="postgresql://username:password@hostname:port/database"
```

## 📤 Step 4: Esporta Dati da Supabase

```bash
# Esporta tutti i dati da Supabase
npm run export:supabase
```

Questo creerà un file `supabase-export.json` con tutti i tuoi dati.

## 🗄️ Step 5: Setup Schema PostgreSQL

```bash
# Genera client Prisma
npm run db:generate

# Crea schema nel database
npm run db:push
```

## 📥 Step 6: Importa Dati

```bash
# Importa tutti i dati nel nuovo database
npm run import:data
```

## 🔄 Step 7: Aggiorna Codice Applicazione

### Sostituisci Supabase Client con Prisma

Crea nuovo file `src/lib/database.ts`:

```typescript
import { prisma } from './prisma';

// Esempio: Fetch articoli
export async function getArticles(options?: {
  status?: 'draft' | 'published' | 'review' | 'archived';
  categoryId?: string;
  limit?: number;
}) {
  return await prisma.article.findMany({
    where: {
      status: options?.status,
      categoryId: options?.categoryId,
    },
    include: {
      category: true,
      author: true,
      _count: {
        select: { comments: true }
      }
    },
    take: options?.limit,
    orderBy: { createdAt: 'desc' }
  });
}

// Esempio: Crea articolo
export async function createArticle(data: {
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  status?: 'draft' | 'published';
}) {
  return await prisma.article.create({
    data: {
      ...data,
      slug: generateSlug(data.title),
      status: data.status || 'draft',
    }
  });
}
```

### Aggiorna Hooks

Modifica `src/hooks/useArticles.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { getArticles } from '@/lib/database';

export const useArticles = (options?: {
  status?: 'draft' | 'published' | 'review' | 'archived';
  categoryId?: string;
  limit?: number;
}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles(options);
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [options]);

  return { articles, loading };
};
```

## 🧪 Step 8: Test Migrazione

```bash
# Avvia server sviluppo
npm run dev

# Apri Prisma Studio per verificare dati
npm run db:studio
```

## ✅ Step 9: Verifica Funzionalità

Testa tutte le funzionalità:

- [ ] Homepage carica articoli
- [ ] Ricerca funziona
- [ ] CMS carica dati
- [ ] Creazione/modifica articoli
- [ ] Commenti funzionano
- [ ] Newsletter funziona
- [ ] Autenticazione (se migrata)

## 🚀 Step 10: Deploy

### Aggiorna Variabili Ambiente Production

```bash
# Nel tuo servizio di hosting (Vercel, Netlify, etc.)
DATABASE_URL="postgresql://prod-connection-string"
```

### Deploy Database Schema

```bash
# Se usi migrations
npm run db:migrate

# O push diretto
npm run db:push
```

## 🔧 Troubleshooting

### Errore Connection String
```bash
# Verifica formato
DATABASE_URL="postgresql://user:password@host:port/db?sslmode=require"
```

### Errore Import Dati
```bash
# Verifica file export esiste
ls -la supabase-export.json

# Controlla log errori
npm run import:data 2>&1 | tee import.log
```

### Schema Mismatch
```bash
# Reset database e ricrea
npm run db:push --force-reset
npm run import:data
```

## 📊 Vantaggi Post-Migrazione

✅ **Performance**: Query più veloci con Prisma
✅ **Type Safety**: Tipizzazione completa
✅ **Migrations**: Versioning schema
✅ **Flexibility**: Controllo completo database
✅ **Scaling**: Facile scaling orizzontale

## 🆘 Supporto

Se incontri problemi:

1. Controlla i log di errore
2. Verifica connection string
3. Assicurati che tutti i dati siano esportati
4. Controlla che le relazioni siano corrette

La migrazione dovrebbe completarsi senza perdita di dati!
