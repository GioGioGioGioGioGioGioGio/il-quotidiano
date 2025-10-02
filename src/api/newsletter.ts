// API route per la newsletter
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  try {
    if (path.includes('/subscribers')) {
      // Get all subscribers
      const subscribers = await prisma.newsletterSubscriber.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return Response.json(subscribers);
    }
  } catch (error) {
    console.error('Error fetching newsletter data:', error);
    return Response.json({ error: 'Failed to fetch newsletter data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    
    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });
    
    if (existing) {
      return Response.json({ error: 'Email already subscribed' }, { status: 400 });
    }
    
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        isActive: true,
      }
    });
    
    return Response.json(subscriber);
  } catch (error) {
    console.error('Error creating subscriber:', error);
    return Response.json({ error: 'Failed to create subscriber' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  
  if (!id) {
    return Response.json({ error: 'Subscriber ID required' }, { status: 400 });
  }
  
  try {
    await prisma.newsletterSubscriber.delete({
      where: { id }
    });
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return Response.json({ error: 'Failed to delete subscriber' }, { status: 500 });
  }
}
