"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "./code-block";
import { TestCase } from "./test-case";
import { TestRequestBody } from "./test-request-body";

export const Body = () => {
	const [selectedTab, setSelectedTab] = useState("none");
	const [innerTab, setInnerTab] = useState("raw-body");

	const handleParse = () => {
		setInnerTab("test-case"); // Switch to Test Case tab
	};

	return (
		<div className="w-full mx-auto mt-10 bg-white space-y-5">
			<p className="text-xl">Body</p>

			{/* Tabs as Radio Buttons */}
			<RadioGroup
				defaultValue="none"
				onValueChange={setSelectedTab}
				className="flex gap-2"
			>
				{/* None Tab */}
				<div className={`flex items-center space-x-2 px-3 py-2 cursor-pointer`}>
					<RadioGroupItem value="none" id="r1" />
					<Label htmlFor="r1">None</Label>
				</div>

				{/* Raw Body Tab */}
				<div className={`flex items-center space-x-2 px-3 py-2 cursor-pointer`}>
					<RadioGroupItem value="raw-body" id="r2" />
					<Label htmlFor="r2">Raw Body</Label>
				</div>
			</RadioGroup>

			{/* Conditional Content Based on Selected Tab */}
			<div className="mt-4">
				{selectedTab === "none" && (
					<div className="p-4 border border-gray-200 rounded-md">
						<p>None</p>
					</div>
				)}

				{selectedTab === "raw-body" && (
					<Tabs value={innerTab} onValueChange={setInnerTab} className="w-full">
						<TabsList className="w-full">
							<TabsTrigger value="raw-body">Raw Body</TabsTrigger>
							<TabsTrigger value="test-case">Test Case</TabsTrigger>
							<TabsTrigger value="test-request">Test Request</TabsTrigger>
						</TabsList>

						<TabsContent value="raw-body">
							<CodeBlock onParse={handleParse} />
						</TabsContent>

						<TabsContent value="test-case">
							<TestCase />
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
