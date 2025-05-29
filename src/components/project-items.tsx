import { projectsData } from "@/lib/constants";
import ProjectLists from "./project-lists";
import { ProjectItem } from "@/types"; // Make sure to import ProjectItem

interface ProjectItemsProps {
	searchQuery?: string;
}

export default function ProjectItems({ searchQuery = "" }: ProjectItemsProps) {
	// Cast projectsData to ProjectItem[] to satisfy the type checker,
	// assuming projectsData now conforms to ProjectItem.
	// Or, better yet, explicitly type projectsData in constants.ts.
	const typedProjectsData: ProjectItem[] = projectsData as ProjectItem[];

	const filteredProjects = typedProjectsData.filter((project) => {
		const lowerSearch = searchQuery.toLowerCase();
		// Use project.title as expected by the ProjectItem interface
		// This assumes you've updated your projectsData to have a 'title' property
		return project.title.toLowerCase().includes(lowerSearch) || false;
	});

	return <ProjectLists projects={filteredProjects} />;
}
