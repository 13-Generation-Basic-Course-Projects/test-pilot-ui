// app/project/history/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HistoryData } from "@/components/history/history-data";
import { mockHistoryResponses } from "@/lib/constants";
import { PreviewSkeleton } from "../preview-skeleton";
import { isValidJSON } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

export default function History() {
	const [previewData, setPreviewData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const handleRowClick = async (index: number) => {
		setLoading(true);
		setTimeout(() => {
			setPreviewData(mockHistoryResponses[index]);
			setLoading(false);
		}, 300);
	};

	return (
		<div className="w-full mx-auto mt-10 bg-white p-8 space-y-10">
			{/* Header */}
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-gray-900">
					History: Test Pilot API
				</h1>
				<Button className="cursor-pointer">Run All History</Button>
			</div>

			{/* Grid Layout */}
			<div className="grid grid-cols-12 gap-10">
				{/* Left: Table */}
				<div className="col-span-8 pr-10">
					<HistoryData setActiveRequestIndex={handleRowClick} />
				</div>

				{/* Right: Request Details */}
				<div className="col-span-4 pl-10 border-l min-w-[400px] space-y-6">
					{loading ? (
						<PreviewSkeleton />
					) : previewData && previewData.shouldShowPreview ? (
						<>
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
								<div className="flex space-x-2">
									<p>Status:</p>
									<div
										className={`border border-[#E2E8F0] rounded-md px-4 py-1 ${
											previewData.status.includes("200")
												? "text-[#17C964]"
												: previewData.status.includes("201")
												? "text-[#006FEE]"
												: "text-[#EF4444]"
										}`}
									>
										{previewData.status}
									</div>
								</div>
								<div className="flex space-x-2">
									<p>Method:</p>
									<div className="border border-[#E2E8F0] rounded-md px-4 py-1 text-[#006FEE]">
										{previewData.method}
									</div>
								</div>
								<div className="flex space-x-2">
									<p>Endpoint:</p>
									<p>{previewData.endpoint}</p>
								</div>
							</div>

							<hr className="text-[#94A3B8]" />

							{/* Request Metadata */}
							<h3 className="text-xl">Request Metadata</h3>
							<div className="bg-[#F8FAFC] p-4 rounded-md text-sm font-mono overflow-auto max-h-60">
								<pre className="whitespace-pre-wrap">
									{previewData.requestBody || "No request body"}
								</pre>
							</div>

							{/* Response */}
							<h3 className="text-xl">Response</h3>
							<div className="bg-[#F8FAFC] p-4 rounded-md text-sm font-mono overflow-auto max-h-60">
								{previewData.responseBody ? (
									isValidJSON(previewData.responseBody) ? (
										<pre className="whitespace-pre-wrap">
											{previewData.responseBody}
										</pre>
									) : (
										<pre className="text-red-500 whitespace-pre-wrap">
											Invalid or corrupted JSON response
										</pre>
									)
								) : (
									<pre className="whitespace-pre-wrap">No response</pre>
								)}
							</div>

							{/* Failure Reason (if failed) */}
							{previewData.badgeStatus === "failed" &&
								previewData.failureReason && (
									<div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm">
										<strong>⚠️ Test Failed:</strong> {previewData.failureReason}
									</div>
								)}
						</>
					) : previewData && !previewData.shouldShowPreview ? (
						<div className="text-center text-gray-500 h-full flex items-center justify-center">
							No preview available – backend returned an internal error.
						</div>
					) : (
						// 📝 No request selected
						<div className="text-center text-gray-500 h-full flex items-center justify-center">
							Select a request to view details
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
