"use client";

import { format, formatDistanceToNow } from "date-fns";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formattedDateNoTime } from "@/lib/utils";

type TestStatus = "pending" | "loading" | "passed" | "failed";

interface TestResult {
	id: number;
	testName: string;
	status: TestStatus;
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

interface MonitoringDataProps {
	testResults: TestResult[];
	onSelectTest: (id: number) => void;
	selectedTestId: number | null;
}

export function MonitoringData({
	testResults,
	onSelectTest,
	selectedTestId,
}: MonitoringDataProps) {
	const getStatusBadge = (test: TestResult) => {
		const { status } = test;

		switch (status) {
			case "passed":
				return (
					<div className="flex items-center gap-1 min-w-0">
						<span className="text-[#17C964] text-sm truncate">Passed</span>
					</div>
				);
			case "failed":
				return (
					<div className="flex items-center gap-1 min-w-0">
						<span className="text-[#F31260] text-sm truncate">Failed</span>
					</div>
				);
			case "loading":
				return (
					<div className="flex items-center gap-1 min-w-0">
						<Loader2 className="w-4 h-4 shrink-0 animate-spin" />
						<span className="text-sm truncate">Running</span>
					</div>
				);
			case "pending":
				return <span className="text-sm truncate">Pending</span>;
			default:
				return <span className="text-sm truncate">Pending</span>;
		}
	};

	const getStatusCode = (test: TestResult) => {
		const { status, httpStatus } = test;

		switch (status) {
			case "passed":
				return (
					<div className="flex items-center gap-1 min-w-0">
						<Badge
							variant="outline"
							className="text-[#EF4444] text-sm font-medium shrink-0"
						>
							{httpStatus}
						</Badge>
					</div>
				);
			case "failed":
				return (
					<div className="flex items-center gap-1 min-w-0">
						<Badge
							variant="outline"
							className="text-[#17C964] text-sm font-medium shrink-0"
						>
							{httpStatus}
						</Badge>
					</div>
				);
			case "loading":
				return <div className="flex items-center gap-1 min-w-0"></div>;
			case "pending":
				return <span className="text-sm truncate"></span>;
			default:
				return <span className="text-sm truncate"></span>;
		}
	};

	const isClickable = (status: TestStatus) => {
		return status === "passed" || status === "failed";
	};

	return (
		<div className="h-full flex flex-col overflow-hidden ">
			<div className="flex justify-between items-center mb-4 gap-1">
				<h3 className="text-2xl font-semibold truncate">Test Results</h3>
				<p className="text-sm text-[#94A3B8] hidden xl:block truncate">
					Click completed tests
				</p>
			</div>

			<div className="flex-1 overflow-hidden w-full">
				<ScrollArea className="h-full w-full">
					<div className="w-full overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									{/* <TableHead className="truncate text-[16px] w-[20%]">
										Date
									</TableHead> */}
									<TableHead className="min-w-[60px] truncate text-[16px] w-[10%]">
										Method
									</TableHead>
									<TableHead className="min-w-[120px] truncate text-[16px] w-[30%]">
										Endpoint
									</TableHead>
									<TableHead className="min-w-[120px] truncate text-[16px] w-[30%]">
										Test Case
									</TableHead>
									<TableHead className="truncate text-[16px] w-[10%]">
										Status
									</TableHead>
									<TableHead className="min-w-[100px] truncate text-[16px] w-[20%]">
										API Code
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className="w-full">
								{testResults.map((test) => (
									<TableRow
										key={test.id}
										className={`
                    ${selectedTestId === test.id ? "bg-[#F1F5F9]" : ""}
                    ${
											isClickable(test.status)
												? "hover:bg-[#F8FAFC] cursor-pointer"
												: "cursor-not-allowed opacity-60"
										}
                  `}
										onClick={() =>
											isClickable(test.status) && onSelectTest(test.id)
										}
									>
										{/* <TableCell className="py-3 w-[70px] min-w-[70px]">
											<div
												className="truncate font-medium text-sm"
												title={test.date}
											>
												{formattedDateNoTime}
											</div>
										</TableCell> */}
										<TableCell className="py-3 w-[60px] min-w-[60px]">
											<div
												className={`inline-block border border-[#E2E8F0] rounded-md px-2 py-1 text-sm truncate max-w-full ${
													test.method === "GET"
														? "text-[#006FEE]"
														: test.method === "POST"
														? "text-[#17c964]"
														: test.method === "PUT"
														? "text-[#f5a524]"
														: test.method === "DELETE"
														? "text-[#EF4444]"
														: "text-[#8B5CF6]"
												}`}
												title={test.method}
											>
												{test.method}
											</div>
										</TableCell>
										<TableCell className="py-3 min-w-[120px]">
											<div
												className="font-mono text-sm text-[#475569] truncate w-[10rem]"
												title={test.endpoint}
											>
												{test.endpoint}
											</div>
										</TableCell>
										<TableCell className="py-3 min-w-[120px]">
											<Badge title={test.testName}>{test.testName}</Badge>
										</TableCell>
										<TableCell className="py-3 w-[100px] min-w-[100px]">
											<div className="min-w-0 overflow-hidden">
												{getStatusBadge(test)}
											</div>
										</TableCell>
										<TableCell className="py-3 w-[100px] min-w-[100px]">
											<div className="min-w-0 overflow-hidden">
												{getStatusCode(test)}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</ScrollArea>
			</div>
		</div>
	);
}
