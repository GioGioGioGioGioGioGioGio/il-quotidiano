// Script per esportare dati da Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Carica variabili ambiente dal file .env
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function exportData() {
  console.log('🔄 Esportazione dati da Supabase...');
  
  try {
    // Esporta categorie
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .order('created_at');
    
    // Esporta articoli
    const { data: articles } = await supabase
      .from('articles')
      .select('*')
      .order('created_at');
    
    // Esporta profili
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*');
    
    // Esporta commenti
    const { data: comments } = await supabase
      .from('comments')
      .select('*')
      .order('created_at');
    
    // Esporta iscritti newsletter
    const { data: subscribers } = await supabase
      .from('newsletter_subscribers')
      .select('*');
    
    // Esporta ruoli utenti
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('*');

    const exportData = {
      categories: categories || [],
      articles: articles || [],
      profiles: profiles || [],
      comments: comments || [],
      newsletter_subscribers: subscribers || [],
      user_roles: userRoles || [],
      exported_at: new Date().toISOString()
    };

    // Salva in file JSON
    fs.writeFileSync('supabase-export.json', JSON.stringify(exportData, null, 2));
    
    console.log('✅ Dati esportati in supabase-export.json');
    console.log(`📊 Statistiche:
    - Categorie: ${categories?.length || 0}
    - Articoli: ${articles?.length || 0}
    - Profili: ${profiles?.length || 0}
    - Commenti: ${comments?.length || 0}
    - Iscritti: ${subscribers?.length || 0}
    - Ruoli: ${userRoles?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Errore durante esportazione:', error);
  }
}

exportData();
