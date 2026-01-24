import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { project } from "@/db/schema";
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
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if(!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { user } = session;

    const projectId = await req.nextUrl.searchParams.get("projectId");
    try {
        const result = await db.select().from(project).where(and(eq(project.userId, user?.email as string), 
        eq(project.projectId, projectId as string)));
        return NextResponse.json({ projects: result[0] });
    } catch (error) {
        return NextResponse.json({ error: error });
    }
}