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
		<Tabs defaultValue="body" className="h-full flex flex-col">
			<TabsList>
				<TabsTrigger value="body">Response Body</TabsTrigger>
				<TabsTrigger value="headers">Headers</TabsTrigger>
			</TabsList>
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
