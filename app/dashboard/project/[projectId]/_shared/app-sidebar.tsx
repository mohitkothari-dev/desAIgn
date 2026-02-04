"use client"

import * as React from "react"
import {
  Sparkle,
  Share,
  Plus,
  Camera
} from "lucide-react"

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { toJpeg } from "html-to-image";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ThemeColors } from "@/lib/themes"
import { toast } from "sonner"; 

type Theme = {
    id: string;
    name: string;
    slug: string;
    isSystem: boolean;
    userId?: string | null;
    colors: ThemeColors;
    createdAt: Date;
    updatedAt: Date;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    project: {
        projectId: string
        id: string
        [key: string]: any
    }
    user: {
        name: string
        email: string
        image?: string | null
        [key: string]: any
    }
}

import { useProjectContext } from "../project-context";

export function AppSidebar({ project, user, ...props }: AppSidebarProps) {
    const router = useRouter();
    const { themes: contextThemes, updateTheme, project: contextProject } = useProjectContext();

    // Use context themes if available, otherwise empty (though context should ideally load them)
    // We keep local state for "themes" to support the optimistic update from "create" if we want, 
    // but better to just use contextThemes.
    
    // We need 'themes' variable for the map below.
    const themes = contextThemes;

    const selectedTheme = contextProject?.theme || "";
    
    const [projectName, setProjectName] = React.useState<string>('');
    const [userNewScreenInput, setUserNewScreenInput] = React.useState<string>('');
    // const [isLoading, setIsLoading] = React.useState(true); // Handled by context
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isCreating, setIsCreating] = React.useState(false);

    // New theme form state
    const [newThemeName, setNewThemeName] = React.useState('');
    const [newThemeColors, setNewThemeColors] = React.useState<ThemeColors>({
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
        chart: ["#7c5cff", "#2fe6c7", "#ffb84d", "#ff4d6d", "#66a6ff"]
    });

    const handleCreateTheme = async () => {
        if (!newThemeName.trim()) {
            alert('Please enter a theme name');
            return;
        }

        try {
            setIsCreating(true);
            const response = await fetch('/api/themes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newThemeName,
                    colors: newThemeColors
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Add new theme to list and select it
                // We need to refresh context to get the new theme? 
                // ideally context should expose a way to add theme or we reload
                window.location.reload(); // Simple brute force for now to get new theme in context
                
                // Reset form and close dialog
                setNewThemeName('');
                setIsDialogOpen(false);
            } else {
                alert('Failed to create theme: ' + data.error);
            }
        } catch (error) {
            console.error('Error creating theme:', error);
            alert('Failed to create theme');
        } finally {
            setIsCreating(false);
        }
    };

    const handleScreenshot = async () => {
        const node = document.getElementById('canvas-capture-area');
        if (!node) {
            toast.error("Could not find canvas to capture. Make sure the design is loaded.");
            return;
        }

        const loadingToast = toast.loading("Capturing screenshot...");

        try {
            // Give a tiny bit of time for any pending renders
            await new Promise(resolve => setTimeout(resolve, 100));

            // We use toJpeg but toPng is also fine. 
            // The key is providing the explicit dimensions of the target node.
            const dataUrl = await toJpeg(node, {
                quality: 0.95,
                cacheBust: true,
                backgroundColor: '#f0f0f0',
                width: node.scrollWidth,
                height: node.scrollHeight,
                style: {
                    transform: 'none', // Critical: reset any scale/translate during capture
                }
            });
            
            const link = document.createElement('a');
            link.download = `project-${project.projectId}-design.jpg`;
            link.href = dataUrl;
            link.click();
            
            toast.success("Screenshot saved!", { id: loadingToast });
        } catch (err) {
            console.error(err);
            toast.error("Failed to capture screenshot", { id: loadingToast });
        }
    };

    return (
        <Sidebar variant="inset" {...props} className="mt-16">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Textarea placeholder="Generate a new screen / page..." onChange={(e) => setUserNewScreenInput(e.target.value)} />
                        <Button className="w-full mt-2">
                            <Sparkle /> Generate with AI
                        </Button>

                        <Separator className="my-2 bg-foreground" />
                        
                        <div className="mt-2">
                            <div className="flex justify-between items-center mb-2">
                                <h2>Themes</h2>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Create Custom Theme</DialogTitle>
                                            <DialogDescription>
                                                Create your own custom theme by choosing colors for each element.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="theme-name">Theme Name</Label>
                                                <Input
                                                    id="theme-name"
                                                    value={newThemeName}
                                                    onChange={(e) => setNewThemeName(e.target.value)}
                                                    placeholder="My Awesome Theme"
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="primary">Primary Color</Label>
                                                    <Input
                                                        id="primary"
                                                        type="color"
                                                        value={newThemeColors.primary}
                                                        onChange={(e) => setNewThemeColors({...newThemeColors, primary: e.target.value})}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="secondary">Secondary Color</Label>
                                                    <Input
                                                        id="secondary"
                                                        type="color"
                                                        value={newThemeColors.secondary}
                                                        onChange={(e) => setNewThemeColors({...newThemeColors, secondary: e.target.value})}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="accent">Accent Color</Label>
                                                    <Input
                                                        id="accent"
                                                        type="color"
                                                        value={newThemeColors.accent}
                                                        onChange={(e) => setNewThemeColors({...newThemeColors, accent: e.target.value})}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="background">Background Color</Label>
                                                    <Input
                                                        id="background"
                                                        type="color"
                                                        value={newThemeColors.background}
                                                        onChange={(e) => setNewThemeColors({...newThemeColors, background: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="p-4 border rounded-lg">
                                                <p className="text-sm font-medium mb-2">Preview</p>
                                                <div className="flex gap-2">
                                                    <div className="h-8 w-8 rounded-full" style={{ background: newThemeColors.primary }}></div>
                                                    <div className="h-8 w-8 rounded-full" style={{ background: newThemeColors.secondary }}></div>
                                                    <div className="h-8 w-8 rounded-full" style={{ background: newThemeColors.accent }}></div>
                                                    <div className="h-8 w-8 rounded-full" style={{ background: newThemeColors.background }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleCreateTheme} disabled={isCreating}>
                                                {isCreating ? 'Creating...' : 'Create Theme'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            
                            <ScrollArea className="h-[200px]">
                                {false ? ( // Removing loading state for now as context is preloaded
                                    <div className="text-center py-4 text-muted-foreground">
                                        Loading themes...
                                    </div>
                                ) : (
                                    <div>
                                        {themes.map((theme) => (
                                            <div 
                                                key={theme.id} 
                                                className={`p-3 border rounded-2xl mb-2 cursor-pointer ${selectedTheme === theme.id ? "border-primary bg-primary/10" : ""}`} 
                                                onClick={() => updateTheme(theme.id)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-medium">{theme.name}</h3>
                                                    {!theme.isSystem && (
                                                        <span className="text-xs bg-primary/20 px-2 py-1 rounded">Custom</span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 mt-2">
                                                    <div className="h-4 w-4 rounded-full" style={{ background: theme.colors.primary }}></div>
                                                    <div className="h-4 w-4 rounded-full" style={{ background: theme.colors.secondary }}></div>
                                                    <div className="h-4 w-4 rounded-full" style={{ background: theme.colors.accent }}></div>
                                                    <div className="h-4 w-4 rounded-full" style={{ background: theme.colors.background }}></div>
                                                    <div className="h-4 w-4 rounded-full" style={{ 
                                                        background: `linear-gradient(135deg, 
                                                        ${theme.colors.background},
                                                        ${theme.colors.primary},
                                                        ${theme.colors.accent}
                                                        )`,
                                                    }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                        <Separator className="mt-6 bg-foreground" />
                        <div className="mt-2">
                            <h2>Export Options</h2>
                            <div className="flex gap-3">
                                <Button className="mt-2" onClick={handleScreenshot}>
                                    <Camera /> Screenshot
                                </Button>                         
                                <Button className="mt-2">
                                    <Share /> Share
                                </Button>
                            </div>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
        </Sidebar>
    )
}