"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  EditIcon,
  FileOutput,
  FilePlus2Icon,
  FilePlusIcon,
  Folder,
  FolderDownIcon,
  FolderOpenIcon,
  Share2Icon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CollectionForm } from "./collection/collection-form";
import { ItemActionsDropdown } from "./dropdown-more-menu";
import { ExportEndpoint } from "./export/export-endpoint";
import { ExportCollection } from "./export/export-collection";
import { ShareCollection } from "./share/share-collection";
import { ShareEndpoint } from "./share/share-endpoint";
import { ImportCollection } from "./import/import-collection";
import { DeleteCollection } from "./delete/delete-collection";
import { DeleteEndpoint } from "./delete/delete-endpoint";
import {
  fetchRequestForCollection,
  deleteRequestAction,
  updateRequestByIdAction,
  createRequestByCollectionIdAction,
  duplicateRequestAction,
} from "@/action/request-action";
import { CollectionItem, Endpoint, EndpointItem } from "@/types";
import { toast } from "sonner";
import { getMethodColor } from "@/lib/utils";
import {
  createCollectionAction,
  duplicateCollectionAction,
  fetchCollectionsForProject,
  renameCollectionAction,
} from "@/action/collection-action";
import { deleteCollectionAction } from "@/action/collection-action";
import { CollectionSidebarSkeleton } from "./collection-sidebar-skeleton";
import { ExportAllCollections } from "./export/export-all-collections";

interface Project {
  id: string;
  collections: CollectionItem[];
}

