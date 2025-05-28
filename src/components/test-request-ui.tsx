"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Play } from "lucide-react";
export default function ApiRequestDetailTestRequest() {
	const [field] = useState("habitId");
	const [scenario, setScenario] = useState<string | undefined>(undefined);
	const [pathVar, setPathVar] = useState<string | undefined>("");

	const baseUrl = "http://localhost:8000/api/v1/habits";

	const handleRun = () => {
		if (!pathVar || pathVar.trim() === "") {
			setScenario("Undefined");
		} else {
			setScenario("Defined");
		}
	};

	return (
		<div className="w-full max-w-2xl space-y-4">
			{/* Top right Run All button */}
			<div className="flex justify-end">
				<Button onClick={handleRun} className="bg-black text-white">
					Run All <Play className="ml-1 h-4 w-4" />
				</Button>
			</div>

			{/* Run one  Section */}
			<div className="border rounded-md p-4 space-y-4">
				{/* Field + Run */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="font-medium">Field:</span>
						<Badge variant="outline" className="text-blue-500">
							{field}
						</Badge>
					</div>
					<Button onClick={handleRun} className="bg-black text-white">
						Run <Play className="ml-1 h-4 w-4" />
					</Button>
				</div>
				{/* Scenario display */}
				<div className="flex items-center gap-2">
					<span className="font-medium">Scenario:</span>
					<Badge className="bg-gray-800 text-white rounded-full  px-3 py-1 text-xs">
						{scenario ?? "Undefined"}
					</Badge>
				</div>

				{/* Input field */}
				<div>
					<p className="mb-1 font-medium">Request Path Variable:</p>
					<Input
						placeholder={`${baseUrl}/your-path-variable`}
						value={pathVar}
						onChange={(e) => setPathVar(e.target.value)}
					/>
				</div>
			</div>
			<div className="border rounded-md p-4 space-y-4">
				{/* Field + Run */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="font-medium">Field:</span>
						<Badge variant="outline" className="text-blue-500">
							{field}
						</Badge>
					</div>
					<Button onClick={handleRun} className="bg-black text-white">
						Run <Play className="ml-1 h-4 w-4" />
					</Button>
				</div>

				{/* Scenario display */}
				<div className="flex items-center gap-2">
					<span className="font-medium">Scenario:</span>
					<Badge className="bg-gray-800 text-white rounded-full px-3 py-1 text-xs">
						{scenario ?? "Undefined"}
					</Badge>
				</div>

				{/* Input field */}
				<div>
					<p className="mb-1 font-medium">Request Path Variable:</p>
					<Input
						placeholder={`${baseUrl}/your-path-variable`}
						value={pathVar}
						onChange={(e) => setPathVar(e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
}
