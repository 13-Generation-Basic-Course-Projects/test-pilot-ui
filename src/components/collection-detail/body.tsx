// components/Body.tsx

"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "../code-block/code-block";
import { TestCase } from "./test-case";
import { TestRequestBody } from "./test-request-body";

type WorkflowState = "initial" | "parsed" | "test_cases_added";

// We no longer need the full-screen LoadingState component here.

interface BodyProps {
	// ... (props definition remains the same)
	selectedTab: string;
	innerTab: string;
	workflowState: WorkflowState;
	isGenerating: boolean;
	onTabSelect: (value: string) => void;
	onParse: () => void;
	onTestCasesAdded: () => void;
	onInnerTabChange: (value: string) => void;
	isParsing: boolean;
}

export const Body = ({
	selectedTab,
	innerTab,
	workflowState,
	isGenerating,
	onTabSelect,
	onParse,
	onTestCasesAdded,
	onInnerTabChange,
	isParsing,
}: BodyProps) => {
	const isLoading = isGenerating || isParsing;
	return (
		<div className="w-full mx-auto mt-10 bg-white space-y-5">
			<p className="text-xl">Body</p>

			<RadioGroup
				value={selectedTab}
				onValueChange={onTabSelect}
				className="flex gap-2"
				disabled={isLoading} // Disable radio buttons while generating
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

				{selectedTab === "raw-body" && (
					// ✨ 1. REMOVED: The conditional that replaced this whole block with a loader.
					<Tabs
						value={innerTab}
						onValueChange={onInnerTabChange}
						className="w-full"
					>
						{/* ✨ 2. DISABLE TABS: The tabs are now disabled during generation. */}
						<TabsList className="w-full">
							<TabsTrigger value="raw-body" disabled={isLoading}>
								Raw Body
							</TabsTrigger>
							<TabsTrigger
								value="test-case"
								disabled={workflowState === "initial" || isLoading}
							>
								Test Case
							</TabsTrigger>
							<TabsTrigger
								value="test-request"
								disabled={workflowState !== "test_cases_added" || isLoading}
							>
								Test Request
							</TabsTrigger>
						</TabsList>

						<TabsContent value="raw-body">
							<CodeBlock onParse={onParse} />
						</TabsContent>

						<TabsContent value="test-case">
							{/* ✨ 3. PASS PROP: Pass the `isGenerating` state down to the child. */}
							<TestCase
								onTestCasesAdded={onTestCasesAdded}
								isGenerating={isGenerating}
							/>
						</TabsContent>

						<TabsContent value="test-request">
							<TestRequestBody />
						</TabsContent>
					</Tabs>
				)}
			</div>
		</div>
	);
};
