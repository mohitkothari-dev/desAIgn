import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { activeGeminiModel } from "@/lib/gemini";
import { PROFESSIONAL_DESIGN_INTENT_PROMPT } from "@/lib/prompt";
import { db } from "@/db";
import { ScreenConfig, project } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    console.log("POST /api/generate-config hit");
    try {
        const body = await request.json();
        console.log("Received request body:", JSON.stringify(body, null, 2));
        const { userInput, device, projectId } = body;

        console.log("Using model for generation...");

        const { text } = await generateText({
            model: activeGeminiModel,
            system: PROFESSIONAL_DESIGN_INTENT_PROMPT,
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

        //Save the generated object into the DB
        const result = await db.insert(ScreenConfig).values({
            id: crypto.randomUUID(),
            projectId: projectId,
            //Access the first screen in the array
            screenId: object.screens?.[0]?.id || "",
            purpose: object.screens?.[0]?.purpose || "",
            screenDescription: object.screens?.[0]?.name || "",
            designIntent: object,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning({ screenId: ScreenConfig.screenId });

        //update project table with project Name
        await db.update(project).set({
            projectName: object.projectName,
            description: object.description,
            updatedAt: new Date(),
        }).where(eq(project.projectId, projectId));

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