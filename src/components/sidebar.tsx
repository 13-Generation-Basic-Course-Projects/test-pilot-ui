import { cn } from "@/lib/utils";
import React from "react";

export const SidebarComponent = ({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) => {
	return (
		<div className={cn("border-r-2", className)} {...props}>
			Sidebar
		</div>
	);
};
