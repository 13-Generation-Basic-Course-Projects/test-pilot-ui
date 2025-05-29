"use client";

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
		const { status, httpStatus } = test;

		switch (status) {
			case "passed":
				return (
					<div className="flex items-center gap-2">
						<h1 className="text-[#17C964]">passed</h1>
						<Badge
							variant="outline"
							className="text-[#17C964] text-xs font-medium"
						>
							{httpStatus}
						</Badge>
					</div>
				);
			case "failed":
				return (
					<div className="flex items-center gap-2">
						<h1 className="text-[#EF4444]">failed</h1>
						<Badge
							variant="outline"
							className="text-[#EF4444] text-xs font-medium"
						>
							{httpStatus}
						</Badge>
					</div>
				);
			case "loading":
				return (
					<h1 className="flex items-center">
						<Loader2 className="w-3 h-3 mr-1 animate-spin" />
						running
					</h1>
				);
			case "pending":
				return <h1>pending</h1>;
			default:
				return <h1>pending</h1>;
		}
	};

	const isClickable = (status: TestStatus) => {
		return status === "passed" || status === "failed";
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h3 className="text-2xl font-semibold">Test Results</h3>
				<p className="text-sm text-[#94A3B8]">
					Click on completed tests to view details
				</p>
			</div>
			<Table>
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead>Date</TableHead>
						<TableHead>Method</TableHead>
						<TableHead>Endpoint</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="space-y-4">
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
                py-3 my-2
              `}
							onClick={() => isClickable(test.status) && onSelectTest(test.id)}
						>
							<TableCell className="font-medium py-4">{test.date}</TableCell>
							<TableCell className="py-4">
								<div
									className={`inline-block border border-[#E2E8F0] rounded-md px-[10px] py-1 text-xs ${
										test.method === "GET"
											? "text-[#3B82F6]"
											: test.method === "POST"
											? "text-[#10B981]"
											: test.method === "PUT"
											? "text-[#006FEE]"
											: test.method === "DELETE"
											? "text-[#EF4444]"
											: "text-[#8B5CF6]"
									}`}
								>
									{test.method}
								</div>
							</TableCell>
							<TableCell className="font-mono text-sm text-[#475569] max-w-[200px] truncate py-4">
								{test.endpoint}
							</TableCell>
							<TableCell className="py-4">{getStatusBadge(test)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
