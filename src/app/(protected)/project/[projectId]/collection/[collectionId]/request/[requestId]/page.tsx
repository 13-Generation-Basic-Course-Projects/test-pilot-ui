import { CollectionSidebar } from "@/components/app-sidebar-collection";
import RequestContent from "@/components/collection-detail/request-content";
import { SidebarCollectionProvider } from "@/components/ui/sidebar-collection";
import { getRequestByCollectionId } from "@/service/request-service";
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

	const request = await getRequestByCollectionId({ collectionId });

	console.log(request);

	return (
		<div className="flex h-screen overflow-hidden">
			<SidebarCollectionProvider>
				<CollectionSidebar projectId={projectId} />
			</SidebarCollectionProvider>
			<div className="flex-1 min-w-0 overflow-auto">
				<RequestContent
					projectId={projectId}
					requestId={requestId}
					request={request}
					collectionId={collectionId}
				/>
			</div>
		</div>
	);
};

export default RequestDetail;
