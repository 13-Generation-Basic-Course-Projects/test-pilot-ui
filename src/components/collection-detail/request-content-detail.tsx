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

export function RequestContentDetail({
	projectId,
	requestId,
	request,
}: {
	projectId: string;
	requestId: string;
	request: EndpointItem[];
}) {
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
				<Body request={request} requestId={requestId} projectId={projectId} />
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
