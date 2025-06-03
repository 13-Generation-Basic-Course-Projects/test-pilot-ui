import { NavbarComponent } from "@/components/navbar";
import ProjectForm from "@/components/project/project-form";
import ProjectItems from "@/components/project/project-items";
import { SearchForm } from "@/components/search-form";
import { getAllProjectService } from "@/service/project-service";
import Image from "next/image";
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
