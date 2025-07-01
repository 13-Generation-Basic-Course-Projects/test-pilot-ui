"use client";

import React, { useRef, useState, useCallback } from "react";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImportedCollection {
  title: string;
  endpoints: Array<{
    name?: string;
    path?: string;
    method?: string;
    url?: string;
    pathVariables?: Record<string, string>;
    queryParams?: Record<string, string>;
    headers?: Record<string, string>;
    body?: any;
    description?: string;
  }>;
}

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: ImportedCollection) => void;
}

export function ImportCollection({
  open,
  onOpenChange,
  onImport,
}: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/json") {
      setFile(selectedFile);
    } else {
      toast.error("Please select a valid JSON file.");
      setFile(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/json") {
      setFile(droppedFile);
    } else {
      toast.error("Please drop a valid JSON file.");
      setFile(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = useCallback(async () => {
    if (!file) return;

    try {
      const text = await file.text();
      const jsonData: unknown = JSON.parse(text);

      // Validate the custom JSON structure
      if (
        jsonData &&
        typeof jsonData === "object" &&
        "title" in jsonData &&
        typeof jsonData.title === "string" &&
        "endpoints" in jsonData &&
        Array.isArray(jsonData.endpoints)
      ) {
        onImport(jsonData as ImportedCollection);
        setFile(null);
        onOpenChange(false);
      } else {
        toast.error(
          "Invalid collection format. Expected a structure with 'title' and 'endpoints'."
        );
      }
    } catch (error) {
      toast.error("Failed to parse JSON file. Please ensure it's a valid JSON.");
      console.error("JSON parsing error:", error);
    }
  }, [file, onImport, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl p-5 overflow-hidden rounded-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="pl-4 pr-4 pt-4 flex items-center justify-between">
          <DialogHeader>
            <DialogTitle>Import Collection</DialogTitle>
          </DialogHeader>
        </div>
        <div className="pl-4 pr-4 pb-4 space-y-4">
          <Input
            placeholder="Paste cURL, Raw text or URL..."
            className="w-full px-4 py-2 text-sm rounded"
          />
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center text-center transition hover:bg-muted/20"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex gap-4">
              <UploadCloud
                strokeWidth={1}
                className="w-15 h-15 text-muted-foreground mb-3"
              />
              <div>
                <p className="text-base font-medium text-muted-foreground">
                  Drop anywhere to import
                </p>
                <p className="text-sm text-muted-foreground">
                  or select{" "}
                  <button
                    className="text-blue-500 hover:underline focus:outline-none cursor-pointer"
                    onClick={() => inputRef.current?.click()}
                  >
                    file
                  </button>
                </p>
              </div>
            </div>
            <input
              type="file"
              accept=".json"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {file && (
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <FileIcon className="w-4 h-4" />
                <span>{file.name}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpload}
                  className="cursor-pointer"
                >
                  Upload File
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}