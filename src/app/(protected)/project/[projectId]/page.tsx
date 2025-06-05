import { CollectionSidebar } from "@/components/app-sidebar-collection";
import { SidebarCollectionProvider } from "@/components/ui/sidebar-collection";
import { ProjectDetailPageProps } from "@/types";
import React from "react";


export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;

  return (
    <SidebarCollectionProvider>
      <CollectionSidebar projectId={projectId} />
    </SidebarCollectionProvider>
  );
}