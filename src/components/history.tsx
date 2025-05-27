import React from "react";
import { Button } from "./ui/button";
import { HistoryData } from "./history-data";
export default function History() {
	return (
		<div className="w-full  mx-auto mt-10 bg-white p-8 space-y-15">
			{/* Header */}
			<div className="flex justify-between">
				<div>
					<p className="text-2xl font-bold text-gray-900">
						History : Test Pilot API
					</p>
				</div>
				<div>
					<Button className="cursor-pointer">Run All History</Button>
				</div>
			</div>
			<div className="grid grid-cols-12">
				<div className="col-span-8 pr-10">
					<HistoryData />
				</div>

				<div className="space-y-4 col-span-4 pl-10 border-l">
					<div className="space-y-2 w-fit">
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
					<div className="text-[#94A3B8]">
						No preview
						{/* <SnippetCode /> */}
					</div>
				</div>
			</div>
		</div>
	);
}
