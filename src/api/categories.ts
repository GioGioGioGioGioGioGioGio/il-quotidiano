// API route per le categorie
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    return Response.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;
    
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
      }
    });
    
    return Response.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return Response.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
