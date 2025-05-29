import React from "react";

export function PreviewSkeleton() {
	return (
		<div className="space-y-6 animate-pulse">
			<h2 className="text-xl font-semibold h-6 bg-gray-200 rounded w-3/4"></h2>

			<div className="space-y-4">
				<div className="flex space-x-2 items-center">
					<div className="h-4 bg-gray-200 rounded w-16"></div>
					<div className="h-8 bg-gray-200 rounded w-24"></div>
				</div>
				<div className="flex space-x-2 items-center">
					<div className="h-4 bg-gray-200 rounded w-16"></div>
					<div className="h-8 bg-gray-200 rounded w-32"></div>
				</div>
				<div className="flex space-x-2 items-center">
					<div className="h-4 bg-gray-200 rounded w-16"></div>
					<div className="h-8 bg-gray-200 rounded w-full"></div>
				</div>
			</div>

			<hr className="text-[#94A3B8]" />

			<div className="space-y-2">
				<div className="h-5 bg-gray-200 rounded w-24"></div>
				<div className="bg-[#F8FAFC] p-4 rounded-md h-24 overflow-hidden">
					<div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
					<div className="h-4 bg-gray-300 rounded w-5/6"></div>
				</div>
			</div>

			<div className="space-y-2">
				<div className="h-5 bg-gray-200 rounded w-16"></div>
				<div className="bg-[#F8FAFC] p-4 rounded-md h-24 overflow-hidden">
					<div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
					<div className="h-4 bg-gray-300 rounded w-5/6"></div>
				</div>
			</div>
		</div>
	);
}
