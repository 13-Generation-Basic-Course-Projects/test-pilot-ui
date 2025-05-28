"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronDown } from "lucide-react";
import CodeEditor from "./code-editor";
import TestCaseTableBody from "./test-case-table-body-ui";
import TestRequestBody from "./test-request-body";

export function ApiRequestDetialBody() {
  const [jsonCode, setJsonCode] = useState(`{
    "name": "John Doe",
    "age": 30,
    "isActive": true
  }`);

  const [bodyType, setBodyType] = useState<"none" | "raw">("raw");

  const handleCodeChange = (value: string | undefined) => {
    setJsonCode(value || "");
  };

  return (
    <div>
      <h1 className="pb-4">Body</h1>

      {/* Radio to toggle none/raw */}
      <div className="pt-4 pb-4">
        <RadioGroup
          value={bodyType}
          onValueChange={(value) => setBodyType(value as "none" | "raw")}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="r1" />
            <Label htmlFor="r1">None</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="raw" id="r2" />
            <Label htmlFor="r2">Raw</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Only show Tabs if Raw is selected */}
      {bodyType === "raw" && (
        <Tabs defaultValue="raw-body" className="w-[900px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="raw-body">Raw body</TabsTrigger>
            <TabsTrigger value="test-case">Test Case</TabsTrigger>
            <TabsTrigger value="test-request">Test Request</TabsTrigger>
          </TabsList>

          {/* Raw Body Tab */}
          <TabsContent value="raw-body">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Body Format
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem>JSON</DropdownMenuItem>
                  <DropdownMenuItem>XML</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <CodeEditor
              language="json"
              value={jsonCode}
              onChange={handleCodeChange}
              height="300px"
              readOnly={false}
            />
          </TabsContent>

          {/* Test Case Tab */}
          <TabsContent value="test-case">
            <TestCaseTableBody />
          </TabsContent>

          {/* Test Request Tab */}
          <TabsContent value="test-request">
            <TestRequestBody />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
