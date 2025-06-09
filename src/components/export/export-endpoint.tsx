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
import { Endpoint } from "@/types";

type ExportProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  endpoint?: Endpoint | null;
};

export function ExportEndpoint({ open, onOpenChange, endpoint }: ExportProps) {
  const [layout, setLayout] = useState("comfortable");

  const handleExport = () => {
    if (!endpoint) {
      alert("No endpoint selected for export.");
      return;
    }

    // Prepare the endpoint data for export
    const exportData = {
      id: endpoint.id,
      method: endpoint.method || "GET",
      path: endpoint.path || "/new-request",
      name: endpoint.name || endpoint.path || "/new-request",
    };

    // Create JSON string
    const jsonString = JSON.stringify(exportData, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${endpoint.name || "endpoint"}.json`; 
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Export Request</AlertDialogTitle>
          <AlertDialogDescription>
            The request will be exported as a JSON file.
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