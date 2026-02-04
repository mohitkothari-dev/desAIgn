import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ScreenFrame from "./screen-frame";
import { useState, useCallback } from "react";
import { ProjectType, ScreenConfigType } from "@/type/types";
import { useControls } from "react-zoom-pan-pinch";
import { Plus, Minus, X, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const canvas = ({ projectDetail, screenConfig, loading }: { projectDetail: ProjectType, screenConfig: ScreenConfigType[], loading?: boolean }) => {
    const [panningEnabled, setPanningEnabled] = useState(true);
    const isMobile = projectDetail?.device === "mobile";
    const SCREEN_WIDTH = isMobile ? 390 : 1920;
    const SCREEN_HEIGHT = isMobile ? 844 : 1080;
    const GAP = isMobile ? 30 : 70;

    const Controls = () => {
        const { zoomIn, zoomOut, resetTransform } = useControls();

        return (
            <div className="tools absolute shadow p-2 px-3 flex gap-3 rounded-4xl bottom-10 bg-foreground text-background left-1/2 z-50 -translate-x-1/2">
                <Button variant="ghost" size="icon" className="text-background hover:text-background/80 hover:bg-foreground/20" onClick={() => zoomIn()}><Plus /></Button>
                <Button variant="ghost" size="icon" className="text-background hover:text-background/80 hover:bg-foreground/20" onClick={() => zoomOut()}><Minus /></Button>
                <Button variant="ghost" size="icon" className="text-background hover:text-background/80 hover:bg-foreground/20" onClick={() => resetTransform()}><RefreshCcw /></Button>
            </div>
        );
    };

    return (
        <div className="w-full h-screen"
        style={{
            backgroundImage: "radial-gradient(oklch(from var(--foreground) l c h / 0.15) 2px, transparent 1px)",
            backgroundSize: "20px 20px",
        }}
        >
            <TransformWrapper
                initialScale={0.5}
                minScale={0.1}
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
                <Controls />
                <TransformComponent
                wrapperStyle={{
                    width: "100%",
                    height: "100%",
                }}
                >
                    <div 
                        id="canvas-capture-area" 
                        className="flex relative" 
                        style={{
                            width: `${screenConfig.length * (SCREEN_WIDTH + GAP) + 200}px`, // Increased buffer for safety
                            height: `${SCREEN_HEIGHT + 200}px`, // Increased buffer for safety
                            padding: '100px' // Increased padding for a better frame
                        }}
                    >
                        {screenConfig.map((screen, index) => (
                            <ScreenFrame key={index} 
                            x={index * (SCREEN_WIDTH + GAP) + 100} // Matches padding
                            y={100} // Matches padding
                            width={SCREEN_WIDTH}
                            height={SCREEN_HEIGHT}
                            setPanningEnabled={setPanningEnabled}
                            uiConfig={screen.designIntent}
                            />
                        ))}
                    </div>
                </TransformComponent>
            </>
          )}
            </TransformWrapper>
        </div>
      )
}

export default canvas