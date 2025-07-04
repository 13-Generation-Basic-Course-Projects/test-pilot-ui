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

interface FormattedUrl {
  raw: string;
  protocol: string;
  host: string[];
  path: string[];
  query?: { key: string; value: string }[];
}

type ExportAllProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  collections: CollectionItem[];
};

export function ExportAllCollections({
  open,
  onOpenChange,
  projectName,
  collections,
}: ExportAllProps) {
  const [layout, setLayout] = useState("comfortable");

  const handleExport = () => {
    // Validate inputs
    if (!projectName) {
      toast.error("Project name is required for export.");
      return;
    }
    if (collections.length === 0) {
      toast.error("No collections to export.");
      return;
    }

    try {
      const exportData = {
        info: {
          _testpilot_id: crypto.randomUUID(),
          name: projectName,
          schema:
            layout === "default"
              ? "https://schema.getTestPilot.com/json/collection/v2.0.0/collection.json"
              : "https://schema.getTestPilot.com/json/collection/v2.1.0/collection.json",
        },
        item: collections.map((collection) => ({
          name: collection.title || "Untitled Collection",
          item: collection.endpoints.map((endpoint) => ({
            name: endpoint.name || endpoint.path || "Untitled Request",
            request: {
              method: endpoint.method || "GET",
              header: endpoint.headers || [],
              url: formatUrl(endpoint.path),
              body: endpoint.details?.body || null,
              description: endpoint.details?.description || "",
            },
            response: [],
          })),
        })),
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectName}_collections_testpilot.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(
        `Exported all collections from "${projectName}" successfully.`
      );
      onOpenChange(false);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export collections. Please try again.");
    }
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
          <Button onClick={handleExport}>Export</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// URL formatter
function formatUrl(rawUrl: string): FormattedUrl {
  if (!rawUrl || rawUrl.trim() === "") {
    return {
      raw: "https://example.com",
      protocol: "https",
      host: ["example", "com"],
      path: [],
    };
  }
  try {
    const url = new URL(
      rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`
    );
    const protocol = url.protocol.replace(":", "") || "https";
    const host = url.hostname.split(".").filter(Boolean);
    const path = url.pathname.split("/").filter(Boolean);
    const query = Array.from(url.searchParams.entries()).map(
      ([key, value]) => ({
        key,
        value,
      })
    );
    const formatted: FormattedUrl = { raw: rawUrl, protocol, host, path };
    if (query.length > 0) {
      formatted.query = query;
    }
    return formatted;
  } catch (error) {
    console.warn(`Invalid URL "${rawUrl}":`, error);
    return {
      raw: rawUrl,
      protocol: "https",
      host: ["example", "com"],
      path: rawUrl.split("/").filter(Boolean),
    };
  }
}
