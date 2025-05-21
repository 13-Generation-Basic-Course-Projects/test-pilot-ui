import { NavbarComponent } from "@/components/navbar";
import ProjectForm from "@/components/project-form";
import ProjectItems from "@/components/project-items";
import { SearchForm } from "@/components/search-form";
import React from "react";

const ProjectPage = () => {
	return (
		<div>
			<NavbarComponent />
			<div className="container mx-auto lg:px-20 lg:py-10">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl">Projects</h1>
						<p className="text-slate-400 mt-2">
							Manage your API testing projects
						</p>
					</div>
					<ProjectForm mode="create" />
				</div>
				<SearchForm className="mt-10" />
				<div className="w-full mt-10">
					<ProjectItems />
				</div>
			</div>
		</div>
	);
};

export default ProjectPage;
