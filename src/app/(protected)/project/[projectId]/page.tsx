import { CollectionSidebar } from "@/components/collection";
import React from "react";

const ProjectDetailPage = () => {
	return (
		<div className="flex">
			<CollectionSidebar />
			<div className="hidden md:flex items-center justify-center relative flex-1 self-stretch grow bg-[#f9fafb]">
				<div className="text-slate-400">Select an endpoint to see details</div>
			</div>
		</div>
	);
};

export default ProjectDetailPage;
