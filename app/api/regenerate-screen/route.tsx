import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ScreenConfig, project } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { generateText } from "ai";
import { activeGeminiModel } from "@/lib/gemini";
import { MOBILE_DESIGN_PROMPT, WEBSITE_DESIGN_PROMPT } from "@/lib/prompt";
import { parseAIJsonResponse } from "@/lib/utils";

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

        // 2. Extract existing designSystem from current screen
        const existingDesignSystem = (currentScreen.designIntent as any)?.designSystem || {};
        
        // 3. Detect user intent for different types of changes
        const userInputLower = userInput?.toLowerCase() || '';
        const wantsStyleChange = userInputLower.includes('color') || 
                                userInputLower.includes('gradient') ||
                                userInputLower.includes('theme') ||
                                userInputLower.includes('background');
        
        const wantsLayoutOverhaul = userInputLower.includes('layout') ||
                                   userInputLower.includes('structure') ||
                                   userInputLower.includes('redesign') ||
                                   userInputLower.includes('completely') ||
                                   userInputLower.includes('overhaul') ||
                                   userInputLower.includes('different layout');
        
        const wantsMinorTweaks = !wantsStyleChange && !wantsLayoutOverhaul;

        // 4. Create adaptive regeneration prompt based on user intent
        let promptStrategy;
        
        if (wantsLayoutOverhaul) {
            // Complete layout redesign - allow structural changes
            promptStrategy = `
──────────────
TASK: COMPLETE LAYOUT REDESIGN
──────────────
You are completely redesigning the layout and structure of this screen while maintaining the project's design system.

DESIGN SYSTEM TO PRESERVE:
${JSON.stringify(existingDesignSystem, null, 2)}

PROJECT CONTEXT:
- Project Name: ${currentProject.projectName}
- Project Description: ${currentProject.projectDescription}
- Device: ${device}

CURRENT SCREEN (for reference only - you can completely change this):
- Name: ${currentScreen.screenName}
- Purpose: ${currentScreen.purpose}
- Current Layout: ${JSON.stringify((currentScreen.designIntent as any)?.screens?.[0] || {}, null, 2)}

USER'S REDESIGN INSTRUCTIONS:
${userInput}

INSTRUCTIONS:
1. COMPLETELY REDESIGN the screen layout and component structure as requested.
2. KEEP the existing designSystem (colors, typography, spacing) for consistency.
3. You may rearrange, add, or remove components freely.
4. Focus on creating a better user experience based on the user's instructions.
5. Return ONLY the new screen structure with: {"screens": [{...}]}
`;
        } else if (wantsStyleChange) {
            // Style modifications - preserve content, allow visual changes
            promptStrategy = `
──────────────
TASK: STYLE MODIFICATION (PRESERVE CONTENT)
──────────────
You are modifying ONLY the visual styling of this screen while preserving ALL existing content and layout structure.

PROJECT CONTEXT:
- Project Name: ${currentProject.projectName}
- Project Description: ${currentProject.projectDescription}
- Device: ${device}

CURRENT SCREEN CONTENT (PRESERVE THIS EXACTLY):
${JSON.stringify((currentScreen.designIntent as any)?.screens?.[0] || {}, null, 2)}

USER'S STYLE INSTRUCTIONS:
${userInput}

CRITICAL INSTRUCTIONS FOR STYLING:
1. KEEP the exact same component structure, layout, and content as shown above.
2. Only modify colors, backgrounds, gradients, and visual styling properties.
3. For gradient backgrounds: Update the 'style' or 'className' properties to include CSS gradients.
4. For multi-color styling: Modify the relevant color properties (background, text, border colors).
5. You can update existing style properties or add new ones like:
   - style: { background: 'linear-gradient(90deg, #color1, #color2, #color3)' }
   - className: 'bg-gradient-to-r from-color1 to-color2'
   - background, color, borderColor properties
6. Do NOT change component types, positions, or remove/add any elements.
7. Return the complete screen with the same structure but updated styling.
8. Return ONLY the screen structure: {"screens": [{...}]}
`;
        } else {
            // Minor tweaks - preserve everything, make small targeted changes
            promptStrategy = `
──────────────
TASK: MINOR SCREEN TWEAKS (PRESERVE STRUCTURE)
──────────────
You are making minor targeted adjustments to this screen while preserving the existing design and structure.

CURRENT SCREEN STRUCTURE (PRESERVE THIS):
${JSON.stringify((currentScreen.designIntent as any)?.screens?.[0] || {}, null, 2)}

PROJECT CONTEXT:
- Project Name: ${currentProject.projectName}
- Project Description: ${currentProject.projectDescription}
- Device: ${device}

USER'S TWEAK INSTRUCTIONS:
${userInput || "Make small improvements to the screen."}

INSTRUCTIONS:
1. KEEP the existing designSystem exactly as provided.
2. Make ONLY the specific minor changes requested to the screen above.
3. Preserve all existing components, layout, and content structure.
4. Return the updated screen with: {"screens": [{...}]}
`;
        }

        const { text } = await generateText({
            model: activeGeminiModel,
            prompt: promptStrategy,
        });

        // 5. Parse and clean the response
        const regeneratedObject = parseAIJsonResponse(text);

        // Validate and ensure proper structure
        if (!regeneratedObject.screens || !Array.isArray(regeneratedObject.screens)) {
            console.error("Invalid screen structure from AI:", regeneratedObject);
            throw new Error("AI response missing screens array");
        }

        // Ensure the screens array only has one screen (the regenerated one)
        const screenData = regeneratedObject.screens[0];

        // Validate screen structure
        if (!screenData || typeof screenData !== 'object') {
            console.error("Invalid screen data from AI:", screenData);
            throw new Error("AI response contains invalid screen data");
        }

        // Ensure screen has required structure with better content preservation
        const currentScreenData = (currentScreen.designIntent as any)?.screens?.[0] || {};
        
        // Smart structure validation that allows dynamic styling changes
        const validatedScreenData = {
            ...currentScreenData, // Preserve all existing properties first
            ...screenData, // Then apply AI changes on top
            id: screenData.id || currentScreen.id,
            name: screenData.name || currentScreen.screenName,
            purpose: screenData.purpose || currentScreen.purpose,
            // For style changes, preserve the original structure but allow styling updates
            children: screenData.children !== undefined ? 
                (Array.isArray(screenData.children) ? screenData.children : currentScreenData.children) : 
                currentScreenData.children || [{
                    id: "root-container",
                    type: "container",
                    props: {
                        className: "flex flex-col items-center justify-center min-h-screen p-8"
                    },
                    children: [{
                        id: "placeholder-text",
                        type: "text",
                        props: {
                            className: "text-2xl font-bold text-gray-600",
                            text: "Screen content will appear here"
                        }
                    }]
                }]
        };

        // 6. Build updated designIntent based on regeneration type
        let updatedDesignIntent;
        
        // Smart structure validation for dynamic styling changes
        const mergeScreenStructures = (originalScreen: any, aiScreen: any) => {
            // Deep merge function that preserves structure while allowing style changes
            const deepMerge = (target: any, source: any, path = ''): any => {
                if (source === null || source === undefined) return target;
                if (target === null || target === undefined) return source;
                
                if (Array.isArray(source) && Array.isArray(target)) {
                    // For arrays, merge items by ID or index
                    return source.map((item: any, index: number) => {
                        if (target[index]) {
                            return deepMerge(target[index], item, `${path}[${index}]`);
                        }
                        return item;
                    });
                }
                
                if (typeof source === 'object' && typeof target === 'object') {
                    const result = { ...target };
                    
                    // Special handling for style properties
                    if (path.includes('props') || path.includes('styles')) {
                        // Allow complete override of style properties
                        Object.keys(source).forEach(key => {
                            if (key === 'style' || key === 'className' || key.includes('background') || key.includes('color')) {
                                result[key] = source[key];
                            } else if (typeof source[key] === 'object' && typeof target[key] === 'object') {
                                result[key] = deepMerge(target[key] || {}, source[key], `${path}.${key}`);
                            } else {
                                result[key] = source[key];
                            }
                        });
                        return result;
                    }
                    
                    // For other properties, merge recursively
                    Object.keys(source).forEach(key => {
                        if (key === 'children' && Array.isArray(source[key])) {
                            // Special handling for children arrays
                            result[key] = source[key].map((child: any, index: number) => {
                                if (target[key] && target[key][index]) {
                                    return deepMerge(target[key][index], child, `${path}.${key}[${index}]`);
                                }
                                return child;
                            });
                        } else {
                            result[key] = deepMerge(target[key], source[key], `${path}.${key}`);
                        }
                    });
                    
                    return result;
                }
                
                return source;
            };
            
            return deepMerge(originalScreen, aiScreen);
        };
        
        if (wantsStyleChange) {
            // For style changes: merge AI changes into original structure
            const mergedScreen = mergeScreenStructures(currentScreenData, screenData);
            updatedDesignIntent = {
                ...(typeof currentScreen.designIntent === 'object' && currentScreen.designIntent !== null ? currentScreen.designIntent : {}),
                screens: [mergedScreen]
            };
        } else if (wantsLayoutOverhaul) {
            // For layout overhauls: use AI structure but preserve essential properties
            updatedDesignIntent = {
                ...(typeof currentScreen.designIntent === 'object' && currentScreen.designIntent !== null ? currentScreen.designIntent : {}),
                screens: [validatedScreenData]
            };
        } else {
            // For minor tweaks: preserve original structure, apply targeted changes
            const mergedScreen = mergeScreenStructures(currentScreenData, screenData);
            updatedDesignIntent = {
                ...(typeof currentScreen.designIntent === 'object' && currentScreen.designIntent !== null ? currentScreen.designIntent : {}),
                screens: [mergedScreen]
            };
        }

        // 7. Update the database
        await db.update(ScreenConfig)
            .set({
                designIntent: updatedDesignIntent,
                screenName: validatedScreenData.name || currentScreen.screenName,
                purpose: validatedScreenData.purpose || currentScreen.purpose,
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