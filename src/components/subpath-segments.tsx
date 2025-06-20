"use client";
import { useProjectPath } from "@/hooks/use-project-path";
import React from "react";
import BreadcrumbNavbar from "./breadcrumb-navbar";
import Logo from "./icons/logo";
import Link from "next/link";

export const SubpathSegments = () => {
	const { subpathSegments, hasSubpathSegments } = useProjectPath();

	return (
		<div>
			{" "}
			{hasSubpathSegments ? (
				<BreadcrumbNavbar params={subpathSegments} />
			) : (
				<Logo />
			)}
		</div>
	);
};
