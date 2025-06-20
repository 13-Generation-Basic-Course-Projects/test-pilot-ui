import ProjectVariable from "@/components/project-variable";
import React from "react";

const ProjectVariables = async({params}: {params: Promise<{projectId: string}>}) => {
	const{projectId} = await params
	return (
		<div className="p-8">
			<ProjectVariable  projectId = {projectId}/>
		</div>
	);
};

export default ProjectVariables;
