"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export default function ApiRequestDetailTestRequest() {
  const [scenario, setScenario] = useState<string | undefined>("Undefined");
  const [scenarioNull, setScenarioNull] = useState<string>("Null");

  const handleRunUndefined = () => {
    setScenario("Undefined");
  };

  const handleRunNull = () => {
    setScenarioNull("Null");
  };

  const undefinedRequest = `{
  "habitTitle": undefined,
  "habitDescription": "Eat breakfast before 9am and shower..."
}`;

  const nullRequest = `{
  "habitTitle": null,
  "habitDescription": "Eat breakfast before 9am and shower..."
}`;

  return (
    <div className="w-full space-y-4">
      {/* Top right Run All button */}
      <div className="flex justify-end">
        <Button onClick={() => { handleRunUndefined(); handleRunNull(); }} className="bg-black text-white">
          Run All <Play className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Test Case: Undefined */}
      <div className="border rounded-md p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Field:</span>
            <Badge variant="outline" className="text-blue-500">
              habitTitle
            </Badge>
          </div>
          <Button onClick={handleRunUndefined} className="bg-black text-white">
            Run <Play className="ml-1 h-4 w-4"/>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Scenario:</span>
          <Badge className="bg-gray-800 text-white rounded-full px-3 py-1 text-xs">
            {scenario}
          </Badge>
        </div>
        <div>
          <p className="mb-1 font-medium">Request Body</p>
          <SyntaxHighlighter
            language="json" customStyle={{  borderRadius: "12px" , backgroundColor: "white" , border: "1px solid #e5e7eb"}}
          >
            {undefinedRequest}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Test Case: Null */}
      <div className="border rounded-md p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Field:</span>
            <Badge variant="outline" className="text-blue-500">
              habitTitle
            </Badge>
          </div>
          <Button onClick={handleRunNull} className="bg-black text-white">
            Run <Play className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Scenario:</span>
          <Badge className="text-white rounded-full px-3 py-1 text-xs">
            {scenarioNull}
          </Badge>
        </div>
        <div>
          <p className="mb-1 font-medium">Request Body</p>
          <SyntaxHighlighter language="json" customStyle={{  borderRadius: "12px" , backgroundColor: "white" , border: "1px solid #e5e7eb"}}>
            {nullRequest}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
