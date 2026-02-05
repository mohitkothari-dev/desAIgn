import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ScreenConfig, project } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { generateText } from "ai";
import { activeGeminiModel } from "@/lib/gemini";
import { MOBILE_DESIGN_PROMPT, WEBSITE_DESIGN_PROMPT } from "@/lib/prompt";

export async function POST(req: NextRequest) {
    try {
        const { projectId, screenId, userInput } = await req.json();

        // 1. Fetch current screen and project details
        const [currentScreen] = await db.select()
            .from(ScreenConfig)
            .where(and(eq(ScreenConfig.id, screenId), eq(ScreenConfig.projectId, projectId)))
            .limit(1);

        if (!currentScreen) {
            return NextResponse.json({ error: "Screen not found" }, { status: 404 });
        }

        const [currentProject] = await db.select()
            .from(project)
            .where(eq(project.id, projectId))
            .limit(1);

        if (!currentProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const device = currentProject.device || 'desktop';
        const systemPrompt = (device === "mobile" || device === "tablet")
            ? MOBILE_DESIGN_PROMPT
            : WEBSITE_DESIGN_PROMPT;

        // 2. Prepare the prompt for regeneration
        const prompt = `
──────────────
TASK: REGENERATE SCREEN
──────────────
You are task with regenerating a specific screen for an existing project.

PROJECT CONTEXT:
- Project Name: ${currentProject.projectName}
- Project Description: ${currentProject.projectDescription}
- Device: ${device}

CURRENT SCREEN:
- Name: ${currentScreen.screenName}
- Purpose: ${currentScreen.purpose}
- Current Design Intent: ${JSON.stringify(currentScreen.designIntent)}

USER'S REGENERATION INSTRUCTIONS:
${userInput || "Regenerate the screen to improve its design and functionality while maintaining consistency with the project."}

INSTRUCTIONS:
1. Maintain the existing 'designSystem' if possible, or improve it if it helps the design.
2. Regenerate the 'screens' array to contain ONLY THIS ONE SCREEN.
3. Focus on the user's specific instructions if provided.
4. Return ONLY valid JSON matching the designIntent structure.
`;

        const { text } = await generateText({
            model: activeGeminiModel,
            system: systemPrompt,
            prompt: prompt,
        });

        // 3. Parse and clean the response
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const regeneratedObject = JSON.parse(jsonString);

        // Ensure the screens array only has one screen (the regenerated one)
        const screenData = regeneratedObject.screens?.[0] || regeneratedObject;

        const updatedDesignIntent = {
            ...regeneratedObject,
            screens: [screenData]
        };

        // 4. Update the database
        await db.update(ScreenConfig)
            .set({
                designIntent: updatedDesignIntent,
                screenName: screenData.name || currentScreen.screenName,
                purpose: screenData.purpose || currentScreen.purpose,
                updatedAt: new Date(),
            })
            .where(eq(ScreenConfig.id, screenId));

        return NextResponse.json(updatedDesignIntent);

    } catch (error: any) {
        console.error("Screen regeneration failed:", error);
        return NextResponse.json({ 
            error: "Failed to regenerate screen",
            details: error.message || "Unknown error"
        }, { status: 500 });
    }
}