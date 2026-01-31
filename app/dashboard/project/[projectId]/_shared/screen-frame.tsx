import React from "react"
import { GripVertical, Code, Copy, Check } from "lucide-react"
import { Rnd } from "react-rnd"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import ScreenRenderer from "./screen-renderer"
import { generateReactCode } from "./code-generator"

const ScreenFrame = ({x, y, width, height, setPanningEnabled, uiConfig}: {x: number, y: number, width: number, height: number, setPanningEnabled: (enabled: boolean) => void, uiConfig: any}) => {
  const [copied, setCopied] = React.useState(false);
  const code =  React.useMemo(() => generateReactCode(uiConfig), [uiConfig]);

  const copyToClipboard = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Rnd
    default={{
        x,
        y,
        width: width,
        height: height,
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
        <div className="drag-handle cursor-move p-2 flex justify-between items-center bg-gray-100 border-b rounded-t-xl">
            <div className="flex gap-2 items-center">
                <GripVertical className="w-4 h-4 text-gray-500" /> 
                <span className="text-xs font-medium text-gray-600">Screen</span>
            </div>
            
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Code className="h-4 w-4 text-gray-500" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Exported Code</DialogTitle>
                    </DialogHeader>
                    <div className="relative flex-1 overflow-hidden border rounded-md bg-zinc-950 text-zinc-50 font-mono text-sm">
                        <div className="absolute right-4 top-4 z-10">
                            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={copyToClipboard}>
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                        <ScrollArea className="h-full w-full p-4">
                            <pre>{code}</pre>
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
        <div className="w-full h-[calc(100%-40px)] bg-white rounded-b-xl shadow-lg border-x border-b border-gray-200 overflow-hidden">
            <ScreenRenderer designIntent={uiConfig} />
        </div>
    </Rnd>
  )
}

export default ScreenFrame