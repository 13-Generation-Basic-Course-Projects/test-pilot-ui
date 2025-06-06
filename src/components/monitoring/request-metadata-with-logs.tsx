"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useEffect, useRef } from "react";

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
	const scrollAreaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollAreaRef.current) {
			const scrollContainer = scrollAreaRef.current.querySelector(
				"[data-radix-scroll-area-viewport]"
			);
			if (scrollContainer) {
				scrollContainer.scrollTop = scrollContainer.scrollHeight;
			}
		}
	}, [selectedTest]);

	return (
		<div className="space-y-4 min-w-0 flex-1 overflow-hidden w-full">
			{/* Request Metadata Section */}
			<div className="space-y-3 min-w-0 w-full">
				<p className="text-lg font-semibold truncate">Request Metadata</p>
				<div className="rounded-lg overflow-hidden border border-[#E2E8F0] w-full max-w-full min-w-0">
					<ScrollArea ref={scrollAreaRef} className="h-80 w-full">
						{selectedTest.metadata ? (
							<div
								className="w-full overflow-hidden max-w-full min-w-0"
								style={{ width: "100%" }}
							>
								<div className="overflow-hidden" style={{ maxWidth: "100%" }}>
									<SyntaxHighlighter
										language="json"
										style={atomDark}
										customStyle={{
											margin: 0,
											padding: 16,
											borderRadius: 0,
											fontSize: "12px",
											width: "100%",
											maxWidth: "100%",
											minWidth: 0,
											height: "320px",
											maxHeight: "320px",
											overflow: "hidden",
											wordBreak: "break-all",
											whiteSpace: "pre-wrap",
											boxSizing: "border-box",
										}}
										showLineNumbers={false}
										wrapLongLines={true}
										lineProps={{
											style: {
												wordBreak: "break-all",
												whiteSpace: "pre-wrap",
												maxWidth: "100%",
												overflow: "hidden",
												display: "block",
											},
										}}
										codeTagProps={{
											style: {
												wordBreak: "break-all",
												whiteSpace: "pre-wrap",
												maxWidth: "100%",
												overflow: "hidden",
											},
										}}
									>
										{JSON.stringify(selectedTest.metadata, null, 2)}
									</SyntaxHighlighter>
								</div>
							</div>
						) : (
							<div className="bg-[#F8FAFC] p-4 text-[#94A3B8] text-sm">
								<span className="truncate">No metadata available</span>
							</div>
						)}
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
