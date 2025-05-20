import React from "react";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
	return <div className="min-h-screen">{children}</div>;
};

export default ProtectedLayout;
