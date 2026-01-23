export const THEMES = {
    AURORA_INK : {
        background: "#0b1020",
        foreground: "#f5f5f5",

        card: "#121A33",
        cardForeground: "#f5f5f5",
        
        popover: "#121A33",
        popoverForeground: "#f5f5f5",
        
        primary: "#7c5cff",
        primaryRgb: "124, 92, 255",
        primaryForeground: "#0b1020",

        secondary: "#1a2547",
        secondaryForeground: "#e8e8ff",

        muted: "#141d3a",
        mutedForeground: "#a9b2d6",

        accent: "#2fe6c7",
        accentForeground: "#0b1020",

        destructive: "#ff4d6d",
        destructiveForeground: "#f5f5f5",

        input: "#202c56",
        ring: "#7c5cff",
        radius: "0.9rem",

        chart: [
            "#7c5cff",
            "#2fe6c7",
            "#ffb84d",
            "#ff4d6d",
            "#66a6ff",
        ]
    },
    SUNSET_BLAZE: {
        background: "#1a0f0a",
        foreground: "#fef5f1",

        card: "#2d1810",
        cardForeground: "#fef5f1",
        
        popover: "#2d1810",
        popoverForeground: "#fef5f1",
        
        primary: "#ff6b35",
        primaryRgb: "255, 107, 53",
        primaryForeground: "#1a0f0a",

        secondary: "#3d2418",
        secondaryForeground: "#ffe8dc",

        muted: "#2a1a12",
        mutedForeground: "#d4b5a6",

        accent: "#ffd23f",
        accentForeground: "#1a0f0a",

        destructive: "#e63946",
        destructiveForeground: "#fef5f1",

        input: "#4a2f20",
        ring: "#ff6b35",
        radius: "0.9rem",

        chart: [
            "#ff6b35",
            "#ffd23f",
            "#ff9f1c",
            "#e63946",
            "#ffb563",
        ]
    },
    OCEAN_DEPTHS: {
        background: "#0a1628",
        foreground: "#e8f4f8",

        card: "#0f2744",
        cardForeground: "#e8f4f8",
        
        popover: "#0f2744",
        popoverForeground: "#e8f4f8",
        
        primary: "#00d4ff",
        primaryRgb: "0, 212, 255",
        primaryForeground: "#0a1628",

        secondary: "#1a3a5c",
        secondaryForeground: "#d4f1ff",

        muted: "#132d4a",
        mutedForeground: "#8fb8d4",

        accent: "#00ffc8",
        accentForeground: "#0a1628",

        destructive: "#ff5757",
        destructiveForeground: "#e8f4f8",

        input: "#1e4a6f",
        ring: "#00d4ff",
        radius: "0.9rem",

        chart: [
            "#00d4ff",
            "#00ffc8",
            "#4d9fff",
            "#ff5757",
            "#7dd3fc",
        ]
    },
    FOREST_WHISPER: {
        background: "#0d1b0d",
        foreground: "#f0f7f0",

        card: "#1a2e1a",
        cardForeground: "#f0f7f0",
        
        popover: "#1a2e1a",
        popoverForeground: "#f0f7f0",
        
        primary: "#4ade80",
        primaryRgb: "74, 222, 128",
        primaryForeground: "#0d1b0d",

        secondary: "#2d4a2d",
        secondaryForeground: "#e6ffe6",

        muted: "#1e3a1e",
        mutedForeground: "#a8d4a8",

        accent: "#fbbf24",
        accentForeground: "#0d1b0d",

        destructive: "#ef4444",
        destructiveForeground: "#f0f7f0",

        input: "#2f5a2f",
        ring: "#4ade80",
        radius: "0.9rem",

        chart: [
            "#4ade80",
            "#fbbf24",
            "#34d399",
            "#ef4444",
            "#86efac",
        ]
    },
    MIDNIGHT_ROSE: {
        background: "#1a0a1f",
        foreground: "#faf5fc",

        card: "#2d1535",
        cardForeground: "#faf5fc",
        
        popover: "#2d1535",
        popoverForeground: "#faf5fc",
        
        primary: "#e879f9",
        primaryRgb: "232, 121, 249",
        primaryForeground: "#1a0a1f",

        secondary: "#3d1f4a",
        secondaryForeground: "#f9e6ff",

        muted: "#2a1838",
        mutedForeground: "#d4a8e8",

        accent: "#fb7185",
        accentForeground: "#1a0a1f",

        destructive: "#f43f5e",
        destructiveForeground: "#faf5fc",

        input: "#4a2d5a",
        ring: "#e879f9",
        radius: "0.9rem",

        chart: [
            "#e879f9",
            "#fb7185",
            "#c084fc",
            "#f43f5e",
            "#f0abfc",
        ]
    },
    CYBER_NEON: {
        background: "#0a0e1a",
        foreground: "#f0f9ff",

        card: "#141824",
        cardForeground: "#f0f9ff",
        
        popover: "#141824",
        popoverForeground: "#f0f9ff",
        
        primary: "#00ff9f",
        primaryRgb: "0, 255, 159",
        primaryForeground: "#0a0e1a",

        secondary: "#1e2738",
        secondaryForeground: "#e0ffef",

        muted: "#181f33",
        mutedForeground: "#94c9b3",

        accent: "#ff00ff",
        accentForeground: "#0a0e1a",

        destructive: "#ff3366",
        destructiveForeground: "#f0f9ff",

        input: "#242d47",
        ring: "#00ff9f",
        radius: "0.9rem",

        chart: [
            "#00ff9f",
            "#ff00ff",
            "#00d4ff",
            "#ff3366",
            "#66ffcc",
        ]
    }
} as const;

export const THEME_NAMES = [
    "AURORA_INK",
    "SUNSET_BLAZE",
    "OCEAN_DEPTHS",
    "FOREST_WHISPER",
    "MIDNIGHT_ROSE",
    "CYBER_NEON",
] as const;

export type ThemeKey = keyof typeof THEMES;
export type Theme = typeof THEMES[ThemeKey];