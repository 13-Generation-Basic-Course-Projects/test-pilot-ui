import React from "react";

const RequestContent = ({
	projectId,
	requestId,
}: {
	projectId: string;
	requestId: string;
}) => {
	return (
		<div>
			{projectId}
			{requestId}
		</div>
	);
};

export default RequestContent;
