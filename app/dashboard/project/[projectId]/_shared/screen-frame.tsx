import { GripVertical } from "lucide-react"
import { Rnd } from "react-rnd"

const ScreenFrame = ({x, y, setPanningEnabled}: {x: number, y: number, setPanningEnabled: (enabled: boolean) => void}) => {
  return (
    <Rnd
    default={{
        x,
        y,
        width: 200,
        height: 200,
    }}
    dragHandleClassName="drag-handle"
    enableResizing={{
        bottom: true,
        bottomLeft: true,
        bottomRight: true,
        left: true,
        right: true,
        top: true,
        topLeft: true,
        topRight: true,
    }}
    onDragStart={() => setPanningEnabled(false)}
    onDragStop={() => setPanningEnabled(true)}
    onResizeStart={() => setPanningEnabled(false)}
    onResizeStop={() => setPanningEnabled(true)}
    >
        <div className="drag-handle cursor-move p-2 flex gap-2 items-center">
            <GripVertical /> Drag Here
        </div>
        <div className="w-full h-full bg-foreground rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <span className="text-background">Example</span>
        </div>
    </Rnd>
  )
}

export default ScreenFrame