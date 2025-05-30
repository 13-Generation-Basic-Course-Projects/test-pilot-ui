import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export function CodeBlockResponse() {
	const codeString = `{
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer ***",
    "User-Agent": "TestPilot/1.0"
  },
  "body": {
    "name": "Morning Exercise",
    "frequency": "daily",
    "target": 30
  },
  "timestamp": "2025-05-20T19:00:00Z"
}`;

	return (
		<div className="rounded-lg overflow-hidden font-mono text-sm border border-gray-700">
			<div className="flex items-center bg-gray-800 px-4 py-2 border-b border-gray-700">
				<div className="flex space-x-2">
					<div className="w-3 h-3 rounded-full bg-red-500"></div>
					<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
					<div className="w-3 h-3 rounded-full bg-green-500"></div>
				</div>
				<div className="ml-4 text-xs text-gray-400">response.json</div>
			</div>
			<SyntaxHighlighter
				language="json"
				style={atomDark}
				showLineNumbers
				wrapLines
				customStyle={{
					margin: 0,
					padding: "1rem",
					background: "#1e1e1e",
					fontSize: "0.875rem",
					lineHeight: "1.5",
				}}
				lineNumberStyle={{
					color: "#6e7681",
					paddingRight: "1rem",
				}}
			>
				{codeString}
			</SyntaxHighlighter>
		</div>
	);
}
