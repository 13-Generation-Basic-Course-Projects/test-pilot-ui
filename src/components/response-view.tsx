"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle } from "lucide-react"; // Import icons
import { ResponseCodeBlock } from "./monitoring/code-block-response-v2";

// The component accepts the full API response object
type ResponseViewProps = {
	response: any;
};

export function ResponseView({ response }: ResponseViewProps) {
	// Data for the "Body" and "Headers" tabs
	const httpBody = response.body;
	const httpHeaders = response.headers;

	// Data for the new "Test Results" tab
	// We look inside the first result of the batch for assertion details
	const assertionResults = response.testBatch?.results?.[0]?.assertionResults;
	const resultsList = assertionResults ? Object.entries(assertionResults) : [];

	return (
		<Tabs defaultValue="testResults" className="h-full flex flex-col">
			<TabsList>
				{/* 👇 NEW: The "Test Results" tab trigger */}
				<TabsTrigger value="testResults">Test Results</TabsTrigger>
				<TabsTrigger value="body">Response Body</TabsTrigger>
				<TabsTrigger value="headers">Headers</TabsTrigger>
			</TabsList>

			{/* 👇 NEW: The content for the "Test Results" tab */}
			<TabsContent value="testResults" className="flex-grow overflow-auto pt-2">
				<div className="p-2 font-mono text-sm space-y-2">
					{resultsList.length > 0 ? (
						resultsList.map(([key, value]) => {
							const isPassed = String(value).toUpperCase().includes("PASSED");
							return (
								<div
									key={key}
									className={`flex items-center gap-3 p-3 rounded-md border ${
										isPassed
											? "bg-green-500/10 border-green-500/20 text-green-300"
											: "bg-red-500/10 border-red-500/20 text-red-300"
									}`}
								>
									{isPassed ? (
										<CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
									) : (
										<XCircle className="h-5 w-5 text-red-400 shrink-0" />
									)}
									<span className="break-all">{String(value)}</span>
								</div>
							);
						})
					) : (
						<div className="text-muted-foreground p-4">
							No assertion results found for this test.
						</div>
					)}
				</div>
			</TabsContent>

			{/* This is your existing "Body" tab */}
			<TabsContent value="body" className="flex-grow overflow-auto pt-2">
				<ResponseCodeBlock data={httpBody} />
			</TabsContent>

			{/* This is your existing "Headers" tab */}
			<TabsContent value="headers" className="flex-grow overflow-auto pt-2">
				<ResponseCodeBlock data={httpHeaders} />
			</TabsContent>
		</Tabs>
	);
}
