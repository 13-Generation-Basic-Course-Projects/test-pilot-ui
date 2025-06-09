import { CollectionSidebar } from "@/components/app-sidebar-collection";
import RequestContent from "@/components/collection-detail/request-content";
import { SidebarCollectionProvider } from "@/components/ui/sidebar-collection";
import { getAllPredefinedService } from "@/service/pre-defined-service";
import React from "react";

const RequestDetail = async ({
	params,
}: {
	params: Promise<{
		projectId: string;
		collectionId: string;
		requestId: string;
	}>;
}) => {
	const { projectId, requestId, collectionId } = await params;

	return (
		<div className="flex h-screen overflow-hidden">
			<SidebarCollectionProvider>
				<CollectionSidebar projectId={projectId} />
			</SidebarCollectionProvider>
			<div className="flex-1 min-w-0 overflow-auto">
				<RequestContent projectId={projectId} requestId={requestId} />
			</div>
		</div>
	);
};

export default RequestDetail;
