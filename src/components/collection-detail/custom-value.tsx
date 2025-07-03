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
  createCustomTestCaseAction,
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
  // State for table data, dialogs, loading, and filter
  const [requestParams, setRequestParams] = useState<CustomValueRow[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<z.infer<typeof customValueSchema> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const pathname = usePathname();

  // Log requestParams and selectedFilter for debugging
  useEffect(() => {
    console.log("requestParams:", requestParams);
    console.log("selectedFilter:", selectedFilter);
    console.log(
      "Available types in requestParams:",
      [...new Set(requestParams.map((param) => param.type))]
    );
  }, [requestParams, selectedFilter]);

  // Filter requestParams based on selectedFilter
  const filteredParams = React.useMemo(() => {
    const result =
      selectedFilter === "all"
        ? requestParams
        : requestParams.filter((param) => {
            const matches = param.type.toLowerCase() === selectedFilter.toLowerCase();
            console.log(
              `Filtering: param.type=${param.type}, selectedFilter=${selectedFilter}, matches=${matches}`
            );
            return matches;
          });
    console.log("filteredParams:", result);
    return result;
  }, [requestParams, selectedFilter]);

  // Fetch test cases when component mounts or project ID changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataFromApi = (await getCustomTestCaseAction(pathname.split("/")[2])) as ApiData[];
        if (dataFromApi && Array.isArray(dataFromApi)) {
          const formattedParams: CustomValueRow[] = dataFromApi.map((item) => ({
            id: item.id,
            name: item.name,
            value: item.value,
            // Normalize type to match DATA_TYPES (e.g., "string" -> "String")
            type: item.dataType.name.charAt(0).toUpperCase() + item.dataType.name.slice(1).toLowerCase(),
          }));
          setRequestParams(formattedParams);
          console.log("Fetched data:", formattedParams);
        } else {
          console.error("Invalid API response:", dataFromApi);
          toast.error("Failed to fetch test cases.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch test cases.");
      }
    };
    fetchData();
  }, [pathname]);

  // Add new test case
  const handleAddCustomValue = async (data: z.infer<typeof customValueSchema>) => {
    startTransition(async () => {
      try {
        const projectId = pathname.split("/")[2];
        const dataTypes = await getAllPredefinedAction();
        console.log("Available data types from API:", dataTypes);

        const selectedDataType = dataTypes.find(
          (dt: any) => dt.dataType.name.toLowerCase() === data.typeCase.toLowerCase()
        );

        if (!selectedDataType) {
          throw new Error(`Invalid data type: ${data.typeCase}`);
        }

        const payload = {
          projectId,
          dataTypeId: selectedDataType.dataType.id,
          name: data.nameCase,
          value: data.value,
        };

        const response = await createCustomTestCaseAction(payload);
        console.log("Create API response:", response);

        if (response.success && response.payload) {
          const newRow: CustomValueRow = {
            id: (response.payload as any).id,
            name: data.nameCase,
            value: data.value,
            type: data.typeCase.charAt(0).toUpperCase() + data.typeCase.slice(1).toLowerCase(),
          };
          setRequestParams((prev) => [...prev, newRow]);
        } else {
          throw new Error(response.message || "Failed to create custom value.");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create custom value.";
        toast.error(errorMessage);
        console.error("Create error:", errorMessage);
      }
    });
  };

  // Start editing a test case
  const handleEdit = (paramId: string) => {
    const originalIndex = requestParams.findIndex((p) => p.id === paramId);
    if (originalIndex === -1) return;
    const param = requestParams[originalIndex];
    setEditingIndex(originalIndex);
    setEditingValue({
      nameCase: param.name,
      value: param.value,
      typeCase: param.type.toLowerCase(),
    });
    console.log("Editing item:", param);
  };

  // Update an existing test case
  const handleEditCustomValue = async (
    data: z.infer<typeof customValueSchema>,
    index: number
  ) => {
    const itemToUpdate = requestParams[index];
    if (!itemToUpdate) return;

    startTransition(async () => {
      try {
        const dataTypes = await getAllPredefinedAction();
        console.log("Available data types for edit:", dataTypes);

        const selectedDataType = dataTypes.find(
          (dt: any) => dt.dataType.name.toLowerCase() === data.typeCase.toLowerCase()
        );

        if (!selectedDataType) {
          throw new Error(
            `Invalid data type: ${data.typeCase}. Available: ${dataTypes
              .map((dt: any) => dt.dataType.name)
              .join(", ")}`
          );
        }

        const updateTestCase = {
          projectId: pathname.split("/")[2],
          dataTypeId: selectedDataType.dataType.id,
          name: data.nameCase,
          value: data.value,
        };

        const response = await updateCustomTestCaseAction(itemToUpdate.id, updateTestCase);
        console.log("Update API response:", response);

        if (response.success) {
          setRequestParams((prev) =>
            prev.map((item, i) =>
              i === index
                ? {
                    ...item,
                    name: data.nameCase,
                    value: data.value,
                    type: data.typeCase.charAt(0).toUpperCase() + data.typeCase.slice(1).toLowerCase(),
                  }
                : item
            )
          );
          toast.success("Test case updated!");
        } else {
          throw new Error(response.message || "Failed to update test case.");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update test case.";
        toast.error(errorMessage);
        console.error("Update error:", errorMessage);
      } finally {
        setEditingIndex(null);
        setEditingValue(null);
      }
    });
  };

  // Delete a test case
  const handleDeleteConfirm = async () => {
    if (deleteId === null) return;
    const itemToDelete = requestParams.find((param) => param.id === deleteId);
    if (!itemToDelete) return;

    startTransition(async () => {
      try {
        const response = await deleteCustomTestCaseAction(itemToDelete.id);
        console.log("Delete API response:", response);

        if (!response || response.success === false) {
          throw new Error(response?.message || "Failed to delete test case.");
        }
        setRequestParams((prev) => prev.filter((param) => param.id !== deleteId));
        toast.success("Test case deleted!");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete test case.";
        toast.error(errorMessage);
        console.error("Delete error:", errorMessage);
      }
      setDeleteId(null);
    });
  };

  return (
    <div className="flex flex-col items-end gap-5 relative self-stretch w-full">
      <div className="inline-flex items-start justify-end gap-5 relative">
        <Select
          onValueChange={(value) => {
            console.log("Selected filter:", value);
            setSelectedFilter(value);
          }}
          value={selectedFilter}
        >
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
              {filteredParams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="pl-6 py-4 text-center text-slate-500">
                    No test cases found for this filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredParams.map((param) => (
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
                          console.log("Deleting item with id:", param.id);
                          setDeleteId(param.id);
                          setIsDialogOpen(true);
                        }}
                      />
                      <Edit
                        className="cursor-pointer size-4"
                        style={{ pointerEvents: isPending ? "none" : "auto", opacity: isPending ? 0.5 : 1 }}
                        onClick={() => handleEdit(param.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
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
