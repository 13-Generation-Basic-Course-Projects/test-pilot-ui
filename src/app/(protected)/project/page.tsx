import { NavbarComponent } from "@/components/navbar";
import ProjectItems from "@/components/project/project-items";
import { getAllProjectService } from "@/service/project-service";
import React from "react";

const ProjectPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ query?: string }>;
}) => {
	const { query } = await searchParams;
	const project = await getAllProjectService();
	console.log(project.payload);

	return (
		<div>
			<NavbarComponent />
			<div className="container mx-auto lg:px-20 lg:py-10">
				<ProjectItems searchQuery={query} />
			</div>
		</div>
	);
};

export default ProjectPage;
