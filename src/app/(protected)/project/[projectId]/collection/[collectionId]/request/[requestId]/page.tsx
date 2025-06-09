"use client";

import React, { useEffect, use } from "react";
import { CollectionSidebar } from "@/components/app-sidebar-collection";
import RequestContent from "@/components/collection-detail/request-content";
import { SidebarCollectionProvider } from "@/components/ui/sidebar-collection";
import { useProjectStore } from "@/store/project-store";

const RequestDetail = ({
	params,
}: {
	params: Promise<{ projectId: string; requestId: string }>;
}) => {
	const { projectId, requestId } = use(params);

	console.log(projectId);

	const { setProjectByProjectId } = useProjectStore();

	useEffect(() => {
		setProjectByProjectId(projectId);
	}, [projectId, setProjectByProjectId]);

	return (
		<div className="flex h-screen overflow-hidden">
			<SidebarCollectionProvider>
				<CollectionSidebar />
			</SidebarCollectionProvider>
			<div className="flex-1 min-w-0 overflow-auto">
				<RequestContent projectId={projectId} requestId={requestId} />
			</div>
		</div>
	);
};

export default RequestDetail;
