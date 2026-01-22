import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { project } from "@/db/schema";

export async function POST(req: NextRequest) {
    const { userInput, device, projectId } = await req.json();
    
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
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning({ projectId: project.projectId });
    
    return NextResponse.json({ projectId: result[0] });
}
