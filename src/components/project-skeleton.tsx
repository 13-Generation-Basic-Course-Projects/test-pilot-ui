import React from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

const ProjectCardSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 bg-gray-200 rounded" />
          <div className="w-6 h-6 bg-gray-200 rounded" />
        </div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mt-4" />
      </CardHeader>
      <CardContent>
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
      </CardFooter>
    </Card>
  );
};

export default ProjectCardSkeleton;
