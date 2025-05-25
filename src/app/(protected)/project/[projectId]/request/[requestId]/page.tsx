import { CollectionSidebar } from "@/components/collection";
import RequestContent from "@/components/request-content";
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
