"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiRequestDetailTestRequest from "./test-request";
import { Params } from "./params";

export function ApiRequestDetailParam() {
	return (
		<Tabs defaultValue="params" className="w-full">
			<TabsList>
				<TabsTrigger value="params" className="text-[17px] cursor-pointer">
					Params
				</TabsTrigger>
				<TabsTrigger
					value="test-request"
					className="text-[17px] cursor-pointer"
				>
					Test Request
				</TabsTrigger>
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
