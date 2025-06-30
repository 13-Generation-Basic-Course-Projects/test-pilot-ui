"use client";
import { useEffect, useState } from "react";
import {
  TableBody,
  TableCell,
  TableHeadV2,
  TableHeader,
  TableRow,
  TableRowV2,
  TableV2,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import {
  getAllProjectVariableAction,
  dele,
  createVariableAction,
  updateProjectVariableAction,
} from "@/action/project-variable-action";

interface ProjectVariableProps {
  projectId: string;
}

interface VariableRow {
  variableId?: string;
  variable: string;
  value: string;
}

export default function ProjectVariable({ projectId }: ProjectVariableProps) {
  const [rows, setRows] = useState<VariableRow[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [originalRow, setOriginalRow] = useState<VariableRow | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadVariables();
  }, [projectId]);

  const loadVariables = async () => {
    try {
      const variables = await getAllProjectVariableAction(projectId);
      setRows(variables);
      setError(null);
    } catch (error) {
      setError(`Failed to load project variables: ${(error as Error).message}`);
    }
  };

  const handleAddRow = () => {
    setRows([...rows, { variable: "", value: "" }]);
  };

  const handleChange = (
    index: number,
    field: "variable" | "value",
    newValue: string
  ) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = newValue;
    setRows(updatedRows);
  };

  const handleSaveRow = async (index: number) => {
    const row = rows[index];
    
    if (!row.variable || !row.value) {
      return;
    }

    setIsSaving(true);
    try {
      if (row.variableId) {
        // Update existing variable
        await updateProjectVariableAction(row.variableId, {
          keyName: row.variable,
          keyValue: row.value,
          enabled: true,
          projectId,
        });
      } else {
        // Create new variable
        const result = await createVariableAction({
          name: row.variable,
          value: row.value,
          enabled: true,
          projectId,
        });
        // Update row with returned variableId from API
        const updatedRows = [...rows];
        updatedRows[index] = {
          ...row,
          variableId: result.variableId,
        };
        setRows(updatedRows);
      }
      setError(null);
      setEditIndex(null);
      setOriginalRow(null);
    } catch (err) {
      console.error("Operation failed", err);
      setError(`Failed to ${row.variableId ? "update" : "create"} variable.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRow = async () => {
    if (deleteIndex === null) return;
    
    const targetRow = rows[deleteIndex];
    if (!targetRow.variableId) {
      // If it's a new row that wasn't saved yet, just remove it
      setRows(rows.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
      return;
    }

    try {
      await dele(targetRow.variableId);
      setRows(rows.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    } catch (err) {
      setError("Failed to delete variable. Please try again.");
    }
  };

  const handleCellFocus = (index: number) => {
    setOriginalRow({ ...rows[index] });
    setEditIndex(index);
  };

  const handleCellBlur = (index: number) => {
    const row = rows[index];
    
    // For new rows (no variableId), save automatically
    if (!row.variableId) {
      handleSaveRow(index);
      return;
    }

    // For existing rows, check if changes were made
    if (originalRow && 
        (row.variable !== originalRow.variable || 
         row.value !== originalRow.value)) {
      setShowEditDialog(true);
    } else {
      setEditIndex(null);
      setOriginalRow(null);
    }
  };

  const handleSaveChanges = async () => {
    if (editIndex === null) return;
    await handleSaveRow(editIndex);
    setShowEditDialog(false);
  };

  const handleCancelChanges = () => {
    if (editIndex === null || !originalRow) return;
    
    const updatedRows = [...rows];
    updatedRows[editIndex] = { ...originalRow };
    setRows(updatedRows);
    setEditIndex(null);
    setOriginalRow(null);
    setShowEditDialog(false);
  };

  return (
    <div className="space-y-5">
      {error && <p className="text-red-500">{error}</p>}
      {isSaving && <p className="text-blue-500">Saving...</p>}
      <TableV2>
        <TableHeader>
          <TableRowV2>
            <TableHeadV2 className="border-r text-md">Variable</TableHeadV2>
            <TableHeadV2 className="border-r text-md">Value</TableHeadV2>
            <TableHeadV2 className="text-md">Action</TableHeadV2>
          </TableRowV2>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.variableId || `new-${index}`}>
              <TableCell className="border-r">
                <input
                  type="text"
                  value={row.variable}
                  onFocus={() => handleCellFocus(index)}
                  onBlur={() => handleCellBlur(index)}
                  onChange={(e) => handleChange(index, "variable", e.target.value)}
                  className="w-full px-2 py-1 text-md border border-transparent focus:outline-none focus:border-gray-300"
                  placeholder="Enter variable"
                />
              </TableCell>
              <TableCell className="border-r">
                <input
                  type="text"
                  value={row.value}
                  onFocus={() => handleCellFocus(index)}
                  onBlur={() => handleCellBlur(index)}
                  onChange={(e) => handleChange(index, "value", e.target.value)}
                  className="w-full px-2 py-1 text-md border border-transparent focus:outline-none focus:border-gray-300"
                  placeholder="Enter value"
                />
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={() => setDeleteIndex(index)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="text-[#E2001A]" width={20} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete "{rows[deleteIndex || 0]?.variable}"?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. It will permanently delete
                        this variable.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteRow}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
          <TableRow
            onClick={handleAddRow}
            className="cursor-pointer hover:bg-muted"
          >
            <TableCell colSpan={3} className="text-sm text-gray-500 py-3">
              + Add Variable
            </TableCell>
          </TableRow>
        </TableBody>
      </TableV2>

      {/* Edit Confirmation Dialog */}
      <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Save changes to this variable?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You've made changes to this variable. Would you like to save them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelChanges}>
              Discard
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveChanges}>
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}