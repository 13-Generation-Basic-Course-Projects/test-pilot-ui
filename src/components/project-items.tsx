// components/project-items.tsx ← No "use client"

import { projectsData } from "@/lib/constants";
import ProjectLists from "./project-lists";

interface ProjectItemsProps {
	searchQuery?: string;
}

export default function ProjectItems({ searchQuery = "" }: ProjectItemsProps) {
	const filteredProjects = projectsData.filter((project) => {
		const lowerSearch = searchQuery.toLowerCase();
		return project.title.toLowerCase().includes(lowerSearch) || false;
	});

	return <ProjectLists projects={filteredProjects} />;
}
