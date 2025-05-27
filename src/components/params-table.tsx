"use client";
import { useState } from "react";
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

interface ParamTableProps {
  mode?: "path" | "query";
}


export default function ParamTable({ mode = "path" }: ParamTableProps) {
  const [rows, setRows] = useState<ParamRow[]>([
    { key: "habitId", value: "1", type: "String", cases: [] },
  ]);

  const handleAddRow = () => {
    setRows([...rows, { key: "", value: "", type: "String", cases: [] }]);
  };

  interface ParamRow {
  key: string;
  value: string;
  type: string;
  cases: string[];
}

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
    const currentCases = updatedRows[index].cases;
    const exists = currentCases.includes(selectedCase);
    updatedRows[index].cases = exists
      ? currentCases.filter((c) => c !== selectedCase)
      : [...currentCases, selectedCase];
    setRows(updatedRows);
  };

  const handleRemoveCase = (index: number, caseToRemove: string) => {
    if (mode === "path") {
      const updatedRows = [...rows];
      updatedRows[index].cases = updatedRows[index].cases.filter(
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
    "File",
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
            <TableHead className="border border-gray-300 text-sm font-semibold text-gray-700">Key</TableHead>
            <TableHead className="border border-gray-300 text-sm font-semibold text-gray-700">Value</TableHead>
            <TableHead className="border border-gray-300 text-sm font-semibold text-gray-700">Type</TableHead>
            <TableHead className="border border-gray-300 text-sm font-semibold text-gray-700">Case</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index} className="border border-gray-300 hover:bg-gray-50">
              <TableCell className="border border-gray-300">
                <input
                  type="text"
                  value={row.key}
                  onChange={(e) => handleChange(index, "key", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded focus:outline-none"
                  placeholder="Enter key"
                />
              </TableCell>
              <TableCell className="border border-gray-300">
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) => handleChange(index, "value", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded focus:outline-none"
                  placeholder="Enter value"
                />
              </TableCell>
              {/* type section */}
              <TableCell className="border border-gray-300">
                <select
                  value={row.type}
                  onChange={(e) => handleChange(index, "type", e.target.value)}
                  className="w-full px-2 py-1 text-sm rounded focus:outline-none"
                >
                  {typeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </TableCell>
              {/* case section */}
              <TableCell className="border border-gray-300">
                <div className="flex flex-wrap gap-1 mb-2">
                  {row.cases.slice(0, 1).map((c, i) => (
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
                  {row.cases.length > 1 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-2xl text-black">...</button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 max-h-64 overflow-y-auto">
                        {row.cases.map((c, i) => (
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
                  <DropdownMenuContent className="max-h-48 overflow-y-auto w-[220px]">
                    {caseOptions.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => handleToggleCase(index, option)}
                        className={clsx(
                          "text-sm cursor-pointer",
                          row.cases.includes(option) &&
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
            <TableCell colSpan={4} className="border border-gray-300 text-sm py-3 text-gray-600">
              + Add
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
