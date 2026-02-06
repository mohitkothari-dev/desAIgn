"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ScreenFrame from "@/app/dashboard/project/[projectId]/_shared/screen-frame";
import { useState } from "react";
import { Plus, Minus, RefreshCcw, Eye, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SharedCanvasProps {
  project: {
    id: string;
    projectName: string;
    device: "mobile" | "website";
    theme: string;
    userInput: string;
    createdAt: Date;
  };
  screenConfigs: Array<{
    id: string;
    screenName: string;
    purpose: string;
    screenDescription: string;
    designIntent: any;
  }>;
  shareInfo: {
    expiresAt: Date;
    createdAt: Date;
  };
}

export default function SharedCanvas({ project, screenConfigs, shareInfo }: SharedCanvasProps) {
  const [panningEnabled, setPanningEnabled] = useState(true);
  const isMobile = project?.device === "mobile";
  const SCREEN_WIDTH = isMobile ? 390 : 1920;
  const SCREEN_HEIGHT = isMobile ? 844 : 1080;
  const GAP = isMobile ? 30 : 70;

  const Controls = () => {
    return (
      <div className="tools absolute shadow p-2 px-3 flex gap-3 rounded-4xl bottom-10 bg-foreground text-background left-1/2 z-50 -translate-x-1/2">
        <Button variant="ghost" size="icon" className="text-background hover:text-background/80 hover:bg-foreground/20" onClick={() => window.location.href = '/'}>
          <Globe className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full h-screen relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Shared View</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <h1 className="text-lg font-semibold">{project.projectName}</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Expires {new Date(shareInfo.expiresAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full h-screen pt-16"
        style={{
          backgroundImage: "radial-gradient(oklch(from var(--foreground) l c h / 0.15) 2px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <TransformWrapper
          initialScale={0.5}
          minScale={0.5}
          initialPositionX={50}
          initialPositionY={50}
          limitToBounds={false}
          wheel={{
            step: 0.1,  
          }}
          doubleClick={{
            disabled: false
          }}
          panning={{disabled: !panningEnabled }}
        >
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <>
              <TransformComponent
                wrapperStyle={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <div 
                  id="canvas-capture-area"
                  className="relative flex"
                  style={{ 
                    width: `${screenConfigs.length * (SCREEN_WIDTH + GAP) + 200}px`,
                    height: `${SCREEN_HEIGHT + 200}px`,
                    padding: '100px'
                  }}
                >
                  {screenConfigs.map((config, index) => (
                    <ScreenFrame
                      key={config.id}
                      x={index * (SCREEN_WIDTH + GAP) + 100}
                      y={100}
                      setPanningEnabled={setPanningEnabled}
                      uiConfig={config.designIntent}
                      screenName={config.screenName}
                      projectId={project.id}
                      screenId={config.id}
                      width={SCREEN_WIDTH}
                      height={SCREEN_HEIGHT}
                      isReadOnly={true}
                    />
                  ))}
                </div>
              </TransformComponent>
              
              <div className="tools absolute shadow p-2 px-3 flex gap-3 rounded-4xl bottom-10 bg-foreground text-background left-1/2 z-50 -translate-x-1/2">
                <Button variant="ghost" size="icon" className="text-background hover:text-background/80 hover:bg-foreground/20" onClick={() => zoomIn()}>
                  <Plus />
                </Button>
                <Button variant="ghost" size="icon" className="text-background hover:text-background/80 hover:bg-foreground/20" onClick={() => zoomOut()}>
                  <Minus />
                </Button>
                <Button variant="ghost" size="icon" className="text-background hover:text-background/80 hover:bg-foreground/20" onClick={() => resetTransform()}>
                  <RefreshCcw />
                </Button>
              </div>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
}