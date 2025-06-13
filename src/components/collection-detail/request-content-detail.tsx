// components/RequestContentDetail.tsx

"use client"; // ✨ 1. This component must now be a Client Component to use state.

import React, { useState } from "react"; // ✨ 2. Import useState
import {
	Tabs,
	TabsContent,
	TabsListV2,
	TabsTriggerV2,
} from "@/components/ui/tabs";
import PredefinedTestCase from "./predefined-test-case";
import { ApiRequestContentHeader } from "./api-request-content-header";
import { ApiRequestDetailParam } from "./api-request-detail-params-testcase";
import { Body } from "./body"; // The "dumb" Body component
import { CustomValue } from "./custom-value";

// ✨ 3. Define the workflow state type here
type WorkflowState = "initial" | "parsed" | "test_cases_added";

export function RequestContentDetail({
	projectId,
	requestId,
}: {
	projectId: string;
	requestId: string;
}) {
	// ✨ 4. All state now lives in this parent component.
	const [selectedBodyTab, setSelectedBodyTab] = useState("none");
	const [innerBodyTab, setInnerBodyTab] = useState("raw-body");
	const [workflowState, setWorkflowState] = useState<WorkflowState>("initial");
	const [isGenerating, setIsGenerating] = useState(false);

	// ✨ 5. All handler functions are also defined here in the parent.
	const handleParse = () => {
		setWorkflowState("parsed");
		setInnerBodyTab("test-case");
	};

	const handleTestCasesAdded = () => {
		setIsGenerating(true);
		setTimeout(() => {
			setWorkflowState("test_cases_added");
			setInnerBodyTab("test-request");
			setIsGenerating(false);
		}, 2000);
	};

	const handleTabSelection = (value: string) => {
		setSelectedBodyTab(value);
		if (value !== "raw-body") {
			setWorkflowState("initial");
			setInnerBodyTab("raw-body");
		}
	};

	return (
		<Tabs defaultValue="request-content" className="w-full">
			<TabsListV2 className="mb-10">
				<TabsTriggerV2 value="request-content">Request Content</TabsTriggerV2>
				<TabsTriggerV2 value="predefined-value">Predefined Value</TabsTriggerV2>
				<TabsTriggerV2 value="custom-value">Custom Value</TabsTriggerV2>
			</TabsListV2>
			<TabsContent value="request-content">
				<ApiRequestDetailParam />
				<ApiRequestContentHeader />
				{/* ✨ 6. Pass all state and handlers down to the Body component as props */}
				<Body
					selectedTab={selectedBodyTab}
					innerTab={innerBodyTab}
					workflowState={workflowState}
					isGenerating={isGenerating}
					onTabSelect={handleTabSelection}
					onParse={handleParse}
					onTestCasesAdded={handleTestCasesAdded}
					onInnerTabChange={setInnerBodyTab}
				/>
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