export const CollectionSidebar = ({ projectId }: { projectId: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCollectionSidebarOpen, setIsCollectionSidebarOpen] = useState(true);
  const [openCollections, setOpenCollections] = useState<Record<
    string,
    boolean
  > | null>(null);
  const [renamingCollectionId, setRenamingCollectionId] = useState<
    string | null
  >(null);
  const [collectionsData, setCollectionsData] = useState<Project[]>([]);
  const [renamingEndpointId, setRenamingEndpointId] = useState<string | null>(
    null
  );
  const [isExportRequestOpen, setIsExportRequestOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
    null
  );
  const [isExportCollectionOpen, setIsExportCollectionOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionItem | null>(null);
  const [isImportCollectionOpen, setIsImportCollectionOpen] = useState(false);
  const [isShareCollectionOpen, setIsShareCollectionOpen] = useState(false);
  const [isShareEndpointOpen, setIsShareEndpointOpen] = useState(false);
  const [openEndpoint, setOpenEndpoint] = useState<Record<string, boolean>>({});
  const [endpointToDelete, setEndpointToDelete] = useState<{
    projectId: string;
    collectionId: string;
    endpointId: string;
  } | null>(null);

  // Added new state for exporting all collections
  const [isExportAllOpen, setIsExportAllOpen] = useState(false); // New state for all collections export

  // Updated useEffect for fetchRequests to handle async properly
  useEffect(() => {
    const fetchRequests = async () => {
      if (!collectionsData.length) return;

      const getProjects = await Promise.all(
        collectionsData.map(async (project) => {
          const getCollections = await Promise.all(
            project.collections.map(async (collection) => {
              const endpoints = await fetchRequestForCollection(collection.id);
              return {
                ...collection,
                endpoints: endpoints.map((endpoint) => ({
                  id: endpoint.id,
                  method: endpoint.method || "GET",
                  path: endpoint.name || endpoint.path || "/new-request",
                  name: endpoint.name || endpoint.path || "/new-request",
                })),
              };
            })
          );
          return {
            ...project,
            collections: getCollections,
          };
        })
      );

      setCollectionsData(getProjects);
    };

    fetchRequests();
  }, [collectionsData.length]);
  const [collectionToDelete, setCollectionToDelete] = useState<{
    projectId: string;
    collectionId: string;
  } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const collections = await fetchCollectionsForProject(projectId);
        setCollectionsData([
          {
            id: projectId,
            collections: collections.map((col) => ({
              ...col,
              endpoints: [],
            })),
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
        toast.error("Could not load collections.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollections();
  }, [projectId]);

  // Fetch requests (endpoints) for each collection
  useEffect(() => {
    const fetchRequests = async () => {
      if (!collectionsData.length) return;

      const getProjects = await Promise.all(
        collectionsData.map(async (project) => {
          const getCollections = await Promise.all(
            project.collections.map(async (collection) => {
              const endpoints = await fetchRequestForCollection(collection.id);
              return {
                ...collection,
                endpoints: endpoints.map((endpoint) => ({
                  id: endpoint.id,
                  method: endpoint.method || "GET",
                  path: endpoint.name || endpoint.path || "/new-request",
                  name: endpoint.name || endpoint.path || "/new-request",
                })),
              };
            })
          );
          return {
            ...project,
            collections: getCollections,
          };
        })
      );

      setCollectionsData(getProjects);
    };

    fetchRequests();
  }, [collectionsData.length]);

  // Load openCollections from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("openCollections");
    setOpenCollections(saved ? JSON.parse(saved) : {});
  }, []);

  // Save openCollections to localStorage
  useEffect(() => {
    if (openCollections !== null) {
      localStorage.setItem("openCollections", JSON.stringify(openCollections));
    }
  }, [openCollections]);

  // Load openEndpoint from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("openEndpoint");
    setOpenEndpoint(saved ? JSON.parse(saved) : {});
  }, []);

  // Save openEndpoint to localStorage
  useEffect(() => {
    localStorage.setItem("openEndpoint", JSON.stringify(openEndpoint));
  }, [openEndpoint]);

  // Add endpoint
  const handleAddEndpoint = async (projectId: string, collectionId: string) => {
    try {
      const requestName = "New Request";
      const details = {
        url: "",
        pathVariables: {},
        queryParams: {},
        headers: {},
        body: null,
        description: "",
      };

      if (!requestName.trim()) {
        throw new Error("Request name cannot be blank");
      }

      const newEndpoint = await createRequestByCollectionIdAction({
        collectionId,
        requestName,
        method: "GET",
        details,
      });

      if (!newEndpoint) {
        throw new Error("Failed to create endpoint");
      }

      setCollectionsData((prev) =>
        prev.map((project) => {
          if (project.id !== projectId) return project;
          return {
            ...project,
            collections: project.collections.map((collection) =>
              collection.id === collectionId
                ? {
                    ...collection,
                    endpoints: [
                      ...collection.endpoints,
                      {
                        id: newEndpoint.id,
                        method: "GET",
                        path: newEndpoint.name || requestName,
                        name: newEndpoint.name || requestName,
                        collectionId,
                        projectId,
                      },
                    ],
                  }
                : collection
            ),
          };
        })
      );

      toast.success("Endpoint created successfully");
    } catch (error: any) {
      console.error("Failed to add endpoint:", error);
      toast.error(
        `Failed to add endpoint: ${error.message || "Unknown error"}`
      );
    }
  };

  // Load openCollections from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("openCollections");
    setOpenCollections(saved ? JSON.parse(saved) : {});
  }, []);

  // Save openCollections to localStorage
  useEffect(() => {
    if (openCollections !== null) {
      localStorage.setItem("openCollections", JSON.stringify(openCollections));
    }
  }, [openCollections]);

  // Load openEndpoint from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("openEndpoint");
    setOpenEndpoint(saved ? JSON.parse(saved) : {});
  }, []);

  // Save openEndpoint to localStorage
  useEffect(() => {
    localStorage.setItem("openEndpoint", JSON.stringify(openEndpoint));
  }, [openEndpoint]);

  const handleCreateCollection = async (title: string) => {
    const MIN_NAME_LENGTH = 3;
    const namePattern = /^[a-zA-Z0-9 _-]+$/;
    // Frontend validation
    if (title.length < MIN_NAME_LENGTH) {
      toast.error("Collection name must be at least 3 characters.");
      return;
    }
    if (!namePattern.test(title)) {
      toast.error("Collection name contains invalid characters.");
      return;
    }
    try {
      const res: any = await createCollectionAction(title, projectId);
      if (res?.errors?.name) {
        toast.error(res.errors.name);
        return;
      }
      const newCollection: CollectionItem = {
        id: res.id as any,
        title,
        endpoints: [],
      };
      setCollectionsData((prev) => {
        const lastProjectIndex = prev.length - 1;
        return prev.map((project, index) => {
          if (index === lastProjectIndex) {
            return {
              ...project,
              collections: [...project.collections, newCollection],
            };
          }
          return project;
        });
      });
      toast.success("Collection created successfully");
    } catch (error: any) {
      // console.error("Failed to create collection:", error);
      toast.error(
        error?.message || "Something went wrong while creating collection."
      );
    }
  };

  // Rename collection
  const handleRename = (
    projectId: string,
    collectionId: string,
    newTitle: string
  ) => {
    setCollectionsData((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          collections: project.collections.map((collection) =>
            collection.id === collectionId
              ? { ...collection, title: newTitle }
              : collection
          ),
        };
      })
    );
    toast.success("Collection renamed successfully");
  };

  // Duplicate collection
  const handleDuplicateCollection = async (
    projectId: string,
    collection: CollectionItem
  ) => {
    const project = collectionsData.find((p) => p.id === projectId);
    if (!project) return;
    const existingCollections = project.collections;
    const duplicated = await duplicateCollectionAction(
      collection,
      projectId,
      existingCollections
    );

    if (!duplicated) return;

    setCollectionsData((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) return project;

        return {
          ...project,
          collections: [...project.collections, duplicated],
        };
      })
    );
    toast.success("Collection duplicated successfully");
  };

  // Rename endpoint
  const handleRenameEndpoint = async (
    projectId: string,
    collectionId: string,
    endpointId: string,
    newTitle: string
  ) => {
    try {
      await updateRequestByIdAction(collectionId, endpointId, {
        name: newTitle,
      });
      setCollectionsData((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? {
                ...project,
                collections: project.collections.map((collection) =>
                  collection.id === collectionId
                    ? {
                        ...collection,
                        endpoints: collection.endpoints.map((endpoint) =>
                          endpoint.id === endpointId
                            ? { ...endpoint, path: newTitle, name: newTitle }
                            : endpoint
                        ),
                      }
                    : collection
                ),
              }
            : project
        )
      );
      toast.success("Endpoint renamed successfully");
    } catch (error: any) {
      console.error("Failed to rename endpoint:", error);
      toast.error(
        `Failed to rename endpoint: ${error.message || "Unknown error"}`
      );
    }
  };

  // Duplicate endpoint
  const handleDuplicateEndpoint = async (
    projectId: string,
    collectionId: string,
    endpointId: string
  ) => {
    try {
      const newEndpoint = await duplicateRequestAction(
        collectionId,
        endpointId
      );

      if (!newEndpoint) {
        throw new Error("Failed to duplicate endpoint");
      }

      setCollectionsData((prev) =>
        prev.map((project) => {
          if (project.id !== projectId) return project;
          return {
            ...project,
            collections: project.collections.map((collection) => {
              if (collection.id !== collectionId) return collection;

              return {
                ...collection,
                endpoints: [
                  ...collection.endpoints,
                  {
                    id: newEndpoint.id,
                    method: newEndpoint.method || "GET",
                    path: newEndpoint.name || "New Request (Copy)",
                    name: newEndpoint.name || "New Request (Copy)",
                    collectionId,
                    projectId,
                  },
                ],
              };
            }),
          };
        })
      );

      toast.success("Endpoint duplicated successfully");
    } catch (error: any) {
      console.error("Failed to duplicate endpoint:", error);
      toast.error(
        `Failed to duplicate endpoint: ${error.message || "Unknown error"}`
      );
    }
  };

  // Import collection
  const handleImportCollection = async (data: any) => {
    try {
      if (!data.title || !Array.isArray(data.endpoints)) {
        toast.error("Invalid collection format. Expected 'title' and 'endpoints' array.");
        return;
      }

      // Create a new collection
      const newCollection = await createCollectionAction(data.title, projectId);
      if (!newCollection) {
        throw new Error("Failed to create collection");
      }

      // Create endpoints for the collection
      const createdEndpoints = await Promise.all(
        data.endpoints.map(async (endpoint: any) => {
          const requestName = endpoint.name || endpoint.path || "New Request";
          const details = {
            url: endpoint.url || "",
            pathVariables: endpoint.pathVariables || {},
            queryParams: endpoint.queryParams || {},
            headers: endpoint.headers || {},
            body: endpoint.body || null,
            description: endpoint.description || "",
          };

          return {
            id: endpoint.id,
            method: endpoint.method || "GET",
            path: requestName,
            name: requestName,
            collectionId: newCollection.id,
            projectId,
          } as EndpointItem ;
        })
      );

      // Update local state with the new collection and endpoints
      setCollectionsData((prev) =>
        prev.map((project) => {
          if (project.id !== projectId) return project;
          return {
            ...project,
            collections: [
              ...project.collections,
              {
                id: newCollection.id,
                title: data.title,
                endpoints: createdEndpoints,
              },
            ],
          };
        })
      );

      toast.success("Collection and endpoints imported successfully");
    } catch (error: any) {
      console.error("Failed to import collection:", error);
      toast.error(`Failed to import collection: ${error.message || "Unknown error"}`);
    }
  };

  const toggleCollection = (collectionId: string) => {
    setOpenCollections((prev) => ({
      ...prev,
      [collectionId]: !prev?.[collectionId],
    }));
  };

  const getCollectionMenuItems = (
    collection: CollectionItem,
    projectId: string
  ) => [
    {
      icon: <FilePlusIcon className="w-4 h-4" />,
      label: "Add Request",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        handleAddEndpoint(projectId, collection.id);
      },
      className: "cursor-pointer",
    },
    { isSeparator: true as const },
    {
      icon: <Share2Icon className="w-4 h-4" />,
      label: "Share",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedCollection(collection);
        setIsShareCollectionOpen(true);
        toast.success("Collection shared successfully");
      },
      className: "cursor-pointer",
    },
    { isSeparator: true as const },
    {
      icon: <EditIcon className="w-4 h-4" />,
      label: "Rename",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        setRenamingCollectionId(collection.id);
      },
      className: "cursor-pointer",
    },
    {
      icon: <FilePlus2Icon className="w-4 h-4" />,
      label: "Duplicate",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        handleDuplicateCollection(projectId, collection);
      },
    },
    {
      icon: <FileOutput className="w-4 h-4" />,
      label: "Export",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedCollection(collection);
        setIsExportCollectionOpen(true);
      },
      className: "cursor-pointer",
    },
    {
      icon: (
        <TrashIcon className="w-4 h-4 hover:!text-red-600 hover:!bg-red-50" />
      ),
      label: "Delete",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        setTimeout(
          () =>
            setCollectionToDelete({ projectId, collectionId: collection.id }),
          0
        );
      },
      className:
        "text-red-600 hover:!text-red-600 hover:!bg-red-50 cursor-pointer",
    },
  ];

  const getEndpointMenuItems = (
    endpoint: Endpoint,
    collectionId: string,
    projectId: string
  ) => [
    {
      icon: <Share2Icon className="w-4 h-4" />,
      label: "Share",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedEndpoint(endpoint);
        setIsShareEndpointOpen(true);
      },
      className: "cursor-pointer",
    },
    { isSeparator: true as const },
    {
      icon: <EditIcon className="w-4 h-4" />,
      label: "Rename",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        setRenamingEndpointId(endpoint.id);
      },
      className: "cursor-pointer",
    },
    {
      icon: <FilePlus2Icon className="w-4 h-4" />,
      label: "Duplicate",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenEndpoint((prev) => ({ ...prev, [endpoint.id]: false }));
        handleDuplicateEndpoint(projectId, collectionId, endpoint.id);
      },
      className: "cursor-pointer",
    },
    {
      icon: <FileOutput className="w-4 h-4" />,
      label: "Export",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedEndpoint(endpoint);
        setIsExportRequestOpen(true);
      },
      className: "cursor-pointer",
    },
    {
      icon: (
        <TrashIcon className="w-4 h-4 hover:!text-red-600 hover:!bg-red-50" />
      ),
      label: "Delete",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        setTimeout(
          () =>
            setEndpointToDelete({
              projectId,
              collectionId,
              endpointId: endpoint.id,
            }),
          0
        );
      },
      className:
        "text-red-600 hover:!text-red-600 hover:!bg-red-50 cursor-pointer",
    },
  ];

  if (openCollections === null) return <CollectionSidebarSkeleton />;

  if (isLoading) {
    return <CollectionSidebarSkeleton />;
  }

  if (!isCollectionSidebarOpen) {
    return (
      <div className="border-r bg-background h-full p-2 duration-75">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCollectionSidebarOpen(true)}
          className="w-full"
        >
          <Folder className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="w-80 border-r bg-background duration-75">
        {/* Header */}
        {!isLoading && collectionsData[0]?.collections.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No collections yet. <br /> Create one to get started!
          </div>
        )}
        <div className="flex items-center justify-between p-4 border-b">
          <CollectionForm onCollectionCreate={handleCreateCollection} />
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                >
                  <FolderDownIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => setIsImportCollectionOpen(true)}
                  className="cursor-pointer"
                >
                  Import
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsExportAllOpen(true)} // Trigger Export All
                  className="cursor-pointer"
                >
                  Export All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsCollectionSidebarOpen(false)}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Collections */}
        <div className="flex-1 custom-scrollbar h-screen">
          {collectionsData.map((project) =>
            project.collections.map((collection) => (
              <div key={`${project.id}-${collection.id}`}>
                <div
                  className="group flex items-center justify-between px-4 py-3 mb-2 hover:bg-muted/50 cursor-pointer"
                  onClick={(e) => {
                    toggleCollection(collection.id);
                    e.stopPropagation();
                  }}
                >
                  <div className="flex items-center gap-3 max-w-full">
                    {openCollections[collection.id] ? (
                      <FolderOpenIcon className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Folder className="w-4 h-4 text-muted-foreground" />
                    )}
                    {renamingCollectionId === collection.id ? (
                      <Input
                        autoFocus
                        defaultValue={collection.title}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={async (e) => {
                          const newTitle = e.target.value.trim();
                          if (!newTitle || newTitle === collection.title) {
                            setRenamingCollectionId(null);
                            return;
                          }
                          handleRename(project.id, collection.id, newTitle);
                          try {
                            await renameCollectionAction(
                              project.id,
                              collection.id,
                              newTitle
                            );
                          } catch (error) {
                            console.error("Failed to rename collection:", error);
                            toast.error("Failed to rename collection");
                          }
                          setRenamingCollectionId(null);
                          e.stopPropagation();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            (e.target as HTMLInputElement).blur();
                          }
                          if (e.key === "Escape") {
                            setRenamingCollectionId(null);
                          }
                          e.stopPropagation();
                        }}
                        className="h-6 px-2 py-1 font-medium max-w-[200px] truncate overflow-hidden text-ellipsis"
                      />
                    ) : (
                      <span className="font-medium max-w-[220px] truncate overflow-hidden text-ellipsis">
                        {collection.title}
                      </span>
                    )}
                  </div>
                  <ItemActionsDropdown
                    items={getCollectionMenuItems(collection, project.id)}
                  />
                </div>

                {/* Endpoints */}
                {openCollections[collection.id] && (
                  <div className="pb-2">
                    {collection.endpoints.map((endpoint, index) => {
                      const endpointPath = `/project/${projectId}/collection/${collection.id}/request/${endpoint.id}`;
                      const isActive = pathname === endpointPath;
                      const timestamp = Date.now();
                      const uniqueKey = endpoint.id
                        ? `${collection.id}-${endpoint.id}`
                        : `${collection.id}-temp-${timestamp}-${index}`;
                      return (
                        <div
                          key={uniqueKey}
                          className={`group mx-4 mb-1 rounded-md ${
                            isActive ? "bg-muted" : "hover:bg-muted/50"
                          }`}
                        >
                          <Link
                            href={endpointPath}
                            className="flex items-center justify-between gap-2 p-2"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-2 flex-grow min-w-0">
                              <Badge
                                variant="outline"
                                className="h-5 px-2 text-xs font-medium shrink-0"
                              >
                                <span
                                  className={getMethodColor(endpoint.method)}
                                >
                                  {endpoint.method}
                                </span>
                              </Badge>
                              {renamingEndpointId === endpoint.id ? (
                                <Input
                                  autoFocus
                                  defaultValue={endpoint.path}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onBlur={async (e) => {
                                    await handleRenameEndpoint(
                                      project.id,
                                      collection.id,
                                      endpoint.id,
                                      e.target.value
                                    );
                                    setRenamingEndpointId(null);
                                    e.stopPropagation();
                                  }}
                                  onKeyDown={async (e) => {
                                    if (e.key === "Enter") {
                                      await handleRenameEndpoint(
                                        project.id,
                                        collection.id,
                                        endpoint.id,
                                        (e.target as HTMLInputElement).value
                                      );
                                      setRenamingEndpointId(null);
                                      e.stopPropagation();
                                    }
                                    if (e.key === "Escape") {
                                      setRenamingEndpointId(null);
                                      e.stopPropagation();
                                    }
                                  }}
                                  className="h-6"
                                />
                              ) : (
                                <span className="text-sm text-muted-foreground truncate">
                                  {endpoint.path}
                                </span>
                              )}
                            </div>
                            <ItemActionsDropdown
                              items={getEndpointMenuItems(
                                endpoint,
                                collection.id,
                                project.id
                              )}
                              onOpenChange={(open) => {
                                setOpenEndpoint((prev) => ({
                                  ...prev,
                                  [endpoint.id]: open,
                                }));
                              }}
                            />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ExportEndpoint
        open={isExportRequestOpen}
        onOpenChange={setIsExportRequestOpen}
        endpoint={selectedEndpoint}
      />
      <ExportCollection
        open={isExportCollectionOpen}
        onOpenChange={setIsExportCollectionOpen}
        collection={selectedCollection}
      />
      <ExportAllCollections
        open={isExportAllOpen}
        onOpenChange={setIsExportAllOpen}
        projectName={"ProjectName"}
        collections={collectionsData[0]?.collections || []}
      />
      <ShareCollection
        open={isShareCollectionOpen}
        onOpenChange={setIsShareCollectionOpen}
        collection={selectedCollection}
      />
      <ShareEndpoint
        open={isShareEndpointOpen}
        onOpenChange={setIsShareEndpointOpen}
        endpoint={selectedEndpoint}
      />
      <ImportCollection
        open={isImportCollectionOpen}
        onOpenChange={setIsImportCollectionOpen}
        onImport={handleImportCollection}
      />
      {collectionToDelete && (
        <DeleteCollection
          open={!!collectionToDelete}
          onOpenChange={(open) => {
            if (!open) setCollectionToDelete(null);
          }}
          onConfirm={async () => {
            const { projectId, collectionId } = collectionToDelete;
            setCollectionsData((prev) =>
              prev.map((project) =>
                project.id === projectId
                  ? {
                      ...project,
                      collections: project.collections.filter(
                        (collection) => collection.id !== collectionId
                      ),
                    }
                  : project
              )
            );
            setOpenCollections((prev) => {
              if (!prev) return prev;
              const updated = { ...prev };
              delete updated[collectionId];
              return updated;
            });
            setCollectionToDelete(null);
            await deleteCollectionAction(collectionId);
            toast.success("Collection deleted successfully");
          }}
        />
      )}
      {endpointToDelete && (
        <DeleteEndpoint
          open={!!endpointToDelete}
          onOpenChange={(open) => {
            if (!open) setEndpointToDelete(null);
          }}
          onConfirm={async () => {
            const { projectId, collectionId, endpointId } = endpointToDelete;
            try {
              await deleteRequestAction(collectionId, endpointId, projectId);
              setCollectionsData((prev) =>
                prev.map((project) =>
                  project.id === projectId
                    ? {
                        ...project,
                        collections: project.collections.map((collection) =>
                          collection.id === collectionId
                            ? {
                                ...collection,
                                endpoints: collection.endpoints.filter(
                                  (endpoint) => endpoint.id !== endpointId
                                ),
                              }
                            : collection
                        ),
                      }
                    : project
                )
              );
              router.push(`/project/${projectId}`);
              toast.success("Endpoint deleted successfully");
            } catch (error: any) {
              console.error("Failed to delete endpoint:", error);
              toast.error(
                `Failed to delete endpoint: ${error.message || "Unknown error"}`
              );
            }
            setEndpointToDelete(null);
          }}
        />
      )}
    </>
  );
};