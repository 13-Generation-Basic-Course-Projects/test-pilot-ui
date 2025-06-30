// components/code-snippet/code-snippet.tsx
"use client";

import { useState, ChangeEvent } from "react";
import { Copy } from "lucide-react";
import { CodeSnippetUI } from "@/components/code-snippet/code-snippet-ui";
import { useRequestStore } from "@/store/request-url-slice";
import { useApiBodyStore } from "@/store/body-api-slice";
import { generateCodeSnippets } from "@/lib/snippet-generate";

const CodeSnippet = () => {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<string>("curl"); 
  // Get data from stores
  const { method, url } = useRequestStore();
  const { rawBody } = useApiBodyStore();

  // Generate snippets dynamically
  const snippets = generateCodeSnippets(method || "GET", url || "", rawBody);

  // Find the selected snippet based on the language
  const selectedSnippet = snippets.find(
    (snippet) => snippet.language === language
  );

  const handleCopy = () => {
    if (selectedSnippet?.code) {
      navigator.clipboard.writeText(selectedSnippet.code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); 
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="flex items-center flex-col gap-3">
      <div className="border rounded-md w-[30rem] p-2">
        <div className="flex items-center justify-between rounded-md focus:outline-none w-[100%] focus:ring-2 focus:ring-blue-100">
          <select
            value={language}
            onChange={handleChange}
            className="px-4 py-1 rounded-md focus:outline-none w-[135px]"
          >
            {snippets.map((snippet) => (
              <option key={snippet.language} value={snippet.language} className="">
                {snippet.label}
              </option>
            ))}
          </select>
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