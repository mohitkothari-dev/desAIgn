import React from "react"
import { GripVertical, Code, Copy, Check, Trash2, Sparkle, Loader2 } from "lucide-react"
import { Rnd } from "react-rnd"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import ScreenRenderer from "./screen-renderer"
import { generateReactCode } from "./code-generator"

import { useProjectContext } from "../project-context"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

const ScreenFrame = ({x, y, width, height, setPanningEnabled, uiConfig, screenName, projectId, screenId, isReadOnly = false}: {x: number, y: number, width: number, height: number, setPanningEnabled: (enabled: boolean) => void, uiConfig: any, screenName: string, projectId: string, screenId: string, isReadOnly?: boolean}) => {
  const [copied, setCopied] = React.useState(false);
  const [userInput, setUserInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const { refreshData } = useProjectContext();
  const code =  React.useMemo(() => generateReactCode(uiConfig), [uiConfig]);

  const copyToClipboard = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };
  
  const onDeleteScreen = async () => {
    const loadingToast = toast.loading("Deleting screen...");
    try {
        const response = await fetch("/api/delete-screen", {
            method: "DELETE",
            body: JSON.stringify({ screenId, projectId }),
        });
        if (response.ok) {
            toast.success("Screen deleted successfully", { id: loadingToast });
            refreshData();
        } else {
            toast.error("Failed to delete screen", { id: loadingToast });
        }
    } catch (error) {
        console.error("Error deleting screen:", error);
        toast.error("Error deleting screen", { id: loadingToast });
    }
  }

  const regerateScreen = async () => {
    const loadingToast = toast.loading("Regenerating screen...");
    setLoading(true);
    try {
        const response = await fetch("/api/regenerate-screen", {
            method: "POST",
            body: JSON.stringify({ screenId, projectId, userInput }),
        });
        if (response.ok) {
            toast.success("Screen regenerated successfully", { id: loadingToast });
            refreshData();
            setPopoverOpen(false);
            setUserInput("");
        } else {
            toast.error("Failed to regenerate screen", { id: loadingToast });
        }
    } catch (error) {
        console.error("Error regenerating screen:", error);
        toast.error("Error regenerating screen", { id: loadingToast });
    } finally {
        setLoading(false);
    }
  }
  
  return (
    <Rnd
    default={{
        x,
        y,
        width: width,
        height: height,
    }}
    disableDragging={isReadOnly}
    enableResizing={isReadOnly ? false : {
        bottom: true,
        bottomLeft: true,
        bottomRight: true,
        left: true,
        right: true,
        top: true,
        topLeft: true,
        topRight: true,
    }}
    dragHandleClassName="drag-handle"
    onDragStart={() => setPanningEnabled(false)}
    onDragStop={() => setPanningEnabled(true)}
    onResizeStart={() => setPanningEnabled(false)}
    onResizeStop={() => setPanningEnabled(true)}
    >
        <div className="drag-handle cursor-move p-2 flex justify-between items-center bg-gray-100 border-b rounded-t-xl">
            <div className="flex gap-2 items-center">
                <GripVertical className="w-4 h-4 text-black" /> 
                <span className="text-xs font-medium text-black">{screenName}</span>
            </div>
            
            <Dialog>
                <div className="flex flex-row gap-1">
                    {!isReadOnly && (
                        <>
                            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Sparkle className="w-4 h-4 text-black" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="flex flex-col gap-2">
                                        <Textarea 
                                            placeholder="E.g. Add a logout button, change colors to blue, etc." 
                                            className="w-full h-24" 
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            disabled={loading}
                                        />
                                        <Button size={'sm'} className="w-full"
                                        onClick={() => regerateScreen()}
                                        disabled={loading}
                                        > 
                                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkle className="w-4 h-4 mr-2" />}
                                            {loading ? "Regenerating..." : "Regenerate"}
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDeleteScreen()}>
                                <Trash2 className="w-4 h-4 text-black" />
                            </Button>
                        </>
                    )}
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Code className="h-4 w-4 text-black" />
                    </Button>
                </DialogTrigger>
                </div>
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