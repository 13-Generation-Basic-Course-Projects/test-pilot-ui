
"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ProjectItem } from "@/types";
import { getProjectAction } from "@/action/project-action";

const BreadcrumbNavbar = ({ params }: { params: string[] }) => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjectAction();
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.error("getProjectAction did not return an array", data);
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  if (!Array.isArray(projects) || projects.length === 0) {
    console.warn("No projects available to display in breadcrumb", { params });
    return null;
  }

  const projectFound = projects.find((project) => project.id === params[0]);

  if (!projectFound) {
    console.warn(`No project found for ID: ${params[0]}`, { params, projects });
  } else if (!projectFound.title || projectFound.title === "Untitled Project") {
    console.warn(`Project with ID ${params[0]} has invalid title`, projectFound);
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/project">
            <HomeIcon size={18} />
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbLink href={`/project/${params[0]}`}>
            <h1 className="mb-[3px]">{projectFound?.title ?? "Project"}</h1>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNavbar;
