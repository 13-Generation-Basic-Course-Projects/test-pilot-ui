"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

interface TestRequestProps {
  parsedData?: Record<string, JSONValue> | null;
}

export default function TestRequestBody({ parsedData }: TestRequestProps) {
  const [scenarios, setScenarios] = useState<{ field: string; scenario: string; request: string }[]>([]);

  useEffect(() => {
    if (parsedData) {
      const newScenarios = Object.entries(parsedData).map(([field, value]) => {
        const scenario = value === undefined ? "Undefined" : value === null ? "Null" : "Defined";
        const request = JSON.stringify({ [field]: value }, null, 2);
        return { field, scenario, request };
      });
      setScenarios(newScenarios);
    } else {
      setScenarios([]);
    }
  }, [parsedData]);

  const handleRunAll = () => {
    // Optionally trigger all scenarios if needed
    console.log("Running all scenarios");
  };

  const handleRunScenario = (index: number) => {
    // Optionally handle individual run actions
    console.log(`Running scenario for ${scenarios[index].field}`);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleRunAll} className="bg-black text-white">
          Run All <Play className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {scenarios.map((scenario, index) => (
        <div key={index} className="border rounded-md p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">Field:</span>
              <Badge variant="outline" className="text-blue-500">
                {scenario.field}
              </Badge>
            </div>
            <Button onClick={() => handleRunScenario(index)} className="bg-black text-white">
              Run <Play className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Scenario:</span>
            <Badge className="bg-gray-800 text-white rounded-full px-3 py-1 text-xs">
              {scenario.scenario}
            </Badge>
          </div>
          <div>
            <p className="mb-1 font-medium">Request Body</p>
            <SyntaxHighlighter
              language="json"
              customStyle={{ borderRadius: "12px", backgroundColor: "white", border: "1px solid #e5e7eb" }}
            >
              {scenario.request}
            </SyntaxHighlighter>
          </div>
        </div>
      ))}
    </div>
  );
}