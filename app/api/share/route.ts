import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { ShareLink, project } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

function generateShareToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, expiresInDays = 30 } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Verify the user owns this project
    const [projectData] = await db
      .select()
      .from(project)
      .where(eq(project.id, projectId));

    if (!projectData || projectData.userId !== session.user.id) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    // Generate share token
    const shareToken = generateShareToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Create share link
    const [shareLink] = await db
      .insert(ShareLink)
      .values({
        id: crypto.randomUUID(),
        projectId,
        shareToken,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Return the shareable URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/share/${shareToken}`;

    return NextResponse.json({ 
      shareUrl, 
      shareToken, 
      expiresAt: expiresAt.toISOString() 
    });

  } catch (error) {
    console.error('Error creating share link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}