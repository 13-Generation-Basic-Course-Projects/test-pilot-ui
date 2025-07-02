"use client";

import { NavbarComponent } from "@/components/navbar";
import ProjectVariable from "@/components/project-variable";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense } from "react";

interface CustomSession {
  accessToken?: string;
  user?: {
    accessToken?: string;
  };
}

export default function ProjectVariablesClient() {
  const { projectId } = useParams();
  const { data: session, status } = useSession();

  const token =
    (session as CustomSession)?.accessToken ||
    (session as CustomSession)?.user?.accessToken;

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!projectId || typeof projectId !== "string") {
    return <div className="p-8 text-red-500">Invalid project ID</div>;
  }

  if (!token) {
    return (
      <div className="p-8 text-yellow-600">
        Please sign in to access project variables
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto p-6">
        <Suspense fallback={<div>Loading variables...</div>}>
          <ProjectVariable projectId={projectId} token={token} />
        </Suspense>
      </div>
    </div>
  );
}
