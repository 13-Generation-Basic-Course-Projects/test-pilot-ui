import React from "react";
import { EndpointDropdownUrl } from "../endpoint-dropdown-url";
import { RequestContentDetail } from "./request-content-detail";
import { EndpointItem } from "@/types/index";

const RequestContent = ({
	projectId,
	requestId,
	request,
	collectionId,
}: {
	projectId: string;
	requestId: string;
	request: EndpointItem[];
	collectionId: string;
}) => {
	return (
		<div className="w-full p-5 px-20">
			<EndpointDropdownUrl
				projectId={projectId}
				requestId={requestId}
				request={request}
				collectionId={collectionId}
			/>
			<div className="mt-4">
				<RequestContentDetail projectId={projectId} requestId={requestId} />
			</div>
		</div>
	);
};

export default RequestContent;
