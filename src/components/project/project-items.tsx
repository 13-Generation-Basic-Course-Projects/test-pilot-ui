// components/project-items.tsx
import { projectsData } from "@/lib/constants";
import ProjectLists from "./project-lists";
import { ProjectItem } from "@/types"; // Make sure to import ProjectItem

interface ProjectItemsProps {
	searchQuery?: string;
}

export default function ProjectItems({ searchQuery = "" }: ProjectItemsProps) {
	const typedProjectsData: ProjectItem[] = projectsData as ProjectItem[];

	return <ProjectLists searchQuery={searchQuery} />;
}
