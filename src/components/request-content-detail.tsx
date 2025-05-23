import React from "react";
import {
	Tabs,
	TabsContent,
	TabsListV2,
	TabsTriggerV2,
} from "@/components/ui/tabs";
import { CustomValue } from "./custom-value";

export function RequestContentDetail({
	projectId,
	requestId,
}: {
	projectId: string;
	requestId: string;
}) {
	return (
		<div>
			<Tabs defaultValue="request-content" className="w-full">
				<TabsListV2 className="mb-10">
					<TabsTriggerV2 value="request-content">Request Content</TabsTriggerV2>
					<TabsTriggerV2 value="predefined-value">
						Predefined Value
					</TabsTriggerV2>
					<TabsTriggerV2 value="custom-value">Custom Value</TabsTriggerV2>
				</TabsListV2>
				<TabsContent value="request-content">Request Content</TabsContent>
				<TabsContent value="predefined-value">Predefined Value</TabsContent>
				<TabsContent value="custom-value">
					<CustomValue />
				</TabsContent>
			</Tabs>
		</div>
	);
}
