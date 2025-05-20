import { SidebarComponent } from "@/components/sidebar";
import React from "react";

const ProjectDetailLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<SidebarComponent />
			{children}
		</div>
	);
};

export default ProjectDetailLayout;
