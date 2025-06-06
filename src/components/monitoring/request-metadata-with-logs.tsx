"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

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
	return (
		<div className="space-y-4 min-w-0">
			{/* Request Metadata Section */}
			<div className="space-y-3 min-w-0">
				<p className="text-lg font-semibold truncate">Request Metadata</p>
				<div className="rounded-lg overflow-hidden border border-[#E2E8F0] w-full">
					<ScrollArea className="max-h-64 w-full">
						{selectedTest.metadata ? (
							<div className="w-full overflow-hidden">
								<SyntaxHighlighter
									language="json"
									style={atomDark}
									customStyle={{
										margin: 0,
										borderRadius: 0,
										fontSize: "14px",
										width: "100%",
										maxWidth: "100%",
										overflow: "auto",
									}}
									wrapLongLines={true}
								>
									{JSON.stringify(selectedTest.metadata, null, 2)}
								</SyntaxHighlighter>
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
