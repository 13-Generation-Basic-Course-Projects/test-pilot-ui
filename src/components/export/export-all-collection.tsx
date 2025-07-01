"use client";

import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { CollectionItem } from "@/types/collection-type";

type ExportAllProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
};

export function ExportAllCollections({
  open,
  onOpenChange,
  projectId,
  projectName,
}: ExportAllProps) {
  const [layout, setLayout] = useState("comfortable");
  const [collections, setCollections] = useState<CollectionItem[]>([]);

  // useEffect(() => {
  //   if (open) {
  //     const fetchData = async () => {
  //       try {
  //         const data = await getAllCollectionsWithEndpoints(projectId);
  //         setCollections(data);
  //       } catch (err) {
  //         console.error("Failed to load collections", err);
  //       }
  //     };
  //     fetchData();
  //   }
  // }, [open, projectId]);

  const handleExport = () => {
    if (collections.length === 0) {
      toast.error("No collections to export.");
      return;
    }

    const exportData = {
      projectName: projectName || "UnnamedProject",
      version: layout === "default" ? "2.0" : "2.1",
      collections: collections.map((collection) => ({
        title: collection.title,
        endpoints: collection.endpoints.map((endpoint) => ({
          id: endpoint.id,
          method: endpoint.method || "GET",
          path: endpoint.path || "/new-request",
          name: endpoint.name || endpoint.path || "/new-request",
        })),
      })),
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectName || "project"}_collections_export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success(`Exported all collections from "${projectName}" successfully.`);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Export All Collections</AlertDialogTitle>
          <AlertDialogDescription>
            Export all collections and their requests as a JSON file.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <RadioGroup
          value={layout}
          onValueChange={setLayout}
          className="space-y-2 py-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="r1" />
            <Label htmlFor="r1">Collection v2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="comfortable" id="r2" />
            <Label htmlFor="r2">Collection v2.1</Label>
          </div>
        </RadioGroup>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleExport}>Export All</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
