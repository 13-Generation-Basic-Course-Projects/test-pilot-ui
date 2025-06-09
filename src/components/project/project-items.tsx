import ProjectLists from "./project-lists";

interface ProjectItemsProps {
	searchQuery?: string;
}

export default function ProjectItems({ searchQuery = "" }: ProjectItemsProps) {
	return <ProjectLists searchQuery={searchQuery} />;
}
