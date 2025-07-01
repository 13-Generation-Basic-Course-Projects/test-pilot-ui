import { getAllProjectService } from "@/service/project-service";
import ProjectLists from "./project-lists";
import { ProjectItem } from "@/types";

interface ProjectItemsProps {
  searchQuery?: string;
}

export default async function ProjectItems({ searchQuery = "" }: ProjectItemsProps) {
  const { projects } = await getAllProjectService();

  const filteredProjects = projects.filter((project) => {
    const lowerSearch = searchQuery.toLowerCase();
    return project.title.toLowerCase().includes(lowerSearch);
  });

  return <ProjectLists projects={filteredProjects} />;
}