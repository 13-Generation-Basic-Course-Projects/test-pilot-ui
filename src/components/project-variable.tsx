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
  updateProjectVariableAction,
} from "@/action/project-variable-action";

interface ProjectVariableProps {
  projectId: string;
}

export default function ProjectVariable({ projectId }: ProjectVariableProps) {
  const [rows, setRows] = useState<
    { variableId?: string; variable: string; value: string }[]
  >([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [originalVariable, setOriginalVariable] = useState("");
  const [originalValue, setOriginalValue] = useState("");
  const [editField, setEditField] = useState<"variable" | "value" | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllProjectVariableAction(projectId)
      .then((variables) => {
        setRows(variables);
        setError(null);
      })
      .catch((error) => {
        setError(`Failed to load project variables: ${error.message}`);
      });
  }, [projectId]);

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

  const handleSaveNewRow = async (index: number) => {
    const newRow = rows[index];

    // Only create if both fields are filled and no variableId exists
    if (newRow.variable && newRow.value && !newRow.variableId) {
      // Note: createVariableAction is commented out in the provided code
      setError("Create functionality is currently disabled");
    }
  };

  const handleUpdateRow = async (index: number) => {
    const row = rows[index];
    if (row.variableId && (row.variable !== originalVariable || row.value !== originalValue)) {
      try {
        const updatedVariable = await updateProjectVariableAction(row.variableId, {
          keyName: row.variable,
          keyValue: row.value,
          enabled: true,
          projectId, // Add projectId
        });

        const updatedRows = [...rows];
        updatedRows[index] = {
          variableId: updatedVariable.variableId,
          variable: updatedVariable.variable,
          value: updatedVariable.value,
        };
        setRows(updatedRows);
        setError(null);
      } catch (err) {
        console.error("Update variable failed:", err);
        setError("Failed to update variable: " + (err as Error).message);
      }
    }
  };

  const handleDeleteRow = async () => {
    if (deleteIndex !== null) {
      const targetRow = rows[deleteIndex];
      if (targetRow.variableId) {
        try {
          await dele(targetRow.variableId);
        } catch (err) {
          setError("Failed to delete variable: " + (err as Error).message);
          return;
        }
      }
      setRows(rows.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
      setError(null);
    }
  };

  return (
    <div className="space-y-5">
      {error && <p className="text-red-500">{error}</p>}
      <TableV2>
        <TableHeader>
          <TableRowV2>
            <TableHeadV2 className="border-r text-sm">Variable</TableHeadV2>
            <TableHeadV2 className="border-r text-sm">Value</TableHeadV2>
            <TableHeadV2 className="text-sm">Action</TableHeadV2>
          </TableRowV2>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="border-r">
                <input
                  type="text"
                  value={row.variable}
                  onFocus={() => {
                    setOriginalVariable(row.variable);
                    setEditIndex(index);
                    setEditField("variable");
                  }}
                  onBlur={() => {
                    if (originalVariable && row.variable !== originalVariable) {
                      setShowConfirmDialog(true);
                    }
                    if (!row.variableId) {
                      handleSaveNewRow(index);
                    }
                  }}
                  onChange={(e) =>
                    handleChange(index, "variable", e.target.value)
                  }
                  className="w-full px-2 py-1 text-sm border border-transparent focus:outline-none focus:border-gray-300"
                  placeholder="Enter variable"
                />
              </TableCell>
              <TableCell className="border-r">
                <input
                  type="text"
                  value={row.value}
                  onFocus={() => {
                    setOriginalValue(row.value);
                    setEditIndex(index);
                    setEditField("value");
                  }}
                  onBlur={() => {
                    if (originalValue && row.value !== originalValue) {
                      setShowConfirmDialog(true);
                    }
                    if (!row.variableId) {
                      handleSaveNewRow(index);
                    }
                  }}
                  onChange={(e) => handleChange(index, "value", e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-transparent focus:outline-none focus:border-gray-300"
                  placeholder="Enter value"
                />
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash2
                      className="text-[#E2001A] cursor-pointer"
                      width={20}
                      onClick={() => {
                        setDeleteIndex(index);
                      }}
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {deleteIndex !== null
                          ? `Delete "${rows[deleteIndex].variable}"?`
                          : "Are you absolutely sure?"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. It will permanently delete{" "}
                        <strong>
                          {deleteIndex !== null
                            ? `"${rows[deleteIndex].variable}"`
                            : "this variable"}
                        </strong>
                        .
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => {
                          setDeleteIndex(null);
                        }}
                      >
                        Cancel
                      </AlertDialogCancel>
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
            <TableCell
              colSpan={3}
              className="text-sm text-gray-500 py-3"
              onClick={handleAddRow}
            >
              + Add
            </TableCell>
          </TableRow>
        </TableBody>
      </TableV2>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Do you want to change the {editField === "value" ? "value" : "variable name"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {editField === "value"
                ? "The value was changed. Would you like to save it or cancel changes?"
                : "The variable name was changed. Would you like to save it or cancel changes?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                if (editIndex !== null) {
                  if (editField === "variable") {
                    handleChange(editIndex, "variable", originalVariable);
                  } else {
                    handleChange(editIndex, "value", originalValue);
                  }
                }
                setShowConfirmDialog(false);
              }}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-black hover:bg-gray-800 cursor-pointer"
              onClick={() => {
                if (editIndex !== null) {
                  handleUpdateRow(editIndex);
                }
                setShowConfirmDialog(false);
              }}
            >
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}