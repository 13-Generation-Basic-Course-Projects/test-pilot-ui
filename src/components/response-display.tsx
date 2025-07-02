"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X } from "lucide-react";

type ResponseData = {
	status: number;
	statusText: string;
	headers: Record<string, string>;
	body: any;
	duration: number;
	size: number;
};

type ResponseDisplayProps = {
	response: ResponseData;
	onClose: () => void;
};

const getStatusColor = (status: number) => {
	if (status >= 200 && status < 300) return "bg-green-500";
	if (status >= 400) return "bg-red-500";
	if (status >= 300) return "bg-yellow-500";
	return "bg-gray-500";
};

export function ResponseDisplay({ response, onClose }: ResponseDisplayProps) {
	const prettyPrintedBody = JSON.stringify(response.body, null, 2);
	const prettyPrintedHeaders = JSON.stringify(response.headers, null, 2);

	return (
		<Card className="w-full h-full flex flex-col shadow-lg rounded-t-lg rounded-b-none">
			<CardHeader className="flex flex-row items-center justify-between py-3">
				<CardTitle className="flex items-center gap-4 text-lg">
					Response
					<div className="flex items-center gap-2 text-sm font-medium">
						<Badge variant="outline">
							Status:{" "}
							<span
								className={`ml-1.5 w-2.5 h-2.5 rounded-full inline-block ${getStatusColor(
									response.status
								)}`}
							></span>
							<span className="ml-1.5">
								{response.status} {response.statusText}
							</span>
						</Badge>
						<Badge variant="outline">
							Time:{" "}
							<span className="ml-1 font-semibold">{response.duration} ms</span>
						</Badge>
						<Badge variant="outline">
							Size:{" "}
							<span className="ml-1 font-semibold">{response.size} B</span>
						</Badge>
					</div>
				</CardTitle>
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					className="h-8 w-8"
				>
					<X className="h-5 w-5" />
				</Button>
			</CardHeader>
			<CardContent className="flex-grow overflow-hidden">
				<Tabs defaultValue="body" className="h-full flex flex-col">
					<TabsList>
						<TabsTrigger value="body">Body</TabsTrigger>
						<TabsTrigger value="headers">Headers</TabsTrigger>
					</TabsList>
					<TabsContent value="body" className="flex-grow overflow-auto">
						<pre className="mt-2 w-full whitespace-pre-wrap break-words rounded-md bg-secondary p-4 text-sm font-mono">
							<code>{prettyPrintedBody}</code>
						</pre>
					</TabsContent>
					<TabsContent value="headers" className="flex-grow overflow-auto">
						<pre className="mt-2 w-full whitespace-pre-wrap break-words rounded-md bg-secondary p-4 text-sm font-mono">
							<code>{prettyPrintedHeaders}</code>
						</pre>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
