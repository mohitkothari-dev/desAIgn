import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { project, ScreenConfig } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const { userInput, device, id, projectName } = await req.json();
    
    //get currently logged in user
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if(!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { user } = session;
    const result = await db.insert(project).values({
        id: id || crypto.randomUUID(),
        userInput: userInput,
        device: device,
        userId: user.id as string,
        projectName: projectName,
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning({ id: project.id });
    
    return NextResponse.json({ project: result[0] });
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

    try {
        if (projectId) {
            console.log(`Fetching project: ${projectId} for user: ${user.id}`);
            const result = await db.select().from(project).where(
                and(
                    eq(project.userId, user.id as string), 
                    eq(project.id, projectId as string)
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
        } else {
            console.log(`Fetching recent projects for user: ${user.id}`);
            const result = await db.select()
                .from(project)
                .where(eq(project.userId, user.id as string))
                .orderBy(desc(project.createdAt))
                .limit(10);
            
            return NextResponse.json(result);
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}