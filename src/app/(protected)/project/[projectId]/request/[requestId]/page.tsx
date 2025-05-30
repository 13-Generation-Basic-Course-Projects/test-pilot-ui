import RequestContent from "@/components/collection-detail/request-content";
import { CollectionSidebar } from "@/components/collection/collection";
import React from "react";

const RequestDetail = async ({
	params,
}: {
	params: Promise<{ projectId: string; requestId: string }>;
}) => {
	const { projectId, requestId } = await params;
	return (
		<div>
			<div className="flex">
				<CollectionSidebar />
				<RequestContent projectId={projectId} requestId={requestId} />
			</div>
		</div>
	);
};

export default RequestDetail;
