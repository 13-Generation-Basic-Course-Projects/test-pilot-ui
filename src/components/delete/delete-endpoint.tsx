"use client";
import {
  AlertDialog,
  AlertDialogActionV2,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteRequestProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteEndpoint({ open, onOpenChange, onConfirm }: DeleteRequestProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your endpoint.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogActionV2
            onClick={() => {
              onConfirm();
              onOpenChange(false); 
            }}
            className="cursor-pointer"
          >
            Delete
          </AlertDialogActionV2>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
