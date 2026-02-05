import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ScreenConfig } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
    console.log("DELETE /api/delete-screen hit");
    try {
        const body = await request.json();
        console.log("Received request body:", JSON.stringify(body, null, 2));
        const { screenId, projectId } = body;

        console.log(`Deleting screen with id: ${screenId} from project: ${projectId}`);

        // Add logic to delete the screen from the database
        await db.delete(ScreenConfig).where(and(eq(ScreenConfig.id, screenId), eq(ScreenConfig.projectId, projectId)));

        console.log("Screen deleted successfully");

        return NextResponse.json({ message: "Screen deleted successfully" });
    } catch (error) {
        console.error("Error deleting screen:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
