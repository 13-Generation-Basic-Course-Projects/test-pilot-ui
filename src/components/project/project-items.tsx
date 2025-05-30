// components/project-items.tsx
import { projectsData } from "@/lib/constants";
import ProjectLists from "./project-lists";
import { ProjectItem } from "@/types"; // Make sure to import ProjectItem

interface ProjectItemsProps {
	searchQuery?: string;
}

export default function ProjectItems({ searchQuery = "" }: ProjectItemsProps) {
	const typedProjectsData: ProjectItem[] = projectsData as ProjectItem[];

	const filteredProjects = typedProjectsData.filter((project) => {
		const lowerSearch = searchQuery.toLowerCase();
		return project.title.toLowerCase().includes(lowerSearch) || false;
	});

	return <ProjectLists projects={filteredProjects} />;
}
