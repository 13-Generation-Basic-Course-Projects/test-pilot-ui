"use client"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";
import {getProjectAction} from "@/actions/project-action";
import {useEffect, useState} from "react";
import {ProjectItem} from "@/types";


const BreadcrumbNavbar = ({ params }: { params: string[] }) => {
	const [project, setProject] = useState<ProjectItem[]>([]);

	useEffect(() => {
		const fetchProjects= async ()=>{
			const projects = await getProjectAction();
			setProject(projects);
		}
		fetchProjects();
	}, []);


	if(!project) return null;

	const filterProjects = project.find(project => project.id === params[0])

	console.log(filterProjects);


	return (
		<Breadcrumb>
			<BreadcrumbList className="">
				<BreadcrumbItem>
					<BreadcrumbLink href="/project">
						<HomeIcon size={18} />
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator className="" />
				<BreadcrumbItem>
					<BreadcrumbLink href={params.length > 1 ? params[1] : params[0]}>
						<h1 className="mb-[3px]">
							{filterProjects?.title ? filterProjects?.title : ""}
						</h1>
					</BreadcrumbLink>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default BreadcrumbNavbar;
