"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { verifyToken } from "@/service/share-link-service";
import { getAllProjectService } from "@/service/project-service";
import { getRequestByCollectionId } from "@/service/request-service";

export default function VerifyForm() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const originalUrl = searchParams.get("originalUrl");

  const projectId = searchParams.get("projectId");
  const collectionId = searchParams.get("collectionId");
  const requestId = searchParams.get("requestId");

  const isEndpoint = !!projectId && !!collectionId && !!requestId;
  const isProject = !!projectId && !collectionId && !requestId;

  const handleVerify = async () => {
    setIsVerifying(true);
    setError(null);

    const fallbackUrl = originalUrl || (isEndpoint
      ? `/project/${projectId}/collection/${collectionId}/request/${requestId}`
      : `/project/${projectId}`);

    if (!token || !projectId) {
      setError("Missing token or projectId");
      setIsVerifying(false);
      return;
    }

    try {
      const res = await verifyToken(token);
      console.log(" Token verified:", res);

      // Fetch project
      const projects = await getAllProjectService();
      const currentProject = projects.find((p) => p.id === projectId);
      console.log(" Project:", currentProject);

      if (isEndpoint && collectionId) {
        const endpoints = await getRequestByCollectionId({ collectionId });
        const matchedRequest = endpoints.find((r) => r.id === requestId);
        console.log("Endpoint:", matchedRequest);
      }

      // Redirect to target page
      window.location.href = fallbackUrl;
    } catch (err) {
      console.error(" Verification failed:", err);
      window.location.href = fallbackUrl;
    } finally {
      setIsVerifying(false);
    }
  };

  const displayType = isEndpoint ? "Endpoint" : "Project";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Verify Shared {displayType}</CardTitle>
          <CardDescription>
            {error
              ? error
              : token
              ? `Verify the link to view the shared ${displayType.toLowerCase()}.`
              : "No token provided."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            disabled={isVerifying || !token}
            className="w-full h-12 text-lg cursor-pointer"
            onClick={handleVerify}
          >
            {isVerifying ? "Verifying..." : `Verify ${displayType}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
