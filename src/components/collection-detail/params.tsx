import React, { useState } from "react";
import PathVariable, { ParamRow } from "./path-variable";
import QueryParams from "./query-params";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsListV2, TabsTriggerV2 } from "../ui/tabs";
import { EndpointItem } from "@/types";

export const Params = ({
	request,
	requestId,
}: {
	request: EndpointItem[];
	requestId: string;
}) => {
	return (
		<div className="w-full py-2">
			<Separator />
			<Tabs defaultValue="path-variable" className="w-full">
				<TabsListV2 className="my-2">
					<TabsTriggerV2 value="path-variable" className="text-[15px]">
						Path Variable
					</TabsTriggerV2>
					<TabsTriggerV2 value="query-params" className="text-[15px]">
						Query Params
					</TabsTriggerV2>
				</TabsListV2>

				<TabsContent value="path-variable">
					<PathVariable request={request} requestId={requestId} />
				</TabsContent>
				<TabsContent value="query-params">
					<QueryParams request={request} requestId={requestId} />
				</TabsContent>
			</Tabs>
		</div>
	);
};
