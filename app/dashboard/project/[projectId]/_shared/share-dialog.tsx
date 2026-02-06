"use client"

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share, Copy, Check, Clock, Globe } from "lucide-react";
import { toast } from "sonner";

interface ShareDialogProps {
  projectId: string;
}

export function ShareDialog({ projectId }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [copied, setCopied] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState(30);

  const generateShareLink = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          expiresInDays,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShareUrl(data.shareUrl);
        setExpiresAt(data.expiresAt);
        toast.success("Share link generated successfully!");
      } else {
        toast.error(data.error || "Failed to generate share link");
      }
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error("Failed to generate share link");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const resetDialog = () => {
    setShareUrl("");
    setExpiresAt("");
    setCopied(false);
    setExpiresInDays(30);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        resetDialog();
      }
    }}>
      <DialogTrigger asChild>
        <Button className="mt-2">
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Share Canvas
          </DialogTitle>
          <DialogDescription>
            Generate a shareable link that others can use to view your canvas in read-only mode.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!shareUrl ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="expires">Link Expires In</Label>
                <select
                  id="expires"
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={365}>1 year</option>
                </select>
              </div>
              
              <Button 
                onClick={generateShareLink} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Share className="mr-2 h-4 w-4" />
                    Generate Share Link
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="shareUrl">Share Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="shareUrl"
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button onClick={copyToClipboard} size="icon" variant="outline">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              {expiresAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Expires on {new Date(expiresAt).toLocaleDateString()}
                </div>
              )}
              
              <Button 
                onClick={resetDialog}
                variant="outline"
                className="w-full"
              >
                Generate New Link
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}