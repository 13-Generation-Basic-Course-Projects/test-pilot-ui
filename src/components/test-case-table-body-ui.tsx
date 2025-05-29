"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, X } from "lucide-react";
import clsx from "clsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

interface ParamTableProps {
  mode?: "path" | "query";
  parsedData?: Record<string, JSONValue> | null;
}


interface ParamRow {
  Field: string;
  Value: string;
  "Data Type": string;
  "Test Case": string[];
}

export default function TestCaseTableBody({
  mode = "path",
  parsedData,
}: ParamTableProps) {
  const [rows, setRows] = useState<ParamRow[]>([
    { Field: "habitId", Value: "1", "Data Type": "String", "Test Case": [] },
  ]);

  useEffect(() => {
    if (parsedData) {
      const newRows = Object.entries(parsedData).map(([key, value]) => {
        const dataType =
          typeof value === "string"
            ? "String"
            : typeof value === "number"
            ? "Integer"
            : typeof value === "boolean"
            ? "Boolean"
            : Array.isArray(value)
            ? "Array"
            : "String";
        return {
          Field: key,
          Value: String(value),
          "Data Type": dataType,
          "Test Case": [],
        };
      });
      setRows(
        newRows.length > 0
          ? newRows
          : [{ Field: "", Value: "", "Data Type": "String", "Test Case": [] }]
      );
    } else {
      setRows([
        { Field: "", Value: "", "Data Type": "String", "Test Case": [] },
      ]);
    }
  }, [parsedData]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      { Field: "", Value: "", "Data Type": "String", "Test Case": [] },
    ]);
  };

  const handleChange = (
    index: number,
    field: keyof ParamRow,
    newValue: string | string[]
  ) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = newValue as never;
    setRows(updatedRows);
  };

  const handleToggleCase = (index: number, selectedCase: string) => {
    const updatedRows = [...rows];
    const currentCases = updatedRows[index]["Test Case"];
    const exists = currentCases.includes(selectedCase);
    updatedRows[index]["Test Case"] = exists
      ? currentCases.filter((c) => c !== selectedCase)
      : [...currentCases, selectedCase];
    setRows(updatedRows);
  };

  const handleRemoveCase = (index: number, caseToRemove: string) => {
    if (mode === "path") {
      const updatedRows = [...rows];
      updatedRows[index]["Test Case"] = updatedRows[index]["Test Case"].filter(
        (c) => c !== caseToRemove
      );
      setRows(updatedRows);
    }
  };

  const typeOptions = [
    "String",
    "Date",
    "Integer",
    "Boolean",
    "UUID",
    "ENUM",
    "Array",
  ];
  const caseOptions = [
    "Empty String",
    "Null Value",
    "Length",
    "Number String",
    "Alphanumeric Mix",
    "Only Space",
    "Special Character",
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 px-4">
      <Table className="border border-gray-300 rounded-md shadow-sm w-full table-auto">
        <TableHeader>
          <TableRow className="border border-gray-300 bg-gray-100">
            <TableHead className="border border-gray-300 text-sm font-semibold text-gray-700">
              Field
            </TableHead>
            <TableHead className="border border-gray-300 text-sm font-semibold text-gray-700">
              Value
            </TableHead>
            <TableHead className="border border-gray-300 text-sm font-semibold text-gray-700">
              Data Type
            </TableHead>
            <TableHead className="border border-gray-300 text-sm font-semibold text-gray-700">
              Test Case
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              className="border border-gray-300 hover:bg-gray-50"
            >
              <TableCell className="border border-gray-300">
                <input
                  type="text"
                  value={row.Field}
                  onChange={(e) => handleChange(index, "Field", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded "
                  placeholder="Enter field"
                />
              </TableCell>
              <TableCell className="border border-gray-300">
                <input
                  type="text"
                  value={row.Value}
                  onChange={(e) => handleChange(index, "Value", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded "
                  placeholder="Enter value"
                />
              </TableCell>
              <TableCell className="border border-gray-300">
                <Select
                  value={row["Data Type"]}
                  onValueChange={(value) =>
                    handleChange(index, "Data Type", value)
                  }
                >
                  <SelectTrigger className="max-w-full px-2 py-1 bg-blue-100 text-sm rounded-xl">
                    <SelectValue placeholder="Select a data type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="border border-gray-300">
                <div className="flex flex-wrap gap-1 mb-2">
                  {row["Test Case"].slice(0, 1).map((c, i) => (
                    <span
                      key={i}
                      className="bg-black text-white text-xs px-2 py-2 rounded-full flex items-center gap-1"
                    >
                      {c}
                      {mode === "path" && (
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleRemoveCase(index, c)}
                        />
                      )}
                    </span>
                  ))}
                  {row["Test Case"].length > 1 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-2xl text-black">...</button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 max-h-64 ">
                        {row["Test Case"].map((c, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between px-2 py-1 text-sm"
                          >
                            <span>{c}</span>
                            {mode === "path" && (
                              <X
                                className="w-3 h-3 cursor-pointer"
                                onClick={() => handleRemoveCase(index, c)}
                              />
                            )}
                          </div>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center justify-between px-3 py-2 text-sm rounded bg-gray-100"
                    >
                      <Plus className="w-4 h-4 text-black" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-48 max-w-full">
                    {caseOptions.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => handleToggleCase(index, option)}
                        className={clsx(
                          "text-sm cursor-pointer",
                          row["Test Case"].includes(option) &&
                            "bg-blue-100 font-semibold rounded"
                        )}
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          <TableRow
            onClick={handleAddRow}
            className="border border-gray-300 cursor-pointer hover:bg-gray-100"
          >
            <TableCell
              colSpan={4}
              className="border border-gray-300 text-sm py-3 text-gray-600"
            >
              + Add
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
