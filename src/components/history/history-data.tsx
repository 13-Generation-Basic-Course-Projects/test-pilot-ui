"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ChevronDown,
	ChevronUp,
	Folder,
	Play,
	Trash2,
	Loader2,
} from "lucide-react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MethodBadge } from "@/components/method-badge";
import { Button } from "../ui/button";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { runTestCasesAction, TestRunPayload } from "@/action/run-test-action";
import { useTestRunStore } from "@/store/test-run-slice";
import { fetchCollectionsForProject } from "@/action/collection-action";

type HistoryBatch = {
	batchId: string;
	projectId: string;
	collectionId: string;
	startTimestamp: string;
	overallStatus: string;
	results: Array<{
		resultId: string;
		requestId: string;
		testCaseId: string;
		requestDefinitionSnapshot: {
			url: string;
			method: string;
			body: any;
			headers: any;
		};
		requestSentDetails: {
			url: string;
			method: string;
		};
		responseStatusCode: number;
		status: string;
		startTimestamp: string;
	}>;
};

type HistoryDataProps = {
	batchData: HistoryBatch;
	onRowClick?: (resultData: any) => void;
};

export function HistoryData({ batchData, onRowClick }: HistoryDataProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [activeRow, setActiveRow] = useState<string | null>(null);
	const [deleteIndex, setDeleteIndex] = useState<string | null>(null);

	const [runningTestId, setRunningTestId] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const { setTestRunResult, clearTestRunResult } = useTestRunStore();

	const transformedData = React.useMemo(() => {
		if (!batchData || !Array.isArray(batchData.results)) {
			return [];
		}
		return batchData.results.map((result) => ({
			id: result.resultId,
			date: new Date(result.startTimestamp).toLocaleString("en-US", {
				day: "numeric",
				month: "short",
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			}),
			method: result.requestSentDetails?.method || "N/A",
			endpoint: result.requestSentDetails?.url || "No Endpoint",
			status: result.status,
			statusCode: result.responseStatusCode || 0,
			resultData: result,
		}));
	}, [batchData]);

	const [data, setData] = React.useState(transformedData);

	React.useEffect(() => {
		setData(transformedData);
	}, [transformedData]);

	const handleDelete = () => {
		if (deleteIndex !== null) {
			setData((prev) => prev.filter((item) => item.id !== deleteIndex));
			setDeleteIndex(null);
		}
	};

	const getStatusColor = (status: string) =>
		status === "PASSED" ? "text-[#17C964]" : "text-[#EF4444]";

	const getStatusCodeColor = (statusCode: number) => {
		if (statusCode >= 200 && statusCode < 300) return "text-[#17C964]";
		if (statusCode >= 400) return "text-[#EF4444]";
		return "text-[#006FEE]";
	};

	const handleRunSingleTest = (testToRun: (typeof data)[0]) => {
		startTransition(async () => {
			setRunningTestId(testToRun.id);
			clearTestRunResult();
			sessionStorage.removeItem("testRunResult");

			const toastId = toast.loading("Preparing to re-run test...");

			try {
				const collections = await fetchCollectionsForProject(
					batchData.projectId
				);
				if (!collections || collections.length === 0) {
					throw new Error("No collections found for this project.");
				}
				const collectionId = collections[0].id;
				const requestId = testToRun.resultData.requestId;

				const requestExecution = [
					{
						url: testToRun.resultData.requestDefinitionSnapshot.url,
						method: testToRun.resultData.requestDefinitionSnapshot.method,
						headers:
							testToRun.resultData.requestDefinitionSnapshot.headers || {},
						body: testToRun.resultData.requestDefinitionSnapshot.body || {},
						requestId: requestId,
						testCaseId: testToRun.resultData.testCaseId,
						isExpectedSuccess: false,
					},
				];

				const finalPayload: TestRunPayload = {
					projectId: batchData.projectId,
					triggerType: "SELECTED_TEST_CASES",
					requestExecution,
					runDate: ""
				};

				toast.loading("Re-running test...", { id: toastId });

				const result = await runTestCasesAction(finalPayload);

				if (result.success && result.data) {
					setTestRunResult(result.data);
					sessionStorage.setItem("testRunResult", JSON.stringify(result.data));
					router.push(
						`/project/${batchData.projectId}/collection/${collectionId}/request/${requestId}/monitoring`
					);
					toast.success("Test run started successfully!", { id: toastId });
				} else {
					throw new Error(
						result.error || "Test run initiated, but no data was returned."
					);
				}
			} catch (err: any) {
				toast.error(`Failed to start test run: ${err.message}`, {
					id: toastId,
				});
			} finally {
				setRunningTestId(null);
			}
		});
	};

	const batchTitle = `Test Run: ${new Date(
		batchData.startTimestamp
	).toLocaleString()}`;
	const testsCount = batchData.results.length;

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="w-full space-y-2"
		>
			<CollapsibleTrigger asChild>
				<div className="flex items-center justify-between space-x-4 px-4 border py-3 rounded-md cursor-pointer select-none">
					<div className="flex items-center gap-3">
						<Folder />
						<div className="flex items-center gap-4">
							<h4 className="text-lg font-semibold">{batchTitle}</h4>
							<p className="text-md text-muted-foreground">
								{testsCount} test{testsCount !== 1 ? "s" : ""}
								{/* <span
									className={`font-medium ${getStatusColor(
										batchData.overallStatus
									)}`}
								>
									{" "}
									{batchData.overallStatus}
								</span> */}
							</p>
						</div>
					</div>
					{isOpen ? (
						<ChevronUp className="h-5 w-5 text-muted-foreground" />
					) : (
						<ChevronDown className="h-5 w-5 text-muted-foreground" />
					)}
				</div>
			</CollapsibleTrigger>
			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						key="content"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="pl-6 text-base py-4 min-w-[120px]">
										Date
									</TableHead>
									<TableHead className="text-base py-4 min-w-[80px]">
										Method
									</TableHead>
									<TableHead className="text-base py-4 min-w-[200px]">
										Endpoint
									</TableHead>
									<TableHead className="text-base py-4 min-w-[100px]">
										Status
									</TableHead>
									<TableHead className="text-base py-4 min-w-[80px]">
										Action
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.map((item) => {
									const isThisTestRunning = runningTestId === item.id;
									return (
										<TableRow
											key={item.id}
											id={`request-${item.id}`}
											onClick={() => {
												setActiveRow(item.id);
												onRowClick?.(item.resultData);
											}}
											className={`py-5 cursor-pointer ${
												activeRow === item.id ? "bg-[#F1F5F9]" : ""
											}`}
										>
											<TableCell className="py-5 pl-6">{item.date}</TableCell>
											<TableCell className="py-5">
												<MethodBadge method={item.method} />
											</TableCell>
											<TableCell className="py-5 break-all truncate max-w-[300px]">
												{item.endpoint}
											</TableCell>
											<TableCell className="py-5">
												<div className="flex justify-between max-w-[120px]">
													<p className={getStatusColor(item.status)}>
														{item.status === "PASSED" ? "Passed" : "Failed"}
													</p>
													<div
														className={`w-fit border border-[#E2E8F0] rounded-sm px-[15px] ${getStatusCodeColor(
															item.statusCode
														)}`}
													>
														{item.statusCode}
													</div>
												</div>
											</TableCell>
											<TableCell className="py-5">
												<div className="flex gap-3">
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
														disabled={isPending}
														onClick={(e) => {
															e.stopPropagation();
															handleRunSingleTest(item);
														}}
													>
														{isThisTestRunning ? (
															<Loader2 className="h-4 w-4 animate-spin" />
														) : (
															<Play className="text-[#3B82F6]" width={20} />
														)}
													</Button>
													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8"
																onClick={(e) => {
																	e.stopPropagation();
																	setDeleteIndex(item.id);
																}}
															>
																<Trash2
																	className="text-[#E2001A] cursor-pointer"
																	width={20}
																/>
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>
																	Are you absolutely sure?
																</AlertDialogTitle>
																<AlertDialogDescription>
																	This action cannot be undone. This will
																	permanently delete this entry.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Cancel</AlertDialogCancel>
																<AlertDialogAction
																	onClick={handleDelete}
																	className="bg-[#EF4444] text-white hover:bg-[#dc2626]"
																>
																	Delete
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												</div>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</motion.div>
				)}
			</AnimatePresence>
		</Collapsible>
	);
}
