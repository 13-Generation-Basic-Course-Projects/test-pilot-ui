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

interface DeleteCustomValueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteCustomValue({
  open,
  onOpenChange,
  onConfirm,
}: DeleteCustomValueProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">Delete Custom Value?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-slate-600">
            This action cannot be undone. Are you sure you want to permanently delete this item?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-4">
          <AlertDialogCancel className="bg-slate-100 hover:bg-slate-200 cursor-pointer">
            Cancel
          </AlertDialogCancel>
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
