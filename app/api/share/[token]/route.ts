import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { ShareLink, project, ScreenConfig } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Find valid share link
    const [shareLink] = await db
      .select()
      .from(ShareLink)
      .where(
        and(
          eq(ShareLink.shareToken, token),
          eq(ShareLink.isActive, true),
          gt(ShareLink.expiresAt, new Date())
        )
      );

    if (!shareLink) {
      return NextResponse.json({ error: 'Invalid or expired share link' }, { status: 404 });
    }

    // Get project data
    const [projectData] = await db
      .select()
      .from(project)
      .where(eq(project.id, shareLink.projectId));

    if (!projectData) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get screen configurations
    const screenConfigs = await db
      .select()
      .from(ScreenConfig)
      .where(eq(ScreenConfig.projectId, shareLink.projectId));

    // Return data in read-only format
    return NextResponse.json({
      project: {
        id: projectData.id,
        projectName: projectData.projectName,
        device: projectData.device,
        theme: projectData.theme,
        userInput: projectData.userInput,
        createdAt: projectData.createdAt,
      },
      screenConfigs: screenConfigs.map(config => ({
        id: config.id,
        screenName: config.screenName,
        purpose: config.purpose,
        screenDescription: config.screenDescription,
        designIntent: config.designIntent,
      })),
      shareInfo: {
        expiresAt: shareLink.expiresAt,
        createdAt: shareLink.createdAt,
      }
    });

  } catch (error) {
    console.error('Error retrieving shared canvas:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}