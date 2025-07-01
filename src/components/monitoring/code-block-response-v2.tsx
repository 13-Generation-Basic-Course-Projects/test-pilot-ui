"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

type ResponseCodeBlockProps = {
	data: any;
};

export function ResponseCodeBlock({ data }: ResponseCodeBlockProps) {
	// Pretty-print the JSON data to be displayed
	const codeString = JSON.stringify(data, null, 2);

	return (
		// The break-all class is no longer needed here
		<div className="rounded-lg overflow-hidden font-mono text-sm border bg-[#282c34]">
			<div className="flex items-center bg-gray-800/50 px-4 py-2 border-b border-gray-700">
				<div className="flex space-x-2">
					<div className="w-3 h-3 rounded-full bg-red-500"></div>
					<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
					<div className="w-3 h-3 rounded-full bg-green-500"></div>
				</div>
				<div className="ml-4 text-xs text-gray-400">response.json</div>
			</div>
			<SyntaxHighlighter
				language="json"
				style={oneDark}
				showLineNumbers
				wrapLines={true} // Keep this to respect existing line breaks
				customStyle={{
					margin: 0,
					padding: "1rem",
					background: "transparent",
					fontSize: "0.875rem",
					lineHeight: "1.5",
				}}
				lineNumberStyle={{
					color: "#6e7681",
					paddingRight: "1rem",
					minWidth: "2.5em",
					textAlign: "right",
				}}
				// 👇 THE FIX: Apply styles directly to the <code> tag
				codeTagProps={{
					style: {
						// This forces long, unbroken strings to wrap
						wordBreak: "break-all",
						// This ensures that the wrapping behavior respects the code's format
						whiteSpace: "pre-wrap",
					},
				}}
			>
				{codeString}
			</SyntaxHighlighter>
		</div>
	);
}
