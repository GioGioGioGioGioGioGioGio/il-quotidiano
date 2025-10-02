// API route per gli articoli
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  
  try {
    if (id && id !== 'articles') {
      // Get single article
      const article = await prisma.article.findUnique({
        where: { id },
        include: {
          category: true,
          author: true,
        }
      });
      
      if (!article) {
        return Response.json({ error: 'Article not found' }, { status: 404 });
      }
      
      return Response.json(article);
    } else {
      // Get all articles
      const articles = await prisma.article.findMany({
        include: {
          category: true,
          author: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return Response.json(articles);
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    return Response.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const article = await prisma.article.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        featuredImage: body.featuredImage,
        status: body.status,
        isFeatured: body.isFeatured,
        isBreaking: body.isBreaking,
        readTime: body.readTime,
        categoryId: body.categoryId,
        authorId: body.authorId,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      },
      include: {
        category: true,
        author: true,
      }
    });
    
    return Response.json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    return Response.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  
  if (!id) {
    return Response.json({ error: 'Article ID required' }, { status: 400 });
  }
  
  try {
    const body = await request.json();
    
    const article = await prisma.article.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        featuredImage: body.featuredImage,
        status: body.status,
        isFeatured: body.isFeatured,
        isBreaking: body.isBreaking,
        readTime: body.readTime,
        categoryId: body.categoryId,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      },
      include: {
        category: true,
        author: true,
      }
    });
    
    return Response.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    return Response.json({ error: 'Failed to update article' }, { status: 500 });
  }
}
