import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ScreenFrame from "./screen-frame";
import { useState } from "react";

const canvas = () => {
    const [panningEnabled, setPanningEnabled] = useState(true);
  return (
    <div className="w-full h-screen"
    style={{
        backgroundImage: "radial-gradient(oklch(from var(--foreground) l c h / 0.15) 2px, transparent 1px)",
        backgroundSize: "20px 20px",
    }}
    >
        <TransformWrapper
            initialScale={1}
            initialPositionX={200}
            initialPositionY={100}
            limitToBounds={false}
            wheel={{
                step: 0.8,  
            }}
            doubleClick={{
                disabled: false
            }}
            panning={{disabled: !panningEnabled }}
        >
            <TransformComponent
            wrapperStyle={{
                width: "100%",
                height: "100%",
            }}
            >
                <ScreenFrame x={0} y={0} setPanningEnabled={setPanningEnabled}/>
                <ScreenFrame x={400} y={0} setPanningEnabled={setPanningEnabled}/>
            </TransformComponent>
        </TransformWrapper>
    </div>
  )
}

export default canvas