import React from "react";
import { MonitoringData } from "./monitoring-data";
import { ProgressDemo } from "./progress";
import { CodeBlockResponse } from "./code-block-response";
export default function Monitoring() {
	return (
		<div className="w-full mx-auto mt-10 bg-white rounded-xl shadow p-8 space-y-15">
			{/* Header */}
			<div className="flex justify-between">
				<div>
					<p className="text-2xl font-bold text-gray-900">Test Pilot API</p>
					<p className="text-[#71717A]">20 May, 2025 19:00PM</p>
				</div>
				<div className="text-[#71717A]">3/4 request completed</div>
			</div>

			{/* Test Summary */}
			<div className="flex justify-center space-x-50">
				<div className="text-center">
					<p className="text-4xl font-semibold">4</p>
					<p className="text-[#94A3B8]">Total Test</p>
				</div>
				<div className="text-center">
					<p className="text-4xl font-semibold text-[#17C964]">1</p>
					<p className="text-[#94A3B8]">Passed</p>
				</div>
				<div className="text-center">
					<p className="text-4xl font-semibold text-[#EF4444]">2</p>
					<p className="text-[#94A3B8]">Failed</p>
				</div>
			</div>

			{/* Execution Summary */}
			<div className="space-y-8">
				<div className="space-y-2">
					<p className="text-2xl font-semibold">Executed Request</p>
					<div className="flex justify-between">
						<p className="text-[#94A3B8]">Status: completed</p>
						<p className="text-[#94A3B8]">1/4 Passed</p>
					</div>
					<ProgressDemo />
				</div>

				{/* Request Detail Section */}
				<div className="grid grid-cols-12 gap-12">
					{/* Left Panel: Request Info + Code */}
					<div className="space-y-4 col-span-4 border-r pl-5 pr-10">
						<div className="space-y-2">
							<div className="flex space-x-2">
								<p>Status:</p>
								<div className="border border-[#E2E8F0] rounded-md px-[10px] text-[#17C964]">
									200 OK
								</div>
							</div>
							<div className="flex space-x-2">
								<p>Method:</p>
								<div className="border border-[#E2E8F0] rounded-md px-[15px] text-[#006FEE]">
									PUT
								</div>
							</div>
							<div className="flex space-x-2">
								<p>Endpoint:</p>
								<p>http://localhost:8080/api/v1/habits</p>
							</div>
						</div>

						<hr className="text-[#94A3B8]" />

						<p className="text-2xl">Request Metadata</p>
						<div>
							<CodeBlockResponse />
						</div>
					</div>

					{/* Right Panel: Monitoring Table */}
					<div className="col-span-8">
						<MonitoringData />
					</div>
				</div>
			</div>
		</div>
	);
}
