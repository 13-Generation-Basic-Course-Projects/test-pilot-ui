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
import { ChevronDown, FileJson } from "lucide-react";
import CodeEditor from "./code-editor";
import TestCaseTableBody from "./test-case-table-body-ui";
import TestRequestBody from "./test-request-body";
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export function ApiRequestDetialBody() {
  const [jsonCode, setJsonCode] = useState(`{
    "name": "John Doe",
    "age": 30,
    "isActive": true
  }`);
  const [bodyType, setBodyType] = useState<"none" | "raw">("raw");
  const [parsedData, setParsedData] = useState<Record<string, JSONValue> | null>(null);

  const [activeTab, setActiveTab] = useState("raw-body");

  const handleCodeChange = (value: string | undefined) => {
    setJsonCode(value || "");
  };

  const handleParseBody = () => {
    try {
      if (jsonCode.trim() === "") {
        setParsedData(null);
        return;
      }
      const parsed = JSON.parse(jsonCode);
      setParsedData(parsed);
      setActiveTab("test-case"); // Navigate to Test Case tab
    } catch (error) {
      console.error("Invalid JSON:", error);
      setParsedData(null);
    }
  };

  return (
    <div>
      <h1 className="pb-4">Body</h1>
      <div className="pt-4 pb-4 flex">
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

      {bodyType === "raw" && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[900px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="raw-body">Raw body</TabsTrigger>
            <TabsTrigger value="test-case">Test Case</TabsTrigger>
            <TabsTrigger value="test-request">Test Request</TabsTrigger>
          </TabsList>

          <TabsContent value="raw-body">
            <div className="flex justify-between pt-8 pb-4">
              <div>
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
              </div>
              <div>
                <Button onClick={handleParseBody}>
                  <FileJson />
                  Parse Body
                </Button>
              </div>
            </div>
            <CodeEditor
              language="json"
              value={jsonCode}
              onChange={handleCodeChange}
              height="300px"
              readOnly={false}
            />
          </TabsContent>

          <TabsContent value="test-case">
            <TestCaseTableBody parsedData={parsedData} />
          </TabsContent>

          <TabsContent value="test-request">
            <TestRequestBody parsedData={parsedData} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}