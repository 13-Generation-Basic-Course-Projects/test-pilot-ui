import React, { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Endpoint } from "@/types";
import { shareEndpoint } from "@/service/share-link-service";

type ExportProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  endpoint?: Endpoint | null;
};

export function ShareEndpoint({ open, onOpenChange, endpoint }: ExportProps) {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    console.log("ShareEndpoint: Mounted with props - open:", open, "endpoint:", endpoint);
    console.log("ShareEndpoint: Initial shareLink state:", shareLink);
  }, []);

  useEffect(() => {
    if (open && endpoint?.id) {
      console.log("ShareEndpoint: Generating share link for endpointId:", endpoint.id);
      setShareLink(null);
      setError(null);
      setIsGenerating(true);
      shareEndpoint(endpoint.id)
        .then((response) => {
          console.log("ShareEndpoint: Share link response (detailed):", JSON.stringify(response, null, 2));
          if (response.success && response.payload && typeof response.payload.token === "string") {
            setShareLink(response.payload.token);
          } else {
            console.warn("ShareEndpoint: Unexpected response structure:", response);
            setError("No valid URL found in response. Please check the server configuration.");
          }
        })
        .catch((error) => {
          console.error("ShareEndpoint: Error generating share link:", error);
          setError(`Failed to generate share link: ${error.message || "Unknown error"}`);
          setShareLink(null);
        })
        .finally(() => setIsGenerating(false));
    } else if (open && !endpoint?.id) {
      setError("Invalid endpoint: No ID available");
      setShareLink(null);
      setIsGenerating(false);
    }
  }, [open, endpoint?.id]);

  const handleCopy = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  const displayLink = shareLink || "";
  const truncatedDisplay = shareLink ? `${shareLink.slice(0, 60)}...` : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl rounded-xl">
        <DialogHeader>
          <DialogTitle>Share request</DialogTitle>
        </DialogHeader>
        <div className="rounded-md flex items-center justify-between space-x-2">
          <span className="text-sm font-medium mr-2">Link:</span>
          {error ? (
            <span className="text-sm text-red-500">{error}</span>
          ) : isGenerating ? (
            <span className="text-sm">Generating link...</span>
          ) : shareLink ? (
            <span className="bg-muted px-4 rounded-md text-sm font-mono truncate flex-1 flex items-center justify-between">
              {truncatedDisplay}
              <Button
                size="icon"
                variant={copied ? "secondary" : "ghost"}
                onClick={handleCopy}
                className="ml-2 outline-0 cursor-pointer"
                aria-label={copied ? "Copied" : "Copy share link"}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500 outline-0" />
                    <span className="sr-only">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 outline-0" />
                    <span className="sr-only">Copy</span>
                  </>
                )}
              </Button>
            </span>
          ) : (
            <span className="text-sm">No link available</span>
          )}
          <DialogClose asChild>
            <Button type="button" className="cursor-pointer">Close</Button>
          </DialogClose>
        </div>
        <DialogFooter className="justify-end" />
      </DialogContent>
    </Dialog>
  );
}