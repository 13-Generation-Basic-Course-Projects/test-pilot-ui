"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useEffect, useRef } from "react";

// The TestResult interface remains the same
interface TestResult {
	id: number;
	testName: string;
	status: "pending" | "loading" | "passed" | "failed";
	date: string;
	method: string;
	endpoint: string;
	httpStatus: number;
	statusText: string;
	metadata: any;
	logs: Array<{
		level: "INFO" | "WARNING" | "ERROR" | "DEBUG";
		message: string;
		source?: string;
	}>;
}

interface RequestMetadataWithLogsProps {
	selectedTest: TestResult;
}

export function RequestMetadataWithLogs({
	selectedTest,
}: RequestMetadataWithLogsProps) {
	const scrollViewportRef = useRef<HTMLDivElement>(null);

	// This useEffect will now auto-scroll to the bottom of the logs/metadata
	useEffect(() => {
		const viewport = scrollViewportRef.current;
		if (viewport) {
			viewport.scrollTop = viewport.scrollHeight;
		}
	}, [selectedTest]);

	return (
		<div className="space-y-4 flex-1 overflow-hidden">
			{/* Request Metadata Section */}
			<div className="space-y-3">
				<p className="text-lg font-semibold truncate">Request Metadata</p>
				<div className="overflow-hidden">
					{/* FIX #1: Added a fixed height class `h-[400px]` here.
                      You can change this value to whatever height you need.
                    */}
					<ScrollArea className="w-full h-[300px] rounded-xl">
						{/* We pass the ref to the special Viewport component for auto-scrolling */}
						<ScrollArea ref={scrollViewportRef} className="w-full h-full">
							{selectedTest.metadata ? (
								// FIX #2: Removed redundant nested divs for simplicity
								<SyntaxHighlighter
									language="json"
									style={atomDark}
									wrapLongLines={true}
									showLineNumbers
									customStyle={{
										margin: 0,
										padding: "16px",
										height: "100%",
										fontSize: "12px",
										borderRadius: "10px",
										// --- ADD THESE TWO LINES ---
										whiteSpace: "pre-wrap", // Allows text to wrap to the next line
										wordBreak: "break-all", // Forces long words to break
									}}
									codeTagProps={{
										style: {
											fontFamily: '"JetBrains Mono", monospace',
										},
									}}
								>
									{JSON.stringify(selectedTest.metadata, null, 2)}
								</SyntaxHighlighter>
							) : (
								<div className="p-4 text-muted-foreground text-sm">
									No metadata available
								</div>
							)}
						</ScrollArea>
					</ScrollArea>
				</div>
			</div>

			{/* You can add your Logs section here following the same pattern */}
		</div>
	);
}

// NOTE: I've also updated the auto-scrolling `useEffect` to be more reliable
// with Shadcn's `ScrollArea` by placing the `ref` on the `ScrollArea.Viewport` component.
// You'll need to update your import to get the `Viewport` sub-component if you haven't already.
// import { ScrollArea } from "@/components/ui/scroll-area";
