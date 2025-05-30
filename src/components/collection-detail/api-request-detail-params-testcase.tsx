"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiRequestDetailTestRequest from "./test-request";
import { Params } from "./params";

export function ApiRequestDetailParam() {
	return (
		<Tabs defaultValue="params" className="w-full">
			<TabsList>
				<TabsTrigger value="params">Params</TabsTrigger>
				<TabsTrigger value="test-request">Test Request</TabsTrigger>
			</TabsList>
			<TabsContent value="params">
				<Params />
			</TabsContent>
			<TabsContent value="test-request">
				<ApiRequestDetailTestRequest />
			</TabsContent>
		</Tabs>
	);
}
