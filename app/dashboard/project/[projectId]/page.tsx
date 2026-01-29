"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectType, ScreenConfigType } from "@/type/types";
import { Loader2Icon } from "lucide-react";

const ProjectCanvasPlayground = () => {
  const {projectId} = useParams();
  const [screenConfig, setScreenConfig] = useState<ScreenConfigType[]>([]);
  const [projectDetail, setProjectDetail] = useState<ProjectType>({
    id: "",
    projectId: "",
    userInput: "",
    device: "mobile",
    userId: "",
    projectName: "",
    theme: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  useEffect(() => {
    projectId && GetProjectDetail();
  }, [projectId]);

  const GetProjectDetail = async () => {
    setLoading(true);
    setLoadingMessage("Fetching project details...");
    const result = await fetch(`/api/project?projectId=${projectId}`);
    const data = await result.json();
    setProjectDetail(data.project);
    setScreenConfig(data.screenConfig);
    // if (screenConfig.length === 0) {
    //   generateScreenConfig();
    // }
    setLoading(false);
  }

  useEffect(() => {
    if (projectDetail?.projectId && screenConfig && screenConfig.length === 0) {
      generateScreenConfig();
    }
  }, [projectDetail, screenConfig]);

  const generateScreenConfig = async () => {
    setLoading(true);
    setLoadingMessage("Generating screen config...");
    const result = await fetch(`/api/generate-config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInput: projectDetail.userInput,
        device: projectDetail.device,
        projectId: projectDetail.projectId,
      }),
    });

    console.log("Result:", result);

    const data = await result.json();
    //setScreenConfig(data);
    GetProjectDetail();
    setLoading(false);
    
  }

  return (
    <div>
      {loading && <div className="p-3 bg-foreground text-background border-b-blue-600 rounded-xl absolute top-19 left-1/2 transform -translate-x-1/2">
        <h2 className="flex items-center gap-2"><Loader2Icon className="animate-spin" /> {loadingMessage}</h2>
        {/* ShadCN UI sheet: use symbols at the bottom of the screen to open the sheet  */}
      </div>}
    </div>
  )
}

export default ProjectCanvasPlayground