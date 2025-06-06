"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

type LogLevel = "INFO" | "WARNING" | "ERROR" | "DEBUG";

interface LogEntry {
	timestamp: string;
	level: LogLevel;
	message: string;
	source?: string;
	testId?: number;
	testName?: string;
}

interface LiveLogConsoleProps {
	logs: LogEntry[];
	compact?: boolean;
}

export function LiveLogConsole({ logs, compact = false }: LiveLogConsoleProps) {
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const [autoScroll, setAutoScroll] = useState(true);

	// Auto-scroll to bottom when new logs appear if autoScroll is enabled
	useEffect(() => {
		if (autoScroll && scrollAreaRef.current) {
			const scrollContainer = scrollAreaRef.current.querySelector(
				"[data-radix-scroll-area-viewport]"
			);
			if (scrollContainer) {
				scrollContainer.scrollTop = scrollContainer.scrollHeight;
			}
		}
	}, [logs, autoScroll]);

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

	const getTestBadgeClass = (testId?: number) => {
		if (!testId) return "";
		const colors = [
			"bg-blue-100 text-blue-800",
			"bg-green-100 text-green-800",
			"bg-purple-100 text-purple-800",
			"bg-orange-100 text-orange-800",
		];
		return colors[(testId - 1) % colors.length];
	};

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const target = e.currentTarget;
		const isScrolledToBottom =
			Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) <
			10;

		// Only change autoScroll state when needed to prevent unnecessary renders
		if (autoScroll !== isScrolledToBottom) {
			setAutoScroll(isScrolledToBottom);
		}
	};

	const scrollToBottom = () => {
		if (scrollAreaRef.current) {
			const scrollContainer = scrollAreaRef.current.querySelector(
				"[data-radix-scroll-area-viewport]"
			);
			if (scrollContainer) {
				scrollContainer.scrollTop = scrollContainer.scrollHeight;
				setAutoScroll(true);
			}
		}
	};

	return (
		<div className="h-full flex flex-col overflow-hidden">
			{!compact && (
				<div className="flex justify-end items-center mb-4 flex-shrink-0 min-w-0 gap-1">
					<div className="text-sm text-[#94A3B8]">{logs.length} entries</div>
					{!autoScroll && (
						<Button
							variant="outline"
							size="sm"
							className="h-7 w-7 p-0 shrink-0"
							onClick={scrollToBottom}
						>
							<ChevronDown className="h-3 w-3" />
						</Button>
					)}
				</div>
			)}

			<div className="flex-1 bg-[#1E293B] text-white font-mono rounded-lg overflow-hidden min-h-0">
				<ScrollArea
					ref={scrollAreaRef}
					className="h-full"
					onScrollCapture={handleScroll}
				>
					<div className="p-3 space-y-1">
						{logs.length === 0 ? (
							<div className="flex items-center justify-center h-32 text-[#94A3B8]">
								<span className="truncate text-sm">Waiting for logs...</span>
							</div>
						) : (
							logs.map((log, index) => (
								<div
									key={index}
									className="flex items-center gap-1 text-sm min-w-0 h-5"
								>
									<span
										className="text-[#94A3B8] shrink-0 w-[50px] truncate"
										title={log.timestamp}
										style={{ display: compact ? "none" : "inline" }}
									>
										{log.timestamp.split(".")[0]}
									</span>
									<span
										className={`${getLogLevelClass(
											log.level
										)} shrink-0 font-medium w-[35px] truncate`}
										title={`[${log.level}]`}
									>
										[{log.level.charAt(0)}]
									</span>
									{log.source && (
										<span
											className="text-[#A78BFA] shrink-0 w-[45px] truncate"
											title={`[${log.source}]`}
											style={{ display: compact ? "none" : "inline" }}
										>
											[{log.source.substring(0, 3)}]
										</span>
									)}
									{log.testId && log.testName && (
										<span
											className={`px-1 py-0.5 rounded text-sm font-medium shrink-0 ${getTestBadgeClass(
												log.testId
											)}`}
											title={`Test ${log.testId}: ${log.testName}`}
										>
											T{log.testId}
										</span>
									)}
									<span
										className="text-white flex-1 min-w-0 truncate"
										title={log.message}
									>
										{log.message}
									</span>
								</div>
							))
						)}

						{logs.length > 0 && (
							<div className="inline-block animate-pulse text-[#94A3B8]">▋</div>
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
}
