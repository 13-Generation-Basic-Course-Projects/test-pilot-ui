// @/components/project-variable.tsx
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
import { getAllProjectVariableAction } from "@/action/project-variable-action";

interface ProjectVariableProps {
    projectId: string; 
}

export default function ProjectVariable({ projectId }: ProjectVariableProps) {
    const [rows, setRows] = useState<{ variable: string; value: string }[]>([]);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [originalVariable, setOriginalVariable] = useState("");
    const [originalValue, setOriginalValue] = useState("");
    const [editField, setEditField] = useState<"variable" | "value" | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getAllProjectVariableAction(projectId)
            .then((variables: { variable: string; value: string }[]) => {
                setRows(variables);
                setError(null);
            })
            .catch(error => {
                setError(`Failed to load project variables for ${projectId}: ${error.message || "Unknown error"}`);
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

    const handleDeleteRow = () => {
        if (deleteIndex !== null) {
            setRows(rows.filter((_, i) => i !== deleteIndex));
            setDeleteIndex(null);
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
                                        console.log("ProjectVariable: Focused variable input:", index);
                                        setOriginalVariable(row.variable || "");
                                        setEditIndex(index);
                                        setEditField("variable");
                                    }}
                                    onBlur={() => {
                                        if (originalVariable && row.variable !== originalVariable) {
                                            console.log("ProjectVariable: Variable changed, showing confirm dialog");
                                            setShowConfirmDialog(true);
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
                                        console.log("ProjectVariable: Focused value input:", index);
                                        setOriginalValue(row.value || "");
                                        setEditIndex(index);
                                        setEditField("value");
                                    }}
                                    onBlur={() => {
                                        if (originalValue && row.value !== originalValue) {
                                            console.log("ProjectVariable: Value changed, showing confirm dialog");
                                            setShowConfirmDialog(true);
                                        }
                                    }}
                                    onChange={(e) => handleChange(index, "value", e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-transparent focus:outline-none focus:border-gray-300"
                                    placeholder="Enter value"
                                />
                            </TableCell>
                            <TableCell>
                                <AlertDialog>
                                    <AlertDialogTrigger
                                        asChild
                                        className="flex justify-center items-center"
                                    >
                                        <Trash2
                                            className="text-[#E2001A] cursor-pointer"
                                            width={20}
                                            onClick={() => {
                                                console.log("ProjectVariable: Delete clicked for row:", index);
                                                setDeleteIndex(index);
                                            }}
                                        />
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently
                                                delete your variable.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={() => {
                                                console.log("ProjectVariable: Delete cancelled");
                                                setDeleteIndex(null);
                                            }}>
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
                        <TableCell colSpan={3} className="text-sm text-gray-500 py-3">
                            + Add
                        </TableCell>
                    </TableRow>
                </TableBody>
            </TableV2>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Do you want to change the{" "}
                            {editField === "value" ? "value" : "variable name"}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {editField === "value"
                                ? "The value was changed. Would you like to save it or cancel changes?"
                                : "The variable name was changed. Would you like to save it or cancel changes?"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className="cursor-pointer"
                            onClick={() => {
                                if (editIndex !== null) {
                                    if (editField === "variable") {
                                        console.log("ProjectVariable: Cancelled variable change");
                                        handleChange(editIndex, "variable", originalVariable);
                                    } else if (editField === "value") {
                                        console.log("ProjectVariable: Cancelled value change");
                                        handleChange(editIndex, "value", originalValue);
                                    }
                                }
                                setShowConfirmDialog(false);
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-black hover:bg-gray-800 cursor-pointer"
                            onClick={() => {
                                if (editIndex !== null) {
                                    const oldVal =
                                        editField === "variable" ? originalVariable : originalValue;
                                    const newVal =
                                        editField === "variable"
                                            ? rows[editIndex].variable
                                            : rows[editIndex].value;
                                    console.log(
                                        JSON.stringify(
                                            {
                                                field: editField,
                                                old: oldVal,
                                                new: newVal,
                                            },
                                            null,
                                            2
                                        )
                                    );
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