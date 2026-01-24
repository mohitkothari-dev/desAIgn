import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { theme } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET - Fetch all themes (system + user's custom themes)
export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch all system themes and user's custom themes
        const { eq, or } = await import('drizzle-orm');
        const themes = await db
            .select()
            .from(theme)
            .where(
                or(
                    eq(theme.isSystem, true),
                    eq(theme.userId, session.user.id)
                )
            );

        return NextResponse.json({ themes });
    } catch (error) {
        console.error('Error fetching themes:', error);
        return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
    }
}

// POST - Create a new custom theme
export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, colors } = body;

        // Validate required fields
        if (!name || !colors) {
            return NextResponse.json({ error: 'Name and colors are required' }, { status: 400 });
        }

        // Create slug from name
        const slug = name.toLowerCase().replace(/\s+/g, '_');

        // Insert new theme
        const newTheme = await db.insert(theme).values({
            id: crypto.randomUUID(),
            name,
            slug,
            isSystem: false,
            userId: session.user.id,
            colors,
            createdAt: new Date(),
            updatedAt: new Date()
        }).returning();

        return NextResponse.json({ theme: newTheme[0] }, { status: 201 });
    } catch (error) {
        console.error('Error creating theme:', error);
        return NextResponse.json({ error: 'Failed to create theme' }, { status: 500 });
    }
}
