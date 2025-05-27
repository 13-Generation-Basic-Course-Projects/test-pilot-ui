"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import clsx from "clsx";
import ParamTable from "./params-table";
import ApiRequestDetailTestRequest from "./test-request-ui";

export function ApiRequestDetailParam() {
	const [mode, setMode] = useState<"path" | "query">("path");

	return (
		<>
			<Tabs defaultValue="account" className="w-[700px]">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="params">Params</TabsTrigger>
					<TabsTrigger value="test_request">Test Request</TabsTrigger>
				</TabsList>

				<div className="flex p-4 gap-8">
					<button
						onClick={() => setMode("path")}
						className={clsx(
							"px-3 py-1 text-sm",
							mode === "path"
								? "border-b-2 border-blue-600 font-semibold"
								: "text-gray-500"
						)}
					>
						Path Variable
					</button>
					<button
						onClick={() => setMode("query")}
						className={clsx(
							"px-3 py-1 text-sm",
							mode === "query"
								? "border-b-2 border-blue-600 font-semibold"
								: "text-gray-500"
						)}
					>
						Query Params
					</button>
				</div>

				<TabsContent value="params">
					<Card>
						<ParamTable mode={mode} />
					</Card>
				</TabsContent>
				<TabsContent value="test_request">
					<Card>
						<ApiRequestDetailTestRequest />
					</Card>
				</TabsContent>
			</Tabs>
		</>
	);
}
