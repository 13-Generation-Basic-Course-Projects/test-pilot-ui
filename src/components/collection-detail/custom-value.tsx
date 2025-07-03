"use client";

import React, { useTransition, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowV2,
} from "@/components/ui/table";
import { DATA_TYPES } from "@/lib/constants";
import { Separator } from "../ui/separator";
import { Edit, Trash } from "lucide-react";
import { z } from "zod";
import { customValueSchema } from "@/lib/zodSchema";
import { DeleteCustomValue } from "../delete/delete-custom-value";
import { CustomValueForm } from "./custom-value-form";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import {
  getCustomTestCaseAction,
  deleteCustomTestCaseAction,
  updateCustomTestCaseAction,
} from "@/action/custom-test-case-action";
import { getAllPredefinedAction } from "@/action/pre-defined-action";

// Define the shape of a table row
interface CustomValueRow {
  id: string;
  name: string;
  value: string;
  type: string;
}

// Define the shape of API response data
interface ApiData {
  id: string;
  name: string;
  value: string;
  dataType: {
    name: string;
  };
}

export const CustomValue = (): React.JSX.Element => {
  // State for table data, dialogs, and loading
  const [requestParams, setRequestParams] = useState<CustomValueRow[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<z.infer<typeof customValueSchema> | null>(null);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  // Fetch test cases when component mounts or project ID changes
  useEffect(() => {
    const fetchData = async () => {
      const dataFromApi = (await getCustomTestCaseAction(pathname.split("/")[2])) as ApiData[];
      if (dataFromApi && Array.isArray(dataFromApi)) {
        const formattedParams: CustomValueRow[] = dataFromApi.map((item) => ({
          id: item.id,
          name: item.name,
          value: item.value,
          type: item.dataType.name,
        }));
        setRequestParams(formattedParams);
      }
    };
    fetchData();
  }, [pathname]);

  // Placeholder for adding new test case (already working)
  const handleAddCustomValue = async (data: z.infer<typeof customValueSchema>) => {
    // Create functionality is already implemented
  };

  // Start editing a test case
  const handleEdit = (index: number) => {
    const param = requestParams[index];
    setEditingIndex(index);
    setEditingValue({
      nameCase: param.name,
      value: param.value,
      typeCase: param.type.toLowerCase(), 
    });
  };

  // Update an existing test case
  const handleEditCustomValue = async (data: z.infer<typeof customValueSchema>, index: number) => {
    const itemToUpdate = requestParams[index];
    if (!itemToUpdate) return;

    startTransition(async () => {
      try {
        const dataTypes = await getAllPredefinedAction();

        const selectedDataType = dataTypes.find(
          (dt: any) => dt.dataType.name.toLowerCase() === data.typeCase.toLowerCase()
        );

        if (!selectedDataType) {
          throw new Error(`Invalid data type: ${data.typeCase}. Available: ${dataTypes.map((dt: any) => dt.dataType.name).join(", ")}`);
        }

        // Build payload for update
        const updateTestCase = {
          projectId: pathname.split("/")[2],
          dataTypeId: selectedDataType.dataType.id,
          name: data.nameCase,
          value: data.value,
        };


        const response = await updateCustomTestCaseAction(itemToUpdate.id, updateTestCase);
        if (response.success) {
          // Update table data
          setRequestParams((prev) =>
            prev.map((item, i) =>
              i === index
                ? { ...item, name: data.nameCase, value: data.value, type: data.typeCase }
                : item
            )
          );
          toast.success("Test case updated!");
        } else {
          throw new Error(response.message || "Failed to update test case.");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update test case.";
        toast.error(errorMessage);
        console.error("Update error:", errorMessage);
      }
    });
    setEditingIndex(null);
    setEditingValue(null);
  };

  // Delete a test case
  const handleDeleteConfirm = async () => {
    if (deleteIndex === null) return;
    const itemToDelete = requestParams[deleteIndex];
    if (!itemToDelete) return;

    startTransition(async () => {
      try {
        console.log("Deleting testcaseId:", itemToDelete.id); // Debug testcaseId
        const response = await deleteCustomTestCaseAction(itemToDelete.id);
        console.log("Delete API response:", response); // Debug response
        if (!response || response.success === false) {
          throw new Error(response?.message || "Failed to delete test case.");
        }
        // Update state only after successful deletion
        setRequestParams((prev) => prev.filter((_, i) => i !== deleteIndex));
        // Re-fetch data to ensure UI consistency
        const dataFromApi = (await getCustomTestCaseAction(pathname.split("/")[2])) as ApiData[];
        if (dataFromApi && Array.isArray(dataFromApi)) {
          const formattedParams: CustomValueRow[] = dataFromApi.map((item) => ({
            id: item.id,
            name: item.name,
            value: item.value,
            type: item.dataType.name,
          }));
          setRequestParams(formattedParams);
        }
        toast.success("Test case deleted!");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete test case.";
        toast.error(errorMessage);
        console.error("Delete error:", errorMessage);
      }
      setDeleteIndex(null);
    });
  };

  return (
    <div className="flex flex-col items-end gap-5 relative self-stretch w-full">
      <div className="inline-flex items-start justify-end gap-5 relative">
        <Select>
          <SelectTrigger className="w-[204px] px-3 py-2 bg-[#ffffff] rounded-md border border-solid border-[#cbd5e1]">
            <SelectValue placeholder="Select to filter" className="text-slate-400" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <Separator />
            {DATA_TYPES.map((type) => (
              <SelectItem key={type} value={type.toLowerCase()}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <CustomValueForm
          onAddCustomValue={handleAddCustomValue}
          onEditCustomValue={handleEditCustomValue}
          editingIndex={editingIndex}
          editingValue={editingValue}
          setEditingIndex={setEditingIndex}
        />
      </div>


      <Card className="w-full border border-solid border-slate-200 p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="text-center">
              <TableRowV2 className="border-b border-slate-200 h-12">
                <TableHead className="pl-6">Name</TableHead>
                <TableHead className="pl-6">Value</TableHead>
                <TableHead className="pl-6">Type</TableHead>
                <TableHead className="pl-6">Action</TableHead>
              </TableRowV2>
            </TableHeader>
            <TableBody>
              {requestParams.map((param, index) => (
                <TableRow key={param.id} className="border-b border-slate-200 h-12">
                  <TableCell className="pl-6">{param.name}</TableCell>
                  <TableCell className="pl-6 text-slate-500">{param.value}</TableCell>
                  <TableCell className="pl-6">
                    <Badge variant="outline" className="bg-white text-[#006fee] font-medium text-xs">
                      {param.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="pl-6 py-4 flex items-center gap-4">
                    <Trash
                      className="text-red-500 cursor-pointer size-4"
                      style={{ pointerEvents: isPending ? "none" : "auto", opacity: isPending ? 0.5 : 1 }}
                      onClick={() => {
                        setDeleteIndex(index);
                        setIsDialogOpen(true);
                      }}
                    />
                    <Edit
                      className="cursor-pointer size-4"
                      style={{ pointerEvents: isPending ? "none" : "auto", opacity: isPending ? 0.5 : 1 }}
                      onClick={() => handleEdit(index)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DeleteCustomValue
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
