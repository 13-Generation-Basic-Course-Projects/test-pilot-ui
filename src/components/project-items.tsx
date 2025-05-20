import React from "react";
import { projectsData } from "@/lib/constants";
import ProjectLists from "./project-lists";

const ProjectItems = () => {
	return (
		<>
			<ProjectLists projects={projectsData} />
		</>
	);
};

export default ProjectItems;
