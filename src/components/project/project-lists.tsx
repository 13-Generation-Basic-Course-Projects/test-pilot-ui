"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { ProjectProps, ProjectItem } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  MoreHorizontal,
  CalendarPlus,
  ShareIcon,
  Trash2Icon,
  EditIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProjectForm from "./project-form";
import { DeleteProject } from "../delete/delete-project";
import { ShareProject } from "../share/share-project";
import { SearchForm } from "../search-form";
import { deleteProjectAction } from "@/action/project-action";
import { toast } from "sonner";
import { getUserProfileService } from "@/service/user-service";
import { getAllProjectService } from "@/service/project-service";
import ProjectCardSkeleton from "../project-skeleton";

const ProjectLists = ({ projects: initialProjects }: ProjectProps) => {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<ProjectItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProjectForDelete, setSelectProjectForDelete] = useState<ProjectItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProjectForShare, setSelectedProjectForShare] = useState<ProjectItem | null>(null);
  const [isShareProjectOpen, setIsShareProjectOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{ profileImage: string } | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery)
  );

  // Fetch more projects
  const loadMoreProjects = useCallback(async () => {
    if (isLoading || !hasNext) return;

    setIsLoading(true);
    try {
      const { projects: newProjects, nextCursor, hasNext } = await getAllProjectService(cursor);
      setProjects((prev) => {
        const existingIds = new Set(prev.map((project) => project.id));
        const uniqueNewProjects = newProjects.filter((project) => !existingIds.has(project.id));
        return [...prev, ...uniqueNewProjects];
      });
      setCursor(nextCursor);
      setHasNext(hasNext);
    } catch (error) {
      console.error("Failed to fetch more projects", error);
      toast.error("Failed to load more projects");
    } finally {
      setIsLoading(false);
    }
  }, [cursor, hasNext, isLoading]);

  // Set up Intersection Observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !isLoading) {
          loadMoreProjects();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreProjects]);

  // Fetch initial projects and reset on search query change
  useEffect(() => {
    const fetchInitialProjects = async () => {
      setIsInitialLoading(true);
      try {
        const { projects: newProjects, nextCursor, hasNext } = await getAllProjectService();
        setProjects(newProjects);
        setCursor(nextCursor);
        setHasNext(hasNext);
      } catch (error) {
        console.error("Failed to fetch initial projects", error);
        setProjects([]);
        setHasNext(false);
        toast.error("Failed to load projects");
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchInitialProjects();
  }, [searchQuery]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await getUserProfileService();
        setUserProfile(user);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };
    fetchUserProfile();
  }, []);

  const handleShare = (project: ProjectItem) => {
    setSelectedProjectForShare(project);
    setIsShareProjectOpen(true);
  };

  const handleDialogCloseShare = (open: boolean) => {
    setIsShareProjectOpen(open);
    if (!open) {
      setSelectedProjectForShare(null);
    }
  };

  const handleEditClick = (project: ProjectItem) => {
    setSelectedProjectForEdit(project);
    setIsEditDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setSelectedProjectForEdit(null);
    }
  };

  const handleDelete = (project: ProjectItem) => {
    setSelectProjectForDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDialogCloseDelete = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) {
      setSelectProjectForDelete(null);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await deleteProjectAction(projectId);
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
      setIsDeleteDialogOpen(false);
      setSelectProjectForDelete(null);
      toast.success(`Project deleted successfully!`);
    } catch (error) {
      console.error("Failed to delete project", error);
      toast.error("Failed to delete project");
    }
  };

  const handleDialogCloseCreate = (open: boolean) => {
    setIsCreateDialogOpen(open);
  };

  const handleProjectCreated = (newProject: ProjectItem) => {
    if (!newProject?.id || !newProject?.title) return;
    setProjects((prev) => {
      // Check if project ID already exists to prevent duplicates
      if (prev.some((project) => project.id === newProject.id)) {
        return prev; // Skip adding if duplicate ID exists
      }
      return [newProject, ...prev];
    });
    setIsCreateDialogOpen(false);
  };

  const handleProjectUpdated = (updatedProject: ProjectItem) => {
    setProjects((prev) => {
      // Ensure no duplicate IDs are introduced
      const existingIds = new Set(prev.map((project) => project.id));
      if (existingIds.has(updatedProject.id)) {
        return prev.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        );
      }
      return [...prev, updatedProject];
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  return (
    <>
      <div className="mb-6 flex flex-col justify-between items-center">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl">Projects</h1>
            <p className="text-slate-400 mt-2">
              Manage your API testing projects
            </p>
          </div>
          <ProjectForm
            mode="create"
            isOpen={isCreateDialogOpen}
            onOpenChange={handleDialogCloseCreate}
            onProjectCreated={handleProjectCreated}
          />
        </div>
        <SearchForm className="mt-10" onSearch={handleSearchChange} />
      </div>

      {isInitialLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
        </div>
      ) : filteredProjects.length === 0 && !isLoading ? (
        <div className="text-center text-slate-500 mt-10 justify-center">
          <p className="text-lg font-medium">No projects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.map((project) => (
            <Link
              href={`/project/${project.id}`}
              key={project.id}
              className="block hover:shadow-lg transition-shadow duration-200 rounded-lg"
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Image
                      src="/folderIcon.png"
                      alt="folder-icon"
                      width={50}
                      height={50}
                    />
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger>
                          <MoreHorizontal className="hover:bg-slate-400/10 rounded-md cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              handleShare(project);
                            }}
                            className="cursor-pointer"
                          >
                            <ShareIcon className="mr-2 h-4 w-4" />
                            <span>Share</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              handleEditClick(project);
                            }}
                            className="cursor-pointer"
                          >
                            <EditIcon className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              handleDelete(project);
                            }}
                            className="cursor-pointer"
                          >
                            <Trash2Icon className="mr-2 h-4 w-4 text-red-500" />
                            <span className="text-red-500">Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardTitle className="mt-4">
                    <h1 className="text-lg">{project.title}</h1>
                  </CardTitle>
                </CardHeader>
                <div>
                  <CardContent>
                    <p className="text-clip line-clamp-2 h-12">
                      {project.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2">
                      <CalendarPlus className="text-slate-400 size-4" />
                      <p className="text-sm text-slate-400">
                        {project.creationDate || "N/A"}
                      </p>
                    </div>
                    <Image
                      src={userProfile?.profileImage || "/profile.png"}
                      alt="user profile"
                      width={35}
                      height={35}
                      className="rounded-full"
                    />
                  </CardFooter>
                </div>
              </Card>
            </Link>
          ))}
          {isLoading &&
            Array(3)
              .fill(0)
              .map((_, index) => <ProjectCardSkeleton key={index} />)}
        </div>
      )}

      {hasNext && !isLoading && (
        <div ref={loadMoreRef} className="h-10 w-full"></div>
      )}

      {selectedProjectForEdit && (
        <ProjectForm
          mode="edit"
          initialData={selectedProjectForEdit}
          isOpen={isEditDialogOpen}
          onOpenChange={handleDialogClose}
          onProjectUpdated={handleProjectUpdated}
        />
      )}

      <DeleteProject
        open={isDeleteDialogOpen}
        onOpenChange={handleDialogCloseDelete}
        project={selectedProjectForDelete}
        onDeleteConfirm={(projectId) => deleteProject(projectId)}
      />

      {selectedProjectForShare && (
        <ShareProject
          open={isShareProjectOpen}
          onOpenChange={handleDialogCloseShare}
          project={selectedProjectForShare}
        />
      )}
    </>
  );
};

export default ProjectLists;
