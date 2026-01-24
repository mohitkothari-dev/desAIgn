import 'dotenv/config';
import { db } from './index';
import { theme } from './schema';
import { DEFAULT_THEMES } from '@/lib/themes';

async function seedThemes() {
    console.log('Starting theme seeding...');
    
    const themeEntries = Object.entries(DEFAULT_THEMES);
    
    for (const [slug, colors] of themeEntries) {
        const themeName = slug.replace(/_/g, ' ');
        
        try {
            // Convert readonly colors to mutable object for database insertion
            const mutableColors = {
                ...colors,
                chart: [...colors.chart] // Convert readonly array to mutable array
            };
            
            await db.insert(theme).values({
                id: crypto.randomUUID(),
                name: themeName,
                slug: slug,
                isSystem: true,
                userId: null,
                colors: mutableColors,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            console.log(`✓ Seeded theme: ${themeName}`);
        } catch (error) {
            console.error(`✗ Failed to seed theme ${themeName}:`, error);
        }
    }
    
    console.log('Theme seeding completed!');
}

seedThemes()
    .then(() => {
        console.log('All themes seeded successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error seeding themes:', error);
        process.exit(1);
    });
