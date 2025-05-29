"use client";
import React, { ChangeEvent, useState } from "react";
import { Copy } from "lucide-react";
import { CodeSnippetUI } from "@/components/code-snippet-ui";
import { CodeSnippetValue } from "@/lib/constants";

const CodeSnippet = () => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		if (selectedSnippet?.code) {
			navigator.clipboard.writeText(selectedSnippet.code).then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 1500); // Hide after 1.5s
			});
		}
	};

	const [language, setLanguage] = useState<string>("javascript");

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setLanguage(e.target.value);
	};

	// Find the selected snippet based on the language
	const selectedSnippet = CodeSnippetValue.find(
		(snippet) => snippet.language === language
	);

	return (
		<div className="flex items-center flex-col gap-3">
			<div className=" border rounded-md w-[30rem] p-2">
				<div className="flex items-center  justify-between  rounded-md focus:outline-none w-[100%] focus:ring-2 focus:ring-blue-100">
					<select
						value={language}
						onChange={handleChange}
						className="px-4 py-1  rounded-md focus:outline-none w-[130px] "
					>
						{CodeSnippetValue.map((snippet) => (
							<option key={snippet.language} value={snippet.language}>
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
