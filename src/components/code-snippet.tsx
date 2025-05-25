"use client";
import React, { ChangeEvent, useState } from "react";
import codeSnippets from "../../data/codeSnippet";
import { CodeXml, Copy, X } from "lucide-react";
import Code_Snippet from "@/components/ui/CodeSnippetUI";

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
	const selectedSnippet = codeSnippets.find(
		(snippet) => snippet.language === language
	);

	return (
		<div className="flex items-center flex-col gap-3">
			<div className="bg-white border-1 border-gray-100 rounded-lg shadow-md flex items-center justify-between p-2 w-full max-w-[400px]">
				<div className="flex items-center space-x-3">
					<CodeXml />
					<span className="text-gray-800 text-lg font-medium">
						Code snippet
					</span>
				</div>
				<X />
			</div>

			<div className=" border rounded-md w-[390px] p-2">
				<div className="flex items-center  justify-between  rounded-md focus:outline-none w-[100%] focus:ring-2 focus:ring-blue-100">
					<select
						value={language}
						onChange={handleChange}
						className="px-4 py-1  rounded-md focus:outline-none w-[130px] "
					>
						{codeSnippets.map((snippet) => (
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
				<div className="">
					{selectedSnippet && (
						<Code_Snippet
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
