import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { project, ScreenConfig } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const { userInput, device, projectId, projectName } = await req.json();
    
    //get currently logged in user
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if(!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { user } = session;
    const result = await db.insert(project).values({
        id: crypto.randomUUID(),
        projectId: projectId,
        userInput: userInput,
        device: device,
        userId: user.id as string,
        projectName: projectName,
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning({ projectId: project.projectId });
    
    return NextResponse.json({ projectId: result[0] });
}

export async function GET(req: NextRequest) {
    console.log("GET /api/project hit");
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if(!session) {
        console.log("Unauthorized request to /api/project");
        return new Response("Unauthorized", { status: 401 });
    }

    const { user } = session;

    const projectId = req.nextUrl.searchParams.get("projectId");
    console.log(`Fetching project: ${projectId} for user: ${user.id}`);
    try {
        const result = await db.select().from(project).where(
            and(
                eq(project.userId, user.id as string), 
                eq(project.projectId, projectId as string)
            )
        );
        console.log(`Project search result: ${result.length} found`);

        const ScreenConf = await db.select().from(ScreenConfig).where(
            eq(ScreenConfig.projectId, projectId as string)
        );
        console.log(`Screen configurations: ${ScreenConf.length} found`);

        return NextResponse.json({ 
            project: result[0],
            screenConfig: ScreenConf
         });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}