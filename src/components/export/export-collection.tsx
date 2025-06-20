"use client";

import React, { useState } from "react";
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

type ExportProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection?: CollectionItem | null;
};

export function ExportCollection({ open, onOpenChange, collection }: ExportProps) {
  const [layout, setLayout] = useState("comfortable");

  const handleExport = () => {
    if (!collection) {
      toast.error("No collection selected for export.");
      return;
    }

    // Prepare the collection data for export
    const exportData = {
      title: collection.title,
      endpoints: collection.endpoints.map((endpoint) => ({
        id: endpoint.id,
        method: endpoint.method || "GET",
        path: endpoint.path || "/new-request",
        name: endpoint.name || endpoint.path || "/new-request",
        // Add additional endpoint properties if needed (e.g., headers, queryParams, etc.)
      })),
      version: layout === "default" ? "2.0" : "2.1", // Include version based on layout
    };

    // Create JSON string
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create a Blob for the JSON file
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${collection.title || "collection"}.json`; // File name based on collection title
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Notify user of successful export
    toast.success(`Collection "${collection.title}" exported as JSON successfully!`);

    // Close the dialog
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Export Collection</AlertDialogTitle>
          <AlertDialogDescription>
            The collection and its requests will be exported as a JSON file.
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
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <Button onClick={handleExport} className="cursor-pointer">Export</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
