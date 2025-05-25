import React from "react";
import { EndpointDropdown } from "./endpoint-dropdown";

const RequestContent = ({
	projectId,
	requestId,
}: {
	projectId: string;
	requestId: string;
}) => {
	return (
		<div className="w-full">
			<EndpointDropdown projectId={projectId} requestId={requestId} />
			{projectId}
			{requestId}
		</div>
	);
};

export default RequestContent;
