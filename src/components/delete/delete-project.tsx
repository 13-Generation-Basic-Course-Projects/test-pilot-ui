// DeleteProject.tsx
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
import { ProjectItem } from "@/types";

type DeleteProjectProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectItem | null;
  onDeleteConfirm: (projectId: string) => void;
};

export function DeleteProject({
    
  open,
  onOpenChange,
  project,
  onDeleteConfirm,
}: DeleteProjectProps) {
  if (!project) return null; //Prevents the dialog from rendering if no project is selected.
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the project <strong>{project.title}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogActionV2 onClick={() => onDeleteConfirm(project.id)} className="cursor-pointer">
            Delete
          </AlertDialogActionV2>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
