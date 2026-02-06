import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { activeGeminiModel } from "@/lib/gemini";
import { GENERATE_NEW_SCREEN_IN_EXISTING_PROJECT_PROMPT } from "@/lib/prompt";
import { db } from "@/db";
import { ScreenConfig, project } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    console.log("POST /api/generate-new-screen hit");
    try {
        const body = await request.json();
        console.log("Received request body:", JSON.stringify(body, null, 2));
        const { userInput, device, projectId } = body;

        // Fetch existing project data
        const existingProject = await db.select().from(project).where(eq(project.id, projectId));
        const existingScreens = await db.select().from(ScreenConfig).where(eq(ScreenConfig.projectId, projectId));

        if (!existingProject.length) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const projectData = existingProject[0];
        
        // Prepare existing project context with full design intent
        const existingProjectContext = {
            projectName: projectData.projectName,
            theme: projectData.theme || "AURORA_INK",
            projectVisualDescription: projectData.projectDescription || "",
            screens: existingScreens.map(screen => ({
                id: screen.id,
                name: screen.screenName,
                purpose: screen.purpose,
                layoutDescription: screen.screenDescription || "",
                designIntent: screen.designIntent || {}
            }))
        };

        console.log("Using existing project context:", JSON.stringify(existingProjectContext, null, 2));

        const systemPrompt = GENERATE_NEW_SCREEN_IN_EXISTING_PROJECT_PROMPT.replace('{deviceType}', device);

        const { text } = await generateText({
            model: activeGeminiModel,
            system: systemPrompt,
            prompt: `
────────────────────────────────────────
USER REQUEST
────────────────────────────────────────
${userInput}

────────────────────────────────────────
EXISTING PROJECT CONTEXT
────────────────────────────────────────
${JSON.stringify(existingProjectContext, null, 2)}

Generate EXACTLY ONE new screen that matches this existing project's design patterns and styling.
`,
        });

        // Clean up the response
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const newScreenData = JSON.parse(jsonString);

        console.log("Generated new screen:", JSON.stringify(newScreenData, null, 2));

        // Validate we got exactly one screen
        if (!newScreenData.screens || !Array.isArray(newScreenData.screens) || newScreenData.screens.length !== 1) {
            throw new Error("AI must return exactly one screen");
        }

        const newScreen = newScreenData.screens[0];
        
        // Validate the screen has children (UI components)
        if (!newScreen.children || !Array.isArray(newScreen.children) || newScreen.children.length === 0) {
            console.warn("Generated screen has no children array - this may result in a blank screen");
            // Add a basic container with a message if no children
            newScreen.children = [{
                type: "Container",
                variant: "default",
                children: [{
                    type: "Text",
                    variant: "body",
                    content: `This is the ${newScreen.name} screen. Add your content here.`
                }]
            }];
        }

// Variable 'newScreen' is already declared above; no need to redeclare it

        // Return the full design intent structure that the renderer expects
        const responseDesignIntent = {
            projectName: projectData.projectName,
            theme: projectData.theme || "AURORA_INK",
            projectVisualDescription: projectData.projectDescription || "",
            screens: [newScreen], // Include only the new screen
            designSystem: (existingProjectContext.screens[0]?.designIntent as any)?.designSystem || {}
        };

        // Insert the new screen into the database
        const [insertedScreen] = await db.insert(ScreenConfig).values({
            id: crypto.randomUUID(),
            projectId: projectId,
            screenName: newScreen.name || "New Screen",
            purpose: newScreen.purpose || "",
            screenDescription: newScreen.layoutDescription || "",
            designIntent: responseDesignIntent, // Store the full structure including the screens array
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning({ screenName: ScreenConfig.screenName });

        return NextResponse.json({
            success: true,
            screen: insertedScreen,
            designIntent: responseDesignIntent
        });

    } catch (error: any) {
        console.error("Add screen to project failed Detailed Error:", error);
        return NextResponse.json({ 
            error: "Failed to add screen to project",
            details: error.message || "Unknown error",
            stack: error.stack
        }, { status: 500 });
    }
}