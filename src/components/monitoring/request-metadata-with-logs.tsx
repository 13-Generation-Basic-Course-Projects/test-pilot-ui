"use client";

import React, { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import type { TestResult } from "@/types/monitoring-type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LogLevel = "INFO" | "WARNING" | "ERROR" | "DEBUG";

interface LogEntryWithTimestamp {
	level: LogLevel;
	message: string;
	source?: string;
	timestamp: string;
}

interface RequestMetadataWithLogsProps {
	selectedTest: TestResult;
}

// A reusable component to display each piece of metadata in a styled code block
const CodeBlockTab = ({ data }: { data: any }) => {
	// Don't render the section if there's no data to show
	if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
		return (
			<div className="p-4 text-sm text-muted-foreground">
				Not applicable for this request.
			</div>
		);
	}

	let codeString = data;
	// Stringify if the data is an object or array, otherwise use as is
	if (typeof data === "object") {
		codeString = JSON.stringify(data, null, 2);
	}

	return (
		<div className="rounded-md border bg-white mt-2">
			<SyntaxHighlighter
				language="json"
				style={oneLight}
				showLineNumbers
				wrapLines
				customStyle={{
					margin: 0,
					padding: "1rem",
					fontSize: "0.875rem",
					lineHeight: "1.5",
					background: "transparent",
					maxHeight: "350px",
					overflowY: "auto",
				}}
				lineNumberStyle={{ color: "#94A3B8", paddingRight: "1rem" }}
				codeTagProps={{
					style: {
						wordBreak: "break-all",
						whiteSpace: "pre-wrap",
					},
				}}
			>
				{codeString}
			</SyntaxHighlighter>
		</div>
	);
};

export function RequestMetadataWithLogs({
	selectedTest,
}: RequestMetadataWithLogsProps) {
	const [displayedLogs, setDisplayedLogs] = useState<LogEntryWithTimestamp[]>(
		[]
	);
	const [isClient, setIsClient] = useState(false);
	const logContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setIsClient(true);
	}, []);

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

	useEffect(() => {
		if (!selectedTest?.logs || !isClient) {
			setDisplayedLogs([]);
			return;
		}

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

	useEffect(() => {
		if (logContainerRef.current) {
			logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
		}
	}, [displayedLogs]);

	const getLogLevelClass = (level: LogLevel) => {
		switch (level) {
			case "INFO":
				return "text-[#3B82F6]";
			case "WARNING":
				return "text-[#F59E0B]";
			case "ERROR":
				return "text-[#EF4444]";
			case "DEBUG":
				return "text-[#94A3B8]";
			default:
				return "text-[#3B82F6]";
		}
	};

	if (!isClient) {
		return (
			<div className="space-y-6">
				<div className="space-y-3">
					<p className="text-xl font-semibold">Test Logs</p>
					<div className="bg-[#1E293B] p-3 rounded-lg h-[200px] animate-pulse"></div>
				</div>
				<div className="space-y-3">
					<p className="text-xl font-semibold">Request & Response Details</p>
					<div className="bg-[#F8FAFC] rounded-lg h-[200px] animate-pulse"></div>
				</div>
			</div>
		);
	}

	if (!selectedTest) {
		return (
			<div className="flex items-center justify-center h-full text-muted-foreground">
				Select a test to view its details.
			</div>
		);
	}

	const {
		headers: requestHeaders,
		body: requestBody,
		responseHeaders,
		assertionResults,
	} = selectedTest.metadata;

	let parsedResponseBody;
	try {
		parsedResponseBody = JSON.parse(selectedTest.metadata.responseBody);
	} catch (e) {
		parsedResponseBody = selectedTest.metadata.responseBody;
	}

	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<div className="flex justify-between items-center">
					<p className="text-xl font-semibold">Test Logs</p>
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

			<div className="space-y-3">
				<p className="text-xl font-semibold">Request & Response Details</p>
				<Tabs defaultValue="responseBody" className="w-full">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="responseBody">Response</TabsTrigger>
						<TabsTrigger value="requestBody">Request</TabsTrigger>
						<TabsTrigger value="headers">Headers</TabsTrigger>
						<TabsTrigger value="assertions">Status</TabsTrigger>
					</TabsList>
					<TabsContent value="responseBody">
						<CodeBlockTab data={parsedResponseBody} />
					</TabsContent>
					<TabsContent value="requestBody">
						<CodeBlockTab data={requestBody} />
					</TabsContent>
					<TabsContent value="headers">
						<CodeBlockTab data={responseHeaders} />
					</TabsContent>
					<TabsContent value="assertions">
						<CodeBlockTab data={assertionResults} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
