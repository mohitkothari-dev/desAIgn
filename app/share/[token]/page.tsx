import { notFound } from "next/navigation";
import { db } from "@/db";
import { ShareLink, project, ScreenConfig } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import SharedCanvas from "./shared-canvas";
import { ProjectProvider } from "@/app/dashboard/project/[projectId]/project-context";
import { ProjectType, ScreenConfigType } from "@/type/types";

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params;

  if (!token) {
    notFound();
  }

  try {
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
      notFound();
    }

    // Get project data
    const [projectData] = await db
      .select()
      .from(project)
      .where(eq(project.id, shareLink.projectId));

    if (!projectData) {
      notFound();
    }

    // Get screen configurations
    const screenConfigs = await db
      .select()
      .from(ScreenConfig)
      .where(eq(ScreenConfig.projectId, shareLink.projectId));

    return (
      <ProjectProvider 
        initialProject={projectData as unknown as ProjectType} 
        initialScreenConfigs={screenConfigs as unknown as ScreenConfigType[]}
      >
        <SharedCanvas
          project={{
            id: projectData.id,
            projectName: projectData.projectName ?? '',
            device: projectData.device === 'mobile' || projectData.device === 'website' ? projectData.device : 'website',
            theme: projectData.theme ?? '',
            userInput: projectData.userInput ?? '',
            createdAt: projectData.createdAt,
          }}
          screenConfigs={screenConfigs.map(c => ({
            id: c.id,
            screenName: c.screenName ?? '',
            purpose: c.purpose ?? '',
            screenDescription: c.screenDescription ?? '',
            designIntent: c.designIntent,
          }))}
          shareInfo={{
            expiresAt: shareLink.expiresAt ?? new Date(),
            createdAt: shareLink.createdAt,
          }}
        />
      </ProjectProvider>
    );

  } catch (error) {
    console.error('Error loading shared canvas:', error);
    notFound();
  }
}