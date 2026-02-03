import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ScreenFrame from "./screen-frame";
import { useState } from "react";
import { ProjectType, ScreenConfigType } from "@/type/types";
import { useControls } from "react-zoom-pan-pinch";
import { Plus, Minus, X, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const canvas = ({ projectDetail, screenConfig, loading }: { projectDetail: ProjectType, screenConfig: ScreenConfigType[], loading?: boolean }) => {
    const [panningEnabled, setPanningEnabled] = useState(true);
    const isMobile = projectDetail?.device === "mobile";
    const SCREEN_WIDTH = isMobile ? 390 : 1920;
    const SCREEN_HEIGHT = isMobile ? 844 : 1080;
    const GAP = isMobile ? 30 : 70;

    const Controls = () => {
        const { zoomIn, zoomOut, resetTransform } = useControls();

        return (
            <div className="tools absolute shadow p-2 px-3 flex gap-3 rounded-4xl bottom-10 bg-foreground text-background left-1/2 z-50">
                <Button onClick={() => zoomIn()}><Plus /></Button>
                <Button onClick={() => zoomOut()}><Minus /></Button>
      <Button onClick={() => resetTransform()}><RefreshCcw /></Button>
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
            minScale={0.5}
            initialPositionX={50}
            initialPositionY={50}
            limitToBounds={false}
            wheel={{
                step: 0.8,  
            }}
            doubleClick={{
                disabled: false
            }}
            panning={{disabled: !panningEnabled }}
        >
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <Controls />
          <TransformComponent>
            <img src="image.jpg" alt="test" />
            <div>Example text</div>
          </TransformComponent>
            <TransformComponent
            wrapperStyle={{
                width: "100%",
                height: "100%",
            }}
            >
                {screenConfig.map((screen, index) => (
                    <ScreenFrame key={index} 
                    x={index * (SCREEN_WIDTH + GAP)}
                    y={0}
                    width={SCREEN_WIDTH}
                    height={SCREEN_HEIGHT}
                    setPanningEnabled={setPanningEnabled}
                    uiConfig={screen.designIntent}
                    />
                ))}
            </TransformComponent>
            </>
      )}
        </TransformWrapper>
    </div>
  )
}

export default canvas