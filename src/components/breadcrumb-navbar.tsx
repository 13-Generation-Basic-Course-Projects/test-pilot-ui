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
import React from "react";
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

  const projectId = params[0];
  const nestedPaths = params.slice(1);
  const projectFound = projects.find((p) => p.id === projectId);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/project">
            <HomeIcon size={18} />
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {/* Project Title */}
        <BreadcrumbItem>
          <BreadcrumbLink href={`/project/${projectId}`}>
            <span className="text-sm font-medium">
              {projectFound?.title ?? "Project"}
            </span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        

        {/* Additional nested breadcrumb segments */}
        {nestedPaths.map((segment, index) => {
          const path = `/project/${[projectId, ...nestedPaths.slice(0, index + 2)].join("/")}`;
          const label = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word

          return (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={path}>
                  <span className="text-sm font-medium">{label}</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNavbar;
