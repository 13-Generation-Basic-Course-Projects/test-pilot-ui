import { NavbarComponent } from "@/components/navbar";
import React from "react";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<NavbarComponent />
			{children}
		</div>
	);
};

export default ProtectedLayout;
