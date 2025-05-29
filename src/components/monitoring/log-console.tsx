"use client";

import { useEffect, useRef, useState } from "react";

type LogLevel = "INFO" | "WARNING" | "ERROR" | "DEBUG";

interface LogEntry {
	timestamp: string;
	level: LogLevel;
	message: string;
	source?: string;
}

export function LogConsole() {
	const [logs, setLogs] = useState<LogEntry[]>([]);
	const logContainerRef = useRef<HTMLDivElement>(null);

	// Generate timestamp in format HH:MM:SS.mmm
	const generateTimestamp = () => {
		const now = new Date();
		return `${now.getHours().toString().padStart(2, "0")}:${now
			.getMinutes()
			.toString()
			.padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now
			.getMilliseconds()
			.toString()
			.padStart(3, "0")}`;
	};

	// Predefined log messages for simulation
	const logMessages: { level: LogLevel; message: string; source?: string }[] = [
		{ level: "INFO", message: "Test execution started", source: "TestRunner" },
		{
			level: "INFO",
			message: "Connecting to API endpoint",
			source: "HttpClient",
		},
		{ level: "INFO", message: "Connection established", source: "HttpClient" },
		{
			level: "INFO",
			message: "Sending PUT request to /api/v1/habits",
			source: "HttpClient",
		},
		{
			level: "DEBUG",
			message: "Request headers set: Content-Type=application/json",
			source: "HttpClient",
		},
		{
			level: "DEBUG",
			message: "Request body serialized: 128 bytes",
			source: "HttpClient",
		},
		{
			level: "INFO",
			message: "Response received: 200 OK",
			source: "HttpClient",
		},
		{
			level: "INFO",
			message: "Running test: Response Time Check",
			source: "TestRunner",
		},
		{
			level: "INFO",
			message: "Test passed: Response Time Check (120ms < 200ms)",
			source: "TestRunner",
		},
		{
			level: "INFO",
			message: "Running test: Status Code Validation",
			source: "TestRunner",
		},
		{
			level: "ERROR",
			message: "Test failed: Status Code Validation (expected 201, got 200)",
			source: "TestRunner",
		},
		{
			level: "INFO",
			message: "Running test: Response Schema",
			source: "TestRunner",
		},
		{
			level: "WARNING",
			message: "Schema validation found issues",
			source: "SchemaValidator",
		},
		{
			level: "ERROR",
			message: "Test failed: Response Schema (Missing required field: id)",
			source: "TestRunner",
		},
		{
			level: "INFO",
			message: "Running test: Authentication Check",
			source: "TestRunner",
		},
		{
			level: "INFO",
			message: "Test pending: Authentication Check",
			source: "TestRunner",
		},
		{
			level: "INFO",
			message: "Test execution completed: 1 passed, 2 failed, 1 pending",
			source: "TestRunner",
		},
		{ level: "DEBUG", message: "Cleaning up resources", source: "TestRunner" },
		{ level: "INFO", message: "Connection closed", source: "HttpClient" },
		{
			level: "INFO",
			message: "Generating test report",
			source: "ReportGenerator",
		},
		{
			level: "INFO",
			message: "Report saved to /reports/test-20250520-1900.json",
			source: "ReportGenerator",
		},
	];

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

	// Simulate log entries appearing over time
	useEffect(() => {
		if (logs.length >= logMessages.length) return;

		const timer = setTimeout(() => {
			const nextLog = logMessages[logs.length];
			setLogs((prev) => [
				...prev,
				{
					timestamp: generateTimestamp(),
					level: nextLog.level,
					message: nextLog.message,
					source: nextLog.source,
				},
			]);
		}, Math.random() * 800 + 200); // Random delay between 200-1000ms

		return () => clearTimeout(timer);
	}, [logs]);

	// Auto-scroll to bottom when new logs appear
	useEffect(() => {
		if (logContainerRef.current) {
			logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
		}
	}, [logs]);

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h3 className="text-2xl font-semibold">Live Logs</h3>
				<div className="text-sm text-[#94A3B8]">
					{logs.length} of {logMessages.length} entries
				</div>
			</div>

			<div
				ref={logContainerRef}
				className="bg-[#1E293B] text-white font-mono text-sm p-4 rounded-lg h-[400px] overflow-y-auto"
			>
				{logs.length === 0 ? (
					<div className="flex items-center justify-center h-full text-[#94A3B8]">
						Waiting for logs...
					</div>
				) : (
					logs.map((log, index) => (
						<div key={index} className="mb-1">
							<span className="text-[#94A3B8]">{log.timestamp}</span>{" "}
							<span className={getLogLevelClass(log.level)}>[{log.level}]</span>{" "}
							{log.source && (
								<span className="text-[#A78BFA]">[{log.source}]</span>
							)}{" "}
							<span>{log.message}</span>
						</div>
					))
				)}

				{logs.length > 0 && logs.length < logMessages.length && (
					<div className="inline-block animate-pulse">▋</div>
				)}
			</div>
		</div>
	);
}
