"use client"

import * as React from "react"
import {
  Sparkle,
  Camera,
  Share
} from "lucide-react"

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { THEME_NAMES, THEMES, ThemeKey } from "@/lib/themes"


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

export function AppSidebar({ project, user, ...props }: AppSidebarProps) {
    const router = useRouter();

    const [selectedTheme, setSelectedTheme] = React.useState<ThemeKey>("AURORA_INK");
    const [projectName, setProjectName] = React.useState<string>('');
    const [userNewScreenInput, setUserNewScreenInput] = React.useState<string>('');

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
                            <h2>Themes</h2>
                            <div className="h-[200px] overflow-auto scrollbar-thin">
                                <div>
                                    {THEME_NAMES.map((theme, index) => (
                                        <div key={index} className={`p-3 border rounded-2xl mb-2 cursor-pointer ${selectedTheme === theme ? "border-primary bg-primary/10" : ""}`} onClick={() => setSelectedTheme(theme)}>
                                            <h2>{theme}</h2>
                                            <div className="flex gap-2">
                                                <div className="h-4 w-4 rounded-full" style={{ background: THEMES[theme].primary }}></div>
                                                <div className="h-4 w-4 rounded-full" style={{ background: THEMES[theme].secondary }}></div>
                                                <div className="h-4 w-4 rounded-full" style={{ background: THEMES[theme].accent }}></div>
                                                <div className="h-4 w-4 rounded-full" style={{ background: THEMES[theme].background }}></div>
                                                <div className="h-4 w-4 rounded-full" style={{ background: `linear-gradient(135deg, 
                                                ${THEMES[theme].background },
                                                ${THEMES[theme].primary},
                                                ${THEMES[theme].accent}
                                                )`,
                                                }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                            <Separator className="mt-6 bg-foreground" />
                        <div className="mt-2">
                            <h2>Export Options</h2>
                            <div className="flex gap-3">
                                <Button className="mt-2">
                                    <Camera/> Screenshot
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