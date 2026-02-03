"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { project, ScreenConfig } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProjectThemeAction(projectId: string, themeId: string, updatedScreenConfigs: any[]) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            throw new Error("Unauthorized");
        }

        // Update project theme
        await db.update(project)
            .set({ 
                theme: themeId,
                updatedAt: new Date()
            })
            .where(eq(project.projectId, projectId));

        // Update all screen configs with new designIntent
        // We do this in parallel for performance
        await Promise.all(updatedScreenConfigs.map(async (screen) => {
             await db.update(ScreenConfig)
                .set({
                    designIntent: screen.designIntent,
                    updatedAt: new Date()
                })
                .where(eq(ScreenConfig.id, screen.id));
        }));

        revalidatePath(`/dashboard/project/${projectId}`);
        
        return { success: true };
    } catch (error) {
        console.error("Failed to update project theme:", error);
        return { success: false, error: "Failed to update theme" };
    }
}
