"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HistoryData } from "@/components/history/history-data";
import { mockHistoryResponses } from "@/lib/constants";
import { PreviewSkeleton } from "../preview-skeleton";
import { isValidJSON } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import { useRouter } from "next/navigation";

export default function History() {
	const [previewData, setPreviewData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	const handleRowClick = async (index: number) => {
		setLoading(true);
		setTimeout(() => {
			setPreviewData(mockHistoryResponses[index]);
			setLoading(false);
		}, 300);
	};

	const navigateToMonitoring = () => {
		router.push(
			"/project/project-1/collection/collection-users/request/endpoint-users-1/monitoring"
		);
	};

	return (
		// --- (CHANGE 1) ---
		// Make the main container a full-height flex column. This is the foundation for the fix.
		<div className="flex flex-col h-screen w-full bg-white p-6 overflow-hidden">
			{/* Header */}
			{/* --- (CHANGE 2) --- */}
			{/* Make the header a non-shrinking flex item with a bottom margin. */}
			<div className="flex justify-between items-center flex-shrink-0 mb-4">
				<h1 className="text-2xl font-bold text-gray-900">
					History: Test Pilot API
				</h1>
				<Button className="cursor-pointer" onClick={navigateToMonitoring}>
					Run All History
				</Button>
			</div>

			{/* --- (CHANGE 3) --- */}
			{/* The ResizablePanelGroup will now grow to fill the remaining vertical space.
                'min-h-0' is crucial to prevent it from overflowing its flex container. */}
			<ResizablePanelGroup
				direction="horizontal"
				className="rounded-lg border flex-grow min-h-0"
			>
				<ResizablePanel defaultSize={65} minSize={30}>
					{/* The h-full and overflow-y-auto on this inner div are now effective */}
					<div className="p-6 h-full overflow-y-auto">
						<HistoryData setActiveRequestIndex={handleRowClick} />
					</div>
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel defaultSize={35} minSize={30}>
					{/* The h-full and overflow-y-auto on this inner div are also now effective */}
					<div className="p-6 space-y-6 h-full overflow-y-auto">
						{loading ? (
							<PreviewSkeleton />
						) : previewData && previewData.shouldShowPreview ? (
							<>
								{/* ... all your preview content remains the same ... */}
								{/* Status Badge */}
								<div className="flex items-center gap-3">
									<div
										className={`px-3 py-1 rounded-full text-sm font-medium ${
											previewData.badgeStatus === "passed"
												? "bg-green-100 text-green-600"
												: "bg-red-100 text-red-600"
										}`}
									>
										{previewData.badgeStatus === "passed" ? "Passed" : "Failed"}
									</div>
									<h2 className="text-xl font-semibold">Request Details</h2>
								</div>

								{/* Request Summary */}
								<div className="space-y-4">
									<div className="flex space-x-2 items-center">
										<p className="w-20 shrink-0">Status:</p>
										<div
											className={`border border-[#E2E8F0] rounded-md px-4 py-1 text-sm ${
												previewData.status.includes("400")
													? "text-[#17C964]"
													: previewData.status.includes("201") ||
													  previewData.status.includes("200")
													? "text-[#006FEE]"
													: "text-[#EF4444]"
											}`}
										>
											{previewData.status}
										</div>
									</div>
									<div className="flex space-x-2 items-center">
										<p className="w-20 shrink-0">Method:</p>
										<div className="border border-[#E2E8F0] rounded-md px-4 py-1 text-sm text-[#006FEE]">
											{previewData.method}
										</div>
									</div>
									<div className="flex space-x-2 items-start">
										<p className="w-20 shrink-0 pt-1">Endpoint:</p>
										<p className="break-all font-mono text-sm pt-1">
											{previewData.endpoint}
										</p>
									</div>
								</div>

								<hr className="text-[#94A3B8]" />

								{/* Response */}
								<h3 className="text-xl">Response</h3>
								<div className="rounded-lg border overflow-hidden max-h-80">
									{previewData.responseBody ? (
										isValidJSON(previewData.responseBody) ? (
											<SyntaxHighlighter
												language="json"
												style={atomDark}
												wrapLongLines={true}
												customStyle={{
													margin: 0,
													padding: "16px",
													height: "100%",
													fontSize: "12px",
													backgroundColor: "#1E293B",
													whiteSpace: "pre-wrap",
													wordBreak: "break-all",
												}}
												codeTagProps={{
													style: {
														fontFamily: '"JetBrains Mono", monospace',
													},
												}}
											>
												{previewData.responseBody}
											</SyntaxHighlighter>
										) : (
											<div className="bg-[#1E293B] p-4">
												<pre className="text-red-500 whitespace-pre-wrap">
													Invalid or corrupted JSON response
												</pre>
											</div>
										)
									) : (
										<div className="bg-[#1E293B] p-4">
											<pre className="text-gray-400 whitespace-pre-wrap">
												No response
											</pre>
										</div>
									)}
								</div>

								{/* Failure Reason (if failed) */}
								{previewData.badgeStatus === "failed" &&
									previewData.failureReason && (
										<div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm">
											<strong>⚠️ Test Failed:</strong>{" "}
											{previewData.failureReason}
										</div>
									)}
							</>
						) : previewData && !previewData.shouldShowPreview ? (
							<div className="text-center text-gray-500 h-full flex items-center justify-center">
								No preview available – backend returned an internal error.
							</div>
						) : (
							<div className="text-center text-gray-500 h-full flex items-center justify-center">
								Select a request to view details
							</div>
						)}
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
