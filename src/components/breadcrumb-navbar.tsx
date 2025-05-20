import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";

const BreadcrumbNavbar = ({ params }: { params: string[] }) => {
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
							{params.length > 1 ? params[1] : params[0]}
						</h1>
					</BreadcrumbLink>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default BreadcrumbNavbar;
