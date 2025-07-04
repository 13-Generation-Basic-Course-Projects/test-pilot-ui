"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { HistoryData } from "@/components/history/history-data";
import { PreviewSkeleton } from "@/components/preview-skeleton";
import { getHistoryAction } from "@/action/history-action";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { runTestCasesAction, TestRunPayload } from "@/action/run-test-action";
import { useTestRunStore } from "@/store/test-run-slice";
import { Loader2, Play } from "lucide-react";
import { fetchCollectionsForProject } from "@/action/collection-action";
import { fetchRequestForCollection } from "@/action/request-action";

type BackendResponse = {
	message: string;
	status: string;
	success: boolean;
	timestamps: any;
	payload: Array<any>;
};

export default function History() {
	const [previewData, setPreviewData] = useState<any>(null);
	const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
	const pathName = usePathname();
	const [loadingPreview, setLoadingPreview] = useState<boolean>(false);
	const [backendData, setBackendData] = useState<BackendResponse | null>(null);

	const [isRunAllPending, startRunAllTransition] = useTransition();
	const [runningBatchId, setRunningBatchId] = useState<string | null>(null);

	const router = useRouter();
	const { setTestRunResult, clearTestRunResult } = useTestRunStore();

	const projectId = pathName.split("/")[2];

	useEffect(() => {
		const fetchData = async () => {
			setLoadingHistory(true);
			try {
				const data = await getHistoryAction(projectId);
				setBackendData(data as any);
			} catch (error) {
				console.error("Failed to fetch history:", error);
				setBackendData(null);
			}
			setLoadingHistory(false);
		};
		fetchData();
	}, [projectId]);

	const handleRowClick = async (resultData: any) => {
		setLoadingPreview(true);
		setTimeout(() => {
			setPreviewData(resultData);
			setLoadingPreview(false);
		}, 300);
	};

	const handleRunAllHistory = async () => {
		if (!backendData || !backendData.payload) return;

		clearTestRunResult();
		sessionStorage.removeItem("testRunResult");

		const allRequests = backendData.payload.flatMap((batch) =>
			batch.results.map((result: any) => ({
				url: result.requestDefinitionSnapshot.url,
				method: result.requestDefinitionSnapshot.method,
				headers: result.requestDefinitionSnapshot.headers || {},
				body: result.requestDefinitionSnapshot.body || {},
				requestId: result.requestId,
				testCaseId: result.testCaseId,
				isExpectedSuccess: false,
			}))
		);

		if (allRequests.length === 0) {
			toast.warning("No tests found in history to run.");
			return;
		}

		const finalPayload: TestRunPayload = {
			projectId: projectId,
			triggerType: "SELECTED_TEST_CASES",
			requestExecution: allRequests,
			runDate: ""
		};

		const collections = await fetchCollectionsForProject(projectId);
		if (!collections || collections.length === 0) {
			throw new Error("No collections found for this project.");
		}
		const collectionId = collections[0].id;
		console.log("HISTORY", collectionId);
		const requestId = (await fetchRequestForCollection(collectionId)).map(
			(request) => request.id
		)[0];

		startRunAllTransition(async () => {
			toast.promise(runTestCasesAction(finalPayload), {
				loading: `Running ${allRequests.length} tests from history...`,
				success: (result) => {
					if (result?.data) {
						setTestRunResult(result.data);
						sessionStorage.setItem(
							"testRunResult",
							JSON.stringify(result.data)
						);
						router.push(
							`/project/${projectId}/collection/${collectionId}/request/${requestId}/monitoring`
						);
						return "Test run started successfully!";
					}
					return "Test run initiated, but no data returned.";
				},
				error: (err) => `Failed to start test run: ${err.message}`,
			});
		});
	};

	return (
		<div className="w-full mx-auto mt-10 bg-white p-8 space-y-10">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-gray-900">
					History: Test Pilot API
				</h1>
				<Button
					onClick={handleRunAllHistory}
					disabled={
						isRunAllPending || loadingHistory || runningBatchId !== null
					}
				>
					{isRunAllPending ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<Play className="mr-2 h-4 w-4" />
					)}
					Run All History
				</Button>
			</div>

			<div className="grid grid-cols-12 gap-10">
				<div className="col-span-8 pr-4 space-y-4 max-h-[70vh] overflow-y-auto">
					{loadingHistory ? (
						<PreviewSkeleton />
					) : backendData &&
					  backendData.payload &&
					  backendData.payload.length > 0 ? (
						backendData.payload.map((batch) => (
							<HistoryData
								key={batch.batchId}
								batchData={batch}
								onRowClick={handleRowClick}
							/>
						))
					) : (
						<p>No history found.</p>
					)}
				</div>

				<div className="col-span-4 pl-10 border-l min-w-[400px] space-y-6">
					{loadingHistory ? (
						<PreviewSkeleton />
					) : previewData ? (
						<>
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
							<h3 className="text-xl">Response</h3>
							<div className="bg-[#F8FAFC] p-4 rounded-md text-sm font-mono overflow-auto max-h-60">
								<pre className="whitespace-pre-wrap">
									{previewData.responseBody || "No response body"}
								</pre>
							</div>
							<h3 className="text-xl">Response Headers</h3>
							<div className="bg-[#F8FAFC] p-4 rounded-md text-sm font-mono overflow-auto max-h-60">
								<pre className="whitespace-pre-wrap">
									{JSON.stringify(previewData.responseHeaders, null, 2)}
								</pre>
							</div>
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
