"use client";

import { CollectionSidebar } from "@/components/app-sidebar-collection";
import { SidebarCollectionProvider } from "@/components/ui/sidebar-collection";
import { useProjectStore } from "@/store/project-store";
import React, { use, useEffect } from "react";

const ProjectDetailPage = ({
	params,
}: {
	params: Promise<{ projectId: string }>;
}) => {
	const { projectId } = use(params);

	console.log(projectId);

	const { setProjectByProjectId } = useProjectStore();

	useEffect(() => {
		setProjectByProjectId(projectId);
	}, [projectId, setProjectByProjectId]);
	return (
		<div className="flex h-full w-full">
			<SidebarCollectionProvider>
				<CollectionSidebar />
			</SidebarCollectionProvider>
			<div className="hidden md:flex items-center justify-center relative flex-1 self-stretch grow bg-[#f9fafb]">
				<div className="text-slate-400">Select an endpoint to see details</div>
			</div>
		</div>
	);
};

export default ProjectDetailPage;
