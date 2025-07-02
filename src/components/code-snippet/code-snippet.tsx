// components/code-snippet/code-snippet.tsx
"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { CodeSnippetUI } from "@/components/code-snippet/code-snippet-ui";
import { useRequestStore } from "@/store/request-url-slice";
import { useApiBodyStore } from "@/store/body-api-slice";
import { generateCodeSnippets } from "@/lib/snippet-generate";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CodeSnippet = () => {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<string>("curl");
  const { method, url } = useRequestStore();
  const { rawBody } = useApiBodyStore();

  const snippets = generateCodeSnippets(method || "GET", url || "", rawBody);
  const selectedSnippet = snippets.find((snippet) => snippet.language === language);

  const handleCopy = () => {
    if (selectedSnippet?.code) {
      navigator.clipboard.writeText(selectedSnippet.code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  return (
    <div className="flex items-center flex-col gap-3">
      <div className="border rounded-md w-[30rem] p-2">
        <div className="flex items-center justify-between rounded-md focus:outline-none w-[100%] focus:ring-2 focus:ring-blue-100">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[135px] from-gray-100 to-gray-200 text-gray-800 rounded-md px-4 py-2 shadow-sm hover:from-gray-200 hover:to-gray-300 transition-all duration-200">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {snippets.map((snippet) => (
                  <SelectItem
                    key={snippet.language}
                    value={snippet.language}
                    className="hover:bg-gray-200 text-gray-900"
                  >
                    {snippet.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="relative">
            <Copy size={16} onClick={handleCopy} className="cursor-pointer" />
            {copied && (
              <span className="absolute top-[-20px] right-0 text-xs bg-gray-200 px-1 rounded">
                Copied!
              </span>
            )}
          </div>
        </div>
        <div className="max-w-lg">
          {selectedSnippet && (
            <CodeSnippetUI
              language={selectedSnippet.language}
              code={selectedSnippet.code}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeSnippet;