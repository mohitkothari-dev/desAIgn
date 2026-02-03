"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import Canvas from "./_shared/canvas";
import { useProjectContext } from "./project-context";

const ProjectCanvasPlayground = () => {
  const {projectId} = useParams();
  const { project, screenConfigs, setScreenConfigs, refreshData, isLoading: contextLoading } = useProjectContext();
  
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  // Local loading state for generation process
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (project?.projectId && screenConfigs && screenConfigs.length === 0 && !isGenerating) {
      generateScreenConfig();
    }
  }, [project, screenConfigs]);

  const generateScreenConfig = async () => {
    if (!project) return;
    
    setIsGenerating(true);
    setLoadingMessage("Generating screen config...");
    
    try {
        const result = await fetch(`/api/generate-config`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userInput: project.userInput,
            device: project.device,
            projectId: project.projectId,
        }),
        });

        console.log("Result:", result);

        const data = await result.json();
        // Refresh context data to get the new screens
        refreshData();
    } catch (e) {
        console.error("Error generating config:", e);
    } finally {
        setIsGenerating(false);
    }
  }

  const isLoading = contextLoading || isGenerating; // or simple logic

  if (!project) return <div>Loading project...</div>;

  return (
    <div>
      {isLoading && <div className="p-3 bg-foreground text-background border-b-blue-600 rounded-xl absolute top-19 left-1/2 transform -translate-x-1/2">
        <h2 className="flex items-center gap-2"><Loader2Icon className="animate-spin" /> {loadingMessage}</h2>
      </div>}
      <Canvas projectDetail={project} screenConfig={screenConfigs} loading={isLoading} />
    </div>
  )
}

export default ProjectCanvasPlayground