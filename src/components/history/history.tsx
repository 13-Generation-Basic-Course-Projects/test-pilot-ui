"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HistoryData } from "@/components/history/history-data";
import { PreviewSkeleton } from "@/components/preview-skeleton";
import { getHistoryAction } from "@/action/history-action";
import { usePathname, useRouter } from "next/navigation";

// Mock data based on your backend response structure
const HistoryResponse = {
	message: "Execution batches fetched successfully.",
	status: "OK",
	success: true,
	timestamps: null,
	payload: [
		{
			batchId: "04f47310-d9d7-4e20-be70-d03c6e88735a",
			projectId: "8b5c7665-0d71-4e06-a5ec-90bfa5a41f77",
			userId: "ef3d8749-5e9a-47d5-8a3e-feb223cdce1d",
			triggerType: "SELECTED_TEST_CASES",
			triggerSourceId: null,
			startTimestamp: "2025-06-20T02:45:01.871969",
			endTimestamp: "2025-06-20T02:45:06.879385",
			overallStatus: "COMPLETED",
			results: [
				{
					resultId: "c7182faa-ce6a-4c0d-a4a4-399404304a57",
					batchId: "04f47310-d9d7-4e20-be70-d03c6e88735a",
					requestId: "bb8ac9b7-fb40-421b-9bf1-0f97c12ee520",
					testCaseId: "6c900a03-47bc-4471-bd18-0e9040b03ebd",
					isExpectedSuccess: false,
					requestDefinitionSnapshot: {
						url: "wdwdwd",
						body: {
							hjk: " ",
						},
						method: "PATCH",
						headers: {
							"0": {
								key: "",
								cases: [],
								value: "",
							},
						},
					},
					executionOrder: 0,
					startTimestamp: "2025-06-20T02:45:02.247909",
					endTimestamp: "2025-06-20T02:45:06.683179",
					status: "PASSED",
					requestSentDetails: {
						url: "https://github.com/wdwdwd",
						body: {
							hjk: " ",
						},
						method: "PATCH",
						headers: {
							"0": [""],
							Accept: ["application/json"],
						},
					},
					responseStatusCode: 403,
					responseHeaders: {
						Date: "Fri, 20 Jun 2025 02:45:06 GMT",
						"Content-Type": "text/plain; charset=utf-8",
						"Cache-Control": "no-cache",
					},
					responseBody: "Cookies must be enabled to use GitHub.",
					responseSizeBytes: 0,
					durationMs: 4298,
					assertionResults: {
						statusCodeAssertion: "PASSED: Expected failure, got 403",
					},
					createdAt: "2025-06-20T02:45:02.322002",
				},
			],
			createdAt: "2025-06-20T02:45:01.918281",
			updatedAt: "2025-06-20T02:45:06.927501",
		},
	],
};

export type HistoryType = typeof HistoryResponse;

export default function History() {
	const [previewData, setPreviewData] = useState<any>(null);
	const [loadingPreview, setLoadingPreview] = useState<boolean>(false); // Renamed for clarity
	const [loadingHistory, setLoadingHistory] = useState<boolean>(true); // New state for initial data loading
	const pathName = usePathname();
	const [backendData, setBackendData] = useState<any>();

	const projectId = pathName.split("/")[2];

	useEffect(() => {
		const fetchData = async () => {
			setLoadingHistory(true); // Start loading
			try {
				const data = await getHistoryAction(projectId);
				setBackendData(data);
			} catch (error) {
				console.error("Failed to fetch history:", error);
				setBackendData(null); // Set to null on error to avoid crash
			}
			setLoadingHistory(false); // Finish loading
		};
		fetchData();
	}, [projectId]); // Added projectId to dependency array

	const handleRowClick = async (resultData: any) => {
		setLoadingPreview(true);
		setTimeout(() => {
			setPreviewData(resultData);
			setLoadingPreview(false);
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
					{/* --- CHANGE IS HERE --- */}
					{loadingHistory ? (
						// Use a skeleton or a simple message while loading
						<PreviewSkeleton />
					) : backendData && backendData.payload ? (
						// Only render HistoryData if data exists
						<HistoryData
							backendData={backendData}
							onRowClick={handleRowClick}
						/>
					) : (
						// Show a message if there's no data or an error occurred
						<p>No history found.</p>
					)}
				</div>

				{/* Right: Request Details */}
				<div className="col-span-4 pl-10 border-l min-w-[400px] space-y-6">
					{loadingHistory ? (
						<PreviewSkeleton />
					) : previewData ? (
						<>
							{/* Status Badge */}
							<div className="flex items-center gap-3">
								<div
									className={`px-3 py-1 rounded-full text-sm font-medium ${
										previewData.status === "PASSED"
											? "bg-green-100 text-green-600"
											: "bg-red-100 text-red-600"
									}`}
								>
									{previewData.status === "PASSED" ? "Passed" : "Failed"}
								</div>
								<h2 className="text-xl font-semibold">Request Details</h2>
							</div>

							{/* Request Summary */}
							<div className="space-y-4">
								<div className="flex space-x-2">
									<p>Status:</p>
									<div
										className={`border border-[#E2E8F0] rounded-md px-4 py-1 ${
											previewData.responseStatusCode >= 200 &&
											previewData.responseStatusCode < 300
												? "text-[#17C964]"
												: previewData.responseStatusCode >= 400
												? "text-[#EF4444]"
												: "text-[#006FEE]"
										}`}
									>
										{previewData.responseStatusCode}
									</div>
								</div>
								<div className="flex space-x-2">
									<p>Method:</p>
									<div className="border border-[#E2E8F0] rounded-md px-4 py-1 text-[#006FEE]">
										{previewData.requestSentDetails.method}
									</div>
								</div>
								<div className="flex space-x-2">
									<p>Endpoint:</p>
									<p className="break-all">
										{previewData.requestSentDetails.url}
									</p>
								</div>
								<div className="flex space-x-2">
									<p>Duration:</p>
									<p>{previewData.durationMs}ms</p>
								</div>
							</div>

							<hr className="text-[#94A3B8]" />

							{/* Request Metadata */}
							<h3 className="text-xl">Request Body</h3>
							<div className="bg-[#F8FAFC] p-4 rounded-md text-sm font-mono overflow-auto max-h-60">
								<pre className="whitespace-pre-wrap">
									{previewData.requestSentDetails.body
										? JSON.stringify(
												previewData.requestSentDetails.body,
												null,
												2
										  )
										: "No request body"}
								</pre>
							</div>

							{/* Request Headers */}
							<h3 className="text-xl">Request Headers</h3>
							<div className="bg-[#F8FAFC] p-4 rounded-md text-sm font-mono overflow-auto max-h-60">
								<pre className="whitespace-pre-wrap">
									{JSON.stringify(
										previewData.requestSentDetails.headers,
										null,
										2
									)}
								</pre>
							</div>

							{/* Response */}
							<h3 className="text-xl">Response</h3>
							<div className="bg-[#F8FAFC] p-4 rounded-md text-sm font-mono overflow-auto max-h-60">
								<pre className="whitespace-pre-wrap">
									{previewData.responseBody || "No response body"}
								</pre>
							</div>

							{/* Response Headers */}
							<h3 className="text-xl">Response Headers</h3>
							<div className="bg-[#F8FAFC] p-4 rounded-md text-sm font-mono overflow-auto max-h-60">
								<pre className="whitespace-pre-wrap">
									{JSON.stringify(previewData.responseHeaders, null, 2)}
								</pre>
							</div>

							{/* Assertion Results */}
							{previewData.assertionResults && (
								<>
									<h3 className="text-xl">Assertion Results</h3>
									<div className="bg-[#F8FAFC] p-4 rounded-md text-sm font-mono overflow-auto max-h-60">
										<pre className="whitespace-pre-wrap">
											{JSON.stringify(previewData.assertionResults, null, 2)}
										</pre>
									</div>
								</>
							)}

							{/* Test Status Info */}
							{previewData.status !== "PASSED" && (
								<div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm">
									<strong>⚠️ Test Failed:</strong> Check assertion results and
									response details above.
								</div>
							)}
						</>
					) : (
						<div className="text-center text-gray-500 h-full flex items-center justify-center">
							Select a request to view details
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
