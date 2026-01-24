"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectType } from "@/type/types";
import { Loader2Icon } from "lucide-react";

const ProjectCanvasPlayground = () => {
  const {projectId} = useParams();
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
    setProjectDetail(data);
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