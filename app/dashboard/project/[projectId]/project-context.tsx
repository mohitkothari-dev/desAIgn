"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectType, ScreenConfigType } from '@/type/types';
import { Theme, ThemeColors, isSystemTheme, validateThemeColors } from '@/lib/themes';
import { updateProjectThemeAction } from '@/app/actions/project';
import { toast } from "sonner";

interface ProjectContextType {
    project: ProjectType | null;
    screenConfigs: ScreenConfigType[];
    themes: Theme[];
    isLoading: boolean;
    setProject: (project: ProjectType) => void;
    setScreenConfigs: (configs: ScreenConfigType[]) => void;
    updateTheme: (themeId: string) => Promise<void>;
    refreshData: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ 
    children, 
    initialProject, 
    initialScreenConfigs 
}: { 
    children: React.ReactNode, 
    initialProject: ProjectType,
    initialScreenConfigs: ScreenConfigType[]
}) {
    const [project, setProject] = useState<ProjectType | null>(initialProject);
    const [screenConfigs, setScreenConfigs] = useState<ScreenConfigType[]>(initialScreenConfigs);
    const [themes, setThemes] = useState<Theme[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch themes on mount
    useEffect(() => {
        const fetchThemes = async () => {
            try {
                const response = await fetch('/api/themes');
                const data = await response.json();
                if (response.ok) {
                    setThemes(data.themes);
                }
            } catch (error) {
                console.error('Failed to fetch themes:', error);
            }
        };
        fetchThemes();
    }, []);

    const refreshData = async () => {
        if (!project?.id) return;
        
        setIsLoading(true);
        try {
            const result = await fetch(`/api/project?projectId=${project.id}`);
            const data = await result.json();
            setProject(data.project);
            setScreenConfigs(data.screenConfig);
        } catch (error) {
            console.error('Failed to refresh project data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateTheme = async (themeId: string) => {
        if (!project) return;
        
        const selectedTheme = themes.find(t => t.id === themeId);
        if (!selectedTheme) return;

        const previousThemeId = project.theme;
        const previousScreenConfigs = JSON.parse(JSON.stringify(screenConfigs));

        // 1. Optimistic Update
        const updatedProject = { ...project, theme: themeId };
        setProject(updatedProject);

        const updatedConfigs = screenConfigs.map(screen => {
            if (!screen.designIntent) return screen;
            
            // Deep clone logic would be better but simple spread for top level properties
            const newIntent = JSON.parse(JSON.stringify(screen.designIntent));
            
            if (!newIntent.designSystem) newIntent.designSystem = {};
            if (!newIntent.designSystem.colorPalette) newIntent.designSystem.colorPalette = {};

            // Map ThemeColors to the structure expected by ScreenRenderer
            // colors: { primary, secondary, ... } -> designSystem.colorPalette: { primary: { main: ... }, ... }
            const colors = selectedTheme.colors;
            
            newIntent.designSystem.colorPalette = {
                primary: { main: colors.primary, light: colors.primary, dark: colors.primary }, // Simplified mapping
                secondary: { main: colors.secondary, light: colors.secondary, dark: colors.secondary },
                background: { default: colors.background, paper: colors.card },
                text: { primary: colors.foreground, secondary: colors.mutedForeground },
                action: { active: colors.accent, hover: colors.accent } // Example mapping
            };
            
            // Should properly map all properties eventually
            
            return {
                ...screen,
                designIntent: newIntent
            };
        });

        setScreenConfigs(updatedConfigs);

        // 2. Server Action
        try {
            const result = await updateProjectThemeAction(project.id, themeId, updatedConfigs);
            if (!result.success) {
                throw new Error(result.error);
            }
            toast.success("Theme updated");
        } catch (error) {
            console.error("Failed to update theme:", error);
            toast.error("Failed to update theme");
            // Revert changes
            setProject({ ...project, theme: previousThemeId });
            setScreenConfigs(previousScreenConfigs);
        }
    };

    return (
        <ProjectContext.Provider value={{
            project,
            screenConfigs,
            themes,
            isLoading,
            setProject,
            setScreenConfigs,
            updateTheme,
            refreshData
        }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProjectContext() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProjectContext must be used within a ProjectProvider');
    }
    return context;
}
