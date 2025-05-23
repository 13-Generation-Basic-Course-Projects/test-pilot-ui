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
				<div className="hidden md:flex items-center justify-center relative flex-1 self-stretch grow bg-[#f9fafb]">
					<RequestContent projectId={projectId} requestId={requestId} />
				</div>
			</div>
		</div>
	);
};

export default RequestDetail;
