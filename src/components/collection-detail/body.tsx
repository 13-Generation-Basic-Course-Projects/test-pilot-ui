"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react"; // Import a loading icon
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "../code-block/code-block";
import { TestCase } from "./test-case";
import { TestRequestBody } from "./test-request-body";

type WorkflowState = "initial" | "parsed" | "test_cases_added";

// ✨ 1. (Optional but recommended) A simple component for the loading indicator
const LoadingState = () => (
	<div className="flex flex-col items-center justify-center min-h-[480px] text-muted-foreground">
		<Loader2 className="h-8 w-8 animate-spin mb-4" />
		<p className="text-lg">Generating Test Requests...</p>
	</div>
);

export const Body = () => {
	const [selectedTab, setSelectedTab] = useState("none");
	const [innerTab, setInnerTab] = useState("raw-body");
	const [workflowState, setWorkflowState] = useState<WorkflowState>("initial");

	// ✨ 2. Add a new state to manage the loading period
	const [isGenerating, setIsGenerating] = useState(false);

	const handleParse = () => {
		setWorkflowState("parsed");
		setInnerTab("test-case");
	};

	// ✨ 3. Update this handler to manage the loading simulation
	const handleTestCasesAdded = () => {
		// Enter the loading state
		setIsGenerating(true);

		// Simulate a 2-second network or processing delay
		setTimeout(() => {
			// After 2 seconds, update the state as before
			setWorkflowState("test_cases_added");
			setInnerTab("test-request");

			// Exit the loading state
			setIsGenerating(false);
		}, 2000); // 2000 milliseconds = 2 seconds
	};

	const handleTabSelection = (value: string) => {
		setSelectedTab(value);
		if (value !== "raw-body") {
			setWorkflowState("initial");
			setInnerTab("raw-body");
		}
	};

	return (
		<div className="w-full mx-auto mt-10 bg-white space-y-5">
			<p className="text-xl">Body</p>

			<RadioGroup
				defaultValue="none"
				onValueChange={handleTabSelection}
				className="flex gap-2"
			>
				{/* ... RadioGroup items ... */}
				<div className={`flex items-center space-x-2 px-3 py-2 cursor-pointer`}>
					<RadioGroupItem value="none" id="r1" />
					<Label htmlFor="r1">None</Label>
				</div>
				<div className={`flex items-center space-x-2 px-3 py-2 cursor-pointer`}>
					<RadioGroupItem value="raw-body" id="r2" />
					<Label htmlFor="r2">Raw Body</Label>
				</div>
			</RadioGroup>

			<div className="mt-4">
				{selectedTab === "none" && (
					<div className="p-4 border border-gray-200 rounded-md">
						<p>This request does not have a body.</p>
					</div>
				)}

				{selectedTab === "raw-body" &&
					// ✨ 4. Conditionally render either the Loading state or the Tabs
					(isGenerating ? (
						<LoadingState />
					) : (
						<Tabs
							value={innerTab}
							onValueChange={setInnerTab}
							className="w-full"
						>
							<TabsList className="w-full">
								<TabsTrigger value="raw-body" className="cursor-pointer">
									Raw Body
								</TabsTrigger>
								<TabsTrigger
									value="test-case"
									className="cursor-pointer"
									disabled={workflowState === "initial"}
								>
									Test Case
								</TabsTrigger>
								<TabsTrigger
									value="test-request"
									className="cursor-pointer"
									// This disabled logic is still relevant for when not loading
									disabled={workflowState !== "test_cases_added"}
								>
									Test Request
								</TabsTrigger>
							</TabsList>

							<TabsContent value="raw-body">
								<CodeBlock onParse={handleParse} />
							</TabsContent>

							<TabsContent value="test-case">
								<TestCase onTestCasesAdded={handleTestCasesAdded} />
							</TabsContent>

							<TabsContent value="test-request">
								<TestRequestBody />
							</TabsContent>
						</Tabs>
					))}
			</div>
		</div>
	);
};
