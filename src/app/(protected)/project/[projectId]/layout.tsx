import { NavbarComponent } from "@/components/navbar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const ProjectDetailLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<div className="flex min-h-screen w-full">
				<AppSidebar />
				<main className="flex flex-col flex-auto">
					<NavbarComponent />
					<div className="p-8">{children}</div>
				</main>
			</div>
		</SidebarProvider>
	);
};

export default ProjectDetailLayout;
