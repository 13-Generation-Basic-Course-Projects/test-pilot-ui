"use client";

import React from "react";
import {
	Tabs,
	TabsContent,
	TabsListV2,
	TabsTriggerV2,
} from "@/components/ui/tabs";
import PredefinedTestCase from "./predefined-test-case";
import { ApiRequestContentHeader } from "./api-request-content-header";
import { ApiRequestDetailParam } from "./api-request-detail-params-testcase";
import { Body } from "./body";
import { CustomValue } from "./custom-value";
import { EndpointItem } from "@/types";
// ✨ 1. Import the store to get the current method
import { useRequestStore } from "@/store/request-url-slice";

export function RequestContentDetail({
	projectId,
	requestId,
	request,
}: {
	projectId: string;
	requestId: string;
	request: EndpointItem[];
}) {
	// ✨ 2. Get the current method from your Zustand store
	const { method } = useRequestStore();

	// ✨ 3. Create a flag to determine if the body should be disabled
	const isBodyDisabled = method === "GET" || method === "DELETE";

	return (
		<Tabs defaultValue="request-content" className="w-full">
			<TabsListV2 className="mb-10">
				<TabsTriggerV2 value="request-content">Request Content</TabsTriggerV2>
				<TabsTriggerV2 value="predefined-value">Predefined Value</TabsTriggerV2>
				<TabsTriggerV2 value="custom-value">Custom Value</TabsTriggerV2>
			</TabsListV2>
			<TabsContent value="request-content">
				<ApiRequestDetailParam request={request} requestId={requestId} />
				<ApiRequestContentHeader requests={request} requestId={requestId} />

				{/* ✨ 4. Conditionally render the Body or a placeholder */}
				{isBodyDisabled ? (
					<div className="mt-8 p-6 text-center text-muted-foreground border rounded-md bg-slate-50">
						A request body is not used for {method} requests.
					</div>
				) : (
					<Body request={request} requestId={requestId} projectId={projectId} />
				)}
			</TabsContent>
			<TabsContent value="predefined-value">
				<PredefinedTestCase />
			</TabsContent>
			<TabsContent value="custom-value">
				<CustomValue />
			</TabsContent>
		</Tabs>
	);
}
