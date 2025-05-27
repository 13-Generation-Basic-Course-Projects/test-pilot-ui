import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  collectionName?: string;
}

export default function DeleteCollectionDialog({
  open,
  onOpenChange,
  onDelete,
  collectionName,
}: DeleteCollectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-red-600">Are you sure to delete this collection?</DialogTitle>
        </DialogHeader>
        <div className="mt-4 text-sm text-gray-700">
          This action cannot be undone. This will permanently delete your collection{" "}
          <span className="font-semibold">{collectionName}</span>.
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
