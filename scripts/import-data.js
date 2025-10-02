// Script per importare dati da Supabase export a PostgreSQL
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importData() {
  console.log('🔄 Importazione dati in PostgreSQL...');
  
  try {
    // Leggi file export
    const exportData = JSON.parse(fs.readFileSync('supabase-export.json', 'utf8'));
    
    console.log('📊 Dati da importare:', {
      categories: exportData.categories?.length || 0,
      profiles: exportData.profiles?.length || 0,
      articles: exportData.articles?.length || 0,
      comments: exportData.comments?.length || 0,
      subscribers: exportData.newsletter_subscribers?.length || 0,
      userRoles: exportData.user_roles?.length || 0,
    });

    // 1. Importa categorie
    if (exportData.categories?.length) {
      console.log('📁 Importando categorie...');
      for (const category of exportData.categories) {
        await prisma.category.upsert({
          where: { id: category.id },
          update: {},
          create: {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            createdAt: new Date(category.created_at),
            updatedAt: new Date(category.updated_at || category.created_at),
          },
        });
      }
      console.log(`✅ ${exportData.categories.length} categorie importate`);
    }

    // 2. Importa profili
    if (exportData.profiles?.length) {
      console.log('👤 Importando profili...');
      for (const profile of exportData.profiles) {
        await prisma.profile.upsert({
          where: { id: profile.id },
          update: {},
          create: {
            id: profile.id,
            userId: profile.user_id || profile.id,
            displayName: profile.display_name,
            avatarUrl: profile.avatar_url,
            bio: profile.bio,
            createdAt: new Date(profile.created_at),
            updatedAt: new Date(profile.updated_at || profile.created_at),
          },
        });
      }
      console.log(`✅ ${exportData.profiles.length} profili importati`);
    }

    // 3. Importa articoli
    if (exportData.articles?.length) {
      console.log('📰 Importando articoli...');
      for (const article of exportData.articles) {
        // Verifica che categoria e autore esistano
        const categoryExists = await prisma.category.findUnique({
          where: { id: article.category_id }
        });
        const authorExists = await prisma.profile.findUnique({
          where: { id: article.author_id }
        });

        if (categoryExists && authorExists) {
          await prisma.article.upsert({
            where: { id: article.id },
            update: {},
            create: {
              id: article.id,
              title: article.title,
              subtitle: article.subtitle,
              slug: article.slug,
              excerpt: article.excerpt,
              content: article.content,
              featuredImage: article.featured_image,
              status: article.status || 'draft',
              isFeatured: article.is_featured || false,
              isBreaking: article.is_breaking || false,
              readTime: article.read_time || 5,
              viewsCount: article.views_count || 0,
              publishedAt: article.published_at ? new Date(article.published_at) : null,
              createdAt: new Date(article.created_at),
              updatedAt: new Date(article.updated_at || article.created_at),
              categoryId: article.category_id,
              authorId: article.author_id,
            },
          });
        } else {
          console.log(`⚠️ Articolo ${article.title} saltato - categoria o autore mancante`);
        }
      }
      console.log(`✅ Articoli importati`);
    }

    // 4. Importa commenti
    if (exportData.comments?.length) {
      console.log('💬 Importando commenti...');
      for (const comment of exportData.comments) {
        // Verifica che articolo e autore esistano
        const articleExists = await prisma.article.findUnique({
          where: { id: comment.article_id }
        });
        const authorExists = await prisma.profile.findUnique({
          where: { id: comment.author_id }
        });

        if (articleExists && authorExists) {
          await prisma.comment.upsert({
            where: { id: comment.id },
            update: {},
            create: {
              id: comment.id,
              content: comment.content,
              status: comment.status || 'pending',
              createdAt: new Date(comment.created_at),
              updatedAt: new Date(comment.updated_at || comment.created_at),
              articleId: comment.article_id,
              authorId: comment.author_id,
            },
          });
        }
      }
      console.log(`✅ ${exportData.comments.length} commenti importati`);
    }

    // 5. Importa iscritti newsletter
    if (exportData.newsletter_subscribers?.length) {
      console.log('📧 Importando iscritti newsletter...');
      for (const subscriber of exportData.newsletter_subscribers) {
        await prisma.newsletterSubscriber.upsert({
          where: { id: subscriber.id },
          update: {},
          create: {
            id: subscriber.id,
            email: subscriber.email,
            isActive: subscriber.is_active ?? true,
            subscribedAt: new Date(subscriber.subscribed_at || subscriber.created_at),
          },
        });
      }
      console.log(`✅ ${exportData.newsletter_subscribers.length} iscritti importati`);
    }

    // 6. Importa ruoli utenti
    if (exportData.user_roles?.length) {
      console.log('🔐 Importando ruoli utenti...');
      for (const userRole of exportData.user_roles) {
        const userExists = await prisma.profile.findUnique({
          where: { id: userRole.user_id }
        });

        if (userExists) {
          await prisma.userRole.upsert({
            where: { 
              id: userRole.id
            },
            update: {},
            create: {
              id: userRole.id,
              role: userRole.role,
              userId: userRole.user_id,
              createdAt: new Date(userRole.created_at),
            },
          });
        }
      }
      console.log(`✅ ${exportData.user_roles.length} ruoli importati`);
    }

    console.log('🎉 Importazione completata con successo!');
    
  } catch (error) {
    console.error('❌ Errore durante importazione:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
