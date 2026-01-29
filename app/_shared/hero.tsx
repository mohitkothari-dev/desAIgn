"use client";
import React, { useEffect, useState } from "react";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import AppPromptInput from "@/components/app-prompt-input";
import { DeviceType, ProjectType } from "@/type/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2Icon, Clock } from "lucide-react";

const Hero = () => {
  const [promptText, setPromptText] = useState<string>("");
  const [device, setDevice] = useState<DeviceType>("mobile");
  const [recentProjects, setRecentProjects] = useState<ProjectType[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchRecentProjects();
  }, []);

  const fetchRecentProjects = async () => {
    try {
      const response = await fetch('/api/project');
      if (response.ok) {
        const data = await response.json();
        setRecentProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch recent projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const suggestions = [
    {
      label: "Finance Tracker",
      icon: "💸",
      value: `Finance app statistics screen. Current balance at top with dollar amount, bar chart showing spending over months (Oct-Mar) with month selector pills below, transaction list with app icons, amounts, and categories. Bottom navigation bar. Mobile app, single screen. Style: Dark theme, chunky rounded cards, playful but professional, modern sans-serif typography, Gen Z fintech vibe. Fun and fresh, not corporate.`,
    },
    {
      label: "Fitness Activity",
      icon: "🔥",
      value: `Fitness tracker summary screen. Large central circular progress ring showing steps and calories with neon glow. Line graph showing heart rate over time. Bottom section with grid of health metrics (Sleep, Water, SpO2). Mobile app, single screen. Style: Deep Dark Mode (OLED friendly). Pitch black background with electric neon green and vibrant blue accents. High contrast, data-heavy but organized, sleek and sporty aesthetic.`,
    },
    {
      label: "Food Delivery",
      icon: "🍔",
      value: `Food delivery home feed. Top search bar with location pin. Horizontal scrolling hero carousel of daily deals. Vertical list of restaurants with large delicious food thumbnails, delivery time badges, and rating stars. Floating Action Button (FAB) for cart. Mobile app, single screen. Style: Vibrant and Appetizing. Warm colors (orange, red, yellow), rounded card corners, subtle drop shadows to create depth. Friendly and inviting UI.`,
    },
    {
      label: "Travel Booking",
      icon: "✈️",
      value: `Travel destination detail screen. Full-screen immersive photography of a tropical beach. Bottom sheet overlay with rounded top corners containing hotel title, star rating, price per night, and a large "Book Now" button. Horizontal scroll of amenity icons. Mobile app, single screen. Style: Minimalist Luxury. ample whitespace, elegant serif typography for headings, clean sans-serif for body text. Sophisticated, airy, high-end travel vibe.`,
    },
    {
      label: "E-Commerce",
      icon: "👟",
      value: `Sneaker product page. Large high-quality product image on a light gray background. Color selector swatches, size selector grid, and a sticky "Add to Cart" button at the bottom. Title and price in bold, oversized typography. Mobile app, single screen. Style: Neo-Brutalism. High contrast, thick black outlines on buttons and cards, hard shadows (no blur), unrefined geometry, bold solid colors (yellow and black). Trendy streetwear aesthetic.`,
    },
    {
      label: "Meditation",
      icon: "🧘",
      value: `Meditation player screen. Central focus is a soft, abstract breathing bubble animation. Play/Pause controls and a time slider below. Background is a soothing solid pastel sage green. Mobile app, single screen. Style: Soft Minimal. Rounded corners on everything, low contrast text for relaxation, pastel color palette, very little UI clutter. Zen, calming, and therapeutic atmosphere.`,
    },
  ];

  const handleSuggestionClick = (val: string) => {
    setPromptText(val);
  };

  const onCreateProject = async () => {
    if (!promptText) return;
    const result = await fetch('/api/project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput: promptText,
        device: device,
        projectId: crypto.randomUUID(), 
        projectName: "Untitled Project", 
      }),
    });
    const data = await result.json();
    console.log(data);

    router.push(`/dashboard/project/${data.projectId.projectId}`);
  }

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col">
        <div className="relative overflow-hidden pt-28">
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-8"> 
            <div className="space-y-3">
              <h1 className="text-center font-semibold text-4xl tracking-tight sm:text-5xl">
                What are you <br className="md:hidden" />
                <span className="text-primary">desAIgning today?</span>
              </h1>
              <div className="mx-auto max-w-2xl ">
                <p className="text-center font-medium text-foreground leading-relaxed sm:text-lg">
                  Go from idea to beautiful mockups in minutes by chatting with AI.
                </p>
              </div>
            </div>
            <div className="flex w-full max-w-3xl flex-col item-center gap-8 relative z-50">
              <div className="w-full px-2 sm:px-4 lg:px-6">
                <AppPromptInput
                  promptText={promptText}
                  setPromptText={setPromptText}
                  isLoading={false}
                  onSubmit={onCreateProject}
                  device={device}
                  setDevice={setDevice}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-2 px-5">
                <Suggestions>
                  {suggestions.map((s) => (
                    <Suggestion
                      key={s.label}
                      suggestion={s.label}
                      className="text-xs! h-7! px-2.5 pt-1!"
                      onClick={() => handleSuggestionClick(s.value)}
                    >
                      {s.icon}
                      <span>{s.label}</span>
                    </Suggestion>
                  ))}
                </Suggestions>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full py-10">
          <div className="mx-auto max-w-3xl px-4">
              <div>
                <h1 className="font-medium text-xl tracking-tight mb-6">
                  Recent Projects
                </h1>
                
                {loadingProjects ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                    <span>Loading your projects...</span>
                  </div>
                ) : recentProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentProjects.map((project) => (
                      <Link 
                        key={project.id} 
                        href={`/dashboard/project/${project.projectId}`}
                        className="group flex flex-col p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                            {project.projectName || "Untitled Project"}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                            project.device === 'mobile' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {project.device}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {project.userInput}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto">
                          <Clock className="w-3.4 h-3.4" />
                          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-border rounded-2xl">
                    <p className="text-muted-foreground">No projects found. Create your first design above!</p>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Hero;
