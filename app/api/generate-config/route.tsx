import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { activeGeminiModel } from "@/lib/gemini";
import { MOBILE_DESIGN_PROMPT, WEBSITE_DESIGN_PROMPT } from "@/lib/prompt";
import { db } from "@/db";
import { ScreenConfig, project } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    console.log("POST /api/generate-config hit");
    try {
        const body = await request.json();
        console.log("Received request body:", JSON.stringify(body, null, 2));
        const { userInput, device, projectId } = body;

        console.log(`Using model for generation for device: ${device}`);

        const systemPrompt = (device === "mobile" || device === "tablet")
            ? MOBILE_DESIGN_PROMPT
            : WEBSITE_DESIGN_PROMPT;

        const { text } = await generateText({
            model: activeGeminiModel,
            system: systemPrompt,
            prompt: `
──────────────
TASK
──────────────
Generate a full design for: "${userInput}"
Target device: ${device}
Project ID: ${projectId}

Remember to return ONLY valid JSON matching the specified structure.
`,
        });

        // Clean up the response in case there are markdown blocks
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const object = JSON.parse(jsonString);

        console.log("Generated Object successfully");
        console.log("Final Generated Object:", JSON.stringify(object, null, 2));

        // Save EACH screen as a separate row in the DB
        const screenInserts = object.screens?.map((screen: any) => ({
            id: crypto.randomUUID(),
            projectId: projectId,
            screenName: screen.name || "",
            purpose: screen.purpose || "",
            screenDescription: screen.name || "",
            designIntent: { 
                ...object, 
                screens: [screen] // Each row contains only its own screen
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        })) || [];

        const result = await db.insert(ScreenConfig).values(screenInserts).returning({ screenName: ScreenConfig.screenName });

        //update project table with project Name
        await db.update(project).set({
            projectName: object.projectName,
            projectDescription: object.projectDescription,  
            updatedAt: new Date(),
        }).where(eq(project.id, projectId));

        return NextResponse.json(object);
    } catch (error: any) {
        console.error("Design generation failed Detailed Error:", error);
        return NextResponse.json({ 
            error: "Failed to generate design",
            details: error.message || "Unknown error",
            stack: error.stack
        }, { status: 500 });
    }
}