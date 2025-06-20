"use client";

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
import { ProjectItem } from "@/types";
import { shareProject } from "@/service/share-link-service";

type ExportProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectItem | null;
  collectionId?: string;
  requestId?: string;
};

export function ShareProject({ open, onOpenChange, project, collectionId, requestId }: ExportProps) {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    console.log("ShareProject: Mounted with props - open:", open, "project:", project, "collectionId:", collectionId, "requestId:", requestId);
  }, []);

  useEffect(() => {
    if (open && project?.id) {
      console.log("ShareProject: Generating share link for projectId:", project.id);
      setShareLink(null);
      setMessage(null);
      setIsGenerating(true);
      shareProject(project.id, collectionId, requestId)
        .then((response) => {
          console.log("ShareProject: Share link response:", JSON.stringify(response, null, 2));
          if (response.success && response.payload && typeof response.payload.token === "string") {
            setShareLink(response.payload.token);
          } else if (response.success && response.message) {
            setMessage(response.message);
          } else {
            setMessage("Failed to generate share link: Invalid response");
          }
        })
        .catch((error) => {
          console.error("ShareProject: Error generating share link:", error);
          setMessage(`Failed to generate share link: ${error.message || "Unknown error"}`);
          setShareLink(null);
        })
        .finally(() => setIsGenerating(false));
    } else if (open && !project?.id) {
      setMessage("Invalid project: No ID available");
      setShareLink(null);
      setIsGenerating(false);
    }
  }, [open, project?.id, collectionId, requestId]);

  const handleCopy = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  const truncatedDisplay = shareLink ? `${shareLink.slice(0, 60)}...` : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl rounded-xl">
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
        </DialogHeader>
        <div className="rounded-md flex items-center justify-between space-x-2">
          <span className="text-sm font-medium mr-2">Link:</span>
          {message ? (
            <span className="text-sm text-gray-500">{message}</span>
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