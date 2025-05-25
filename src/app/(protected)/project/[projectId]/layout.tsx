import { NavbarComponent } from "@/components/navbar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const ProjectDetailLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<div className="flex min-h-screen w-full">
				<AppSidebar />
				<main className="flex flex-col flex-auto">
					<NavbarComponent />
					{children}
				</main>
			</div>
		</SidebarProvider>
	);
};

export default ProjectDetailLayout;
