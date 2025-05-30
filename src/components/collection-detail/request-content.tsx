import React from "react";
import { EndpointDropdownUrl } from "../endpoint-dropdown-url";
import { RequestContentDetail } from "./request-content-detail";

const RequestContent = ({
	projectId,
	requestId,
}: {
	projectId: string;
	requestId: string;
}) => {
	return (
		<div className="w-full p-5 px-20">
			<EndpointDropdownUrl projectId={projectId} requestId={requestId} />
			<div className="mt-4">
				<RequestContentDetail projectId={projectId} requestId={requestId} />
			</div>
		</div>
	);
};

export default RequestContent;
