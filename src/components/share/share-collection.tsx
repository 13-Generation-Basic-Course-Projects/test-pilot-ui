import React, { useEffect, useState } from "react";
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
import { CollectionItem } from "@/types";
import { fetchShareLink } from "@/service/collection-service";

type ExportProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection?: CollectionItem | null;
};
export function ShareCollection({
  open,
  onOpenChange,
  collection,
}: ExportProps) {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState("");
  useEffect(() => {
    if (collection?.id) {
      fetchShareLink(collection.id).then((link) => {
        if (link) setShareLink(link);
      });
    }
  }, [collection?.id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle>Share request</DialogTitle>
        </DialogHeader>

        <div className="rounded-md flex items-center justify-between space-x-2">
          <span className="text-sm font-medium mr-2">Link :</span>
          <span className="w-96 bg-muted px-4 rounded-md text-sm font-mono truncate flex-1 flex items-center justify-between">
            {shareLink || "Loading..."}
          </span>
          <Button
            size="icon"
            variant={copied ? "secondary" : "ghost"}
            onClick={handleCopy}
            className="ml-2 outline-0 cursor-pointer"
            aria-label="Copy share link"
            disabled={!shareLink}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="sr-only">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy</span>
              </>
            )}
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              className="cursor-pointer"
              disabled={!shareLink}
            >
              Close
            </Button>
          </DialogClose>
        </div>

        <DialogFooter className="justify-end" />
      </DialogContent>
    </Dialog>
  );
}
