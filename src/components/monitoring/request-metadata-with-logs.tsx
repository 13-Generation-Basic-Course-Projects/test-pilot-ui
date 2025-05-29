"use client";

import { useEffect, useRef, useState } from "react";

type LogLevel = "INFO" | "WARNING" | "ERROR" | "DEBUG";

interface LogEntry {
	level: LogLevel;
	message: string;
	source?: string;
}

interface LogEntryWithTimestamp extends LogEntry {
	timestamp: string;
}

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
	logs: LogEntry[];
}

interface RequestMetadataWithLogsProps {
	selectedTest: TestResult;
}

export function RequestMetadataWithLogs({
	selectedTest,
}: RequestMetadataWithLogsProps) {
	const [displayedLogs, setDisplayedLogs] = useState<LogEntryWithTimestamp[]>(
		[]
	);
	const [isClient, setIsClient] = useState(false);
	const logContainerRef = useRef<HTMLDivElement>(null);

	// Fix hydration error
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Generate timestamp in format HH:MM:SS.mmm
	const generateTimestamp = () => {
		if (!isClient) return "00:00:00.000";
		const now = new Date();
		return `${now.getHours().toString().padStart(2, "0")}:${now
			.getMinutes()
			.toString()
			.padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now
			.getMilliseconds()
			.toString()
			.padStart(3, "0")}`;
	};

	// When test changes, show logs for that specific test
	useEffect(() => {
		if (!selectedTest?.logs || !isClient) {
			setDisplayedLogs([]);
			return;
		}

		// If test is completed, show all logs for this specific test
		if (selectedTest.status === "passed" || selectedTest.status === "failed") {
			const logsWithTimestamps: LogEntryWithTimestamp[] = selectedTest.logs.map(
				(log) => ({
					...log,
					timestamp: generateTimestamp(),
				})
			);
			setDisplayedLogs(logsWithTimestamps);
		} else {
			setDisplayedLogs([]);
		}
	}, [selectedTest?.id, selectedTest?.status, isClient]);

	// Auto-scroll to bottom when logs change
	useEffect(() => {
		if (logContainerRef.current) {
			logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
		}
	}, [displayedLogs]);

	// Function to get color class based on log level
	const getLogLevelClass = (level: LogLevel) => {
		switch (level) {
			case "INFO":
				return "text-[#3B82F6]"; // blue
			case "WARNING":
				return "text-[#F59E0B]"; // amber
			case "ERROR":
				return "text-[#EF4444]"; // red
			case "DEBUG":
				return "text-[#94A3B8]"; // slate
			default:
				return "text-[#3B82F6]";
		}
	};

	if (!isClient) {
		return (
			<div className="space-y-6">
				<div className="space-y-3">
					<p className="text-xl font-semibold">Test Logs</p>
					<div className="bg-[#1E293B] text-white font-mono text-xs p-3 rounded-lg h-[200px] overflow-y-auto">
						<div className="flex items-center justify-center h-full text-[#94A3B8]">
							Loading...
						</div>
					</div>
				</div>
				<div className="space-y-3">
					<p className="text-xl font-semibold">Request Metadata</p>
					<div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 font-mono text-sm">
						<div className="text-[#94A3B8]">Loading...</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Test-Specific Logs Section */}
			<div className="space-y-3">
				<div className="flex justify-between items-center">
					<p className="text-xl font-semibold">
						Test Logs - {selectedTest.testName}
					</p>
					<div className="text-xs text-[#94A3B8]">
						{displayedLogs.length}/{selectedTest.logs?.length || 0}
					</div>
				</div>

				<div
					ref={logContainerRef}
					className="bg-[#1E293B] text-white font-mono text-xs p-3 rounded-lg h-[200px] overflow-y-auto"
				>
					{!selectedTest.logs || displayedLogs.length === 0 ? (
						<div className="flex items-center justify-center h-full text-[#94A3B8]">
							{selectedTest.status === "pending"
								? "Test not started yet..."
								: selectedTest.status === "loading"
								? "Test is running..."
								: "No logs available"}
						</div>
					) : (
						displayedLogs.map((log, index) => (
							<div key={index} className="mb-1 text-xs">
								<span className="text-[#94A3B8]">{log.timestamp}</span>{" "}
								<span className={getLogLevelClass(log.level)}>
									[{log.level}]
								</span>{" "}
								{log.source && (
									<span className="text-[#A78BFA]">[{log.source}]</span>
								)}{" "}
								<span>{log.message}</span>
							</div>
						))
					)}
				</div>
			</div>

			{/* Request Metadata Section */}
			<div className="space-y-3">
				<p className="text-xl font-semibold">Request Metadata</p>
				<div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 font-mono text-sm">
					<pre className="text-[#475569] whitespace-pre-wrap">
						{selectedTest.metadata
							? JSON.stringify(selectedTest.metadata, null, 2)
							: "No metadata available"}
					</pre>
				</div>
			</div>
		</div>
	);
}
