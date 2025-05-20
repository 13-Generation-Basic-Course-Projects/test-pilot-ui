import { usePathname } from "next/navigation";

interface ProjectSubpathState {
	/**  Example: for "/project/123/settings", this would be ["123", "settings"]. */
	subpathSegments: string[];
	/** True if there are one or more segments after "/project/". False for "/project" itself or paths not starting with "/project". */
	hasSubpathSegments: boolean;
	/** True if the current path is exactly "/project" (no segments after it). */
	isProjectRoot: boolean;
	/** True if the current path starts with "/project", including "/project" itself and any subpaths. */
	isWithinProject: boolean;
}

export function useProjectPath(): ProjectSubpathState {
	const pathname = usePathname();

	let subpathSegments: string[] = [];
	let isWithinProject = false;
	let isProjectRoot = false;

	if (pathname) {
		const segments = pathname.split("/").filter(Boolean);
		const projectSegmentIndex = segments.indexOf("project");

		if (projectSegmentIndex !== -1) {
			isWithinProject = true;
			subpathSegments = segments.slice(projectSegmentIndex + 1);

			if (subpathSegments.length === 0) {
				isProjectRoot = true;
			}
		}
	}

	const hasSubpathSegments = subpathSegments.length > 0;

	return {
		subpathSegments,
		hasSubpathSegments,
		isProjectRoot,
		isWithinProject,
	};
}
