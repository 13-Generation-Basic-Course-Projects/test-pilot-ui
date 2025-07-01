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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  onImport: (data: ImportedCollection | ImportedCollection[]) => void;
}

export function ImportCollection({
  open,
  onOpenChange,
  onImport,
}: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [collections, setCollections] = useState<ImportedCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/json") {
      setFile(selectedFile);
      await parseJsonFile(selectedFile);
    } else {
      toast.error("Please select a valid JSON file.");
      setFile(null);
      setCollections([]);
      setSelectedCollection(null);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/json") {
      setFile(droppedFile);
      await parseJsonFile(droppedFile);
    } else {
      toast.error("Please drop a valid JSON file.");
      setFile(null);
      setCollections([]);
      setSelectedCollection(null);
    }
  };

  const parseJsonFile = async (file: File) => {
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      console.log("Parsed JSON:", jsonData); // Debug log

      let parsedCollections: ImportedCollection[] = [];

      // Check for single collection structure
      if (
        jsonData &&
        typeof jsonData === "object" &&
        "title" in jsonData &&
        typeof jsonData.title === "string" &&
        "endpoints" in jsonData &&
        Array.isArray(jsonData.endpoints)
      ) {
        parsedCollections = [
          {
            title: jsonData.title || "Unnamed Collection",
            endpoints: jsonData.endpoints.map((endpoint: any) => ({
              name: endpoint.name || endpoint.path || "New Request",
              path: endpoint.path || endpoint.name || "/new-request",
              method: endpoint.method || "GET",
              url: endpoint.url || endpoint.path || "",
              pathVariables: endpoint.pathVariables || {},
              queryParams: endpoint.queryParams || {},
              headers: endpoint.headers || {},
              body: endpoint.body || null,
              description: endpoint.description || "",
            })),
          },
        ];
      }
      // Check for Postman-like structure (multiple collections)
      else if (
        jsonData &&
        typeof jsonData === "object" &&
        "item" in jsonData &&
        Array.isArray(jsonData.item)
      ) {
        parsedCollections = jsonData.item.map((collection: any) => ({
          title: collection.name || "Unnamed Collection",
          endpoints: (collection.item || []).map((endpoint: any) => ({
            name: endpoint.name || endpoint.request?.url?.raw || "New Request",
            path: endpoint.request?.url?.raw || endpoint.name || "/new-request",
            method: endpoint.request?.method || "GET",
            url: endpoint.request?.url?.raw || "",
            pathVariables: {}, // Postman may not include these directly
            queryParams: endpoint.request?.url?.query
              ? Object.fromEntries(
                  endpoint.request.url.query.map((q: any) => [q.key, q.value])
                )
              : {},
            headers: endpoint.request?.header
              ? Object.fromEntries(
                  endpoint.request.header.map((h: any) => [h.key, h.value])
                )
              : {},
            body: endpoint.request?.body || null,
            description: endpoint.request?.description || "",
          })),
        }));
      } else {
        throw new Error(
          "Invalid JSON structure. Expected either a single collection with 'title' and 'endpoints' or a Postman-like structure with 'item' array."
        );
      }

      setCollections(parsedCollections);
      setSelectedCollection(parsedCollections.length === 1 ? parsedCollections[0].title : null);
    } catch (error) {
      console.error("JSON parsing error:", error);
      toast.error("Failed to parse JSON file. Please ensure it's a valid JSON.");
      setCollections([]);
      setSelectedCollection(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = useCallback(async () => {
    if (!file || !collections.length) return;

    try {
      if (collections.length > 1 && selectedCollection === "all") {
        onImport(collections);
      } else {
        const collectionToImport = collections.find(
          (col) => col.title === selectedCollection
        );
        if (!collectionToImport) {
          throw new Error("Selected collection not found.");
        }
        onImport(collectionToImport);
      }
      setFile(null);
      setCollections([]);
      setSelectedCollection(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(`Failed to import collection: ${(error as Error).message || "Unknown error"}`);
    }
  }, [file, collections, selectedCollection, onImport, onOpenChange]);

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
          {file && collections.length > 1 && (
            <div className="mt-4">
              <Select
                value={selectedCollection || ""}
                onValueChange={setSelectedCollection}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Import All Collections</SelectItem>
                  {collections.map((collection) => (
                    <SelectItem key={collection.title} value={collection.title}>
                      {collection.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
                  onClick={() => {
                    setFile(null);
                    setCollections([]);
                    setSelectedCollection(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpload}
                  className="cursor-pointer"
                  disabled={!selectedCollection && collections.length > 1}
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