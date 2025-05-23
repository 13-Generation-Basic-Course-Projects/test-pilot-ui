export type ProjectItem = {
	id: string;
	iconType: string;
	title: string;
	description: string;
	creationDate: string;
	userAvatarUrl: string;
};

export type ProjectProps = {
	projects: ProjectItem[];
};

export type ProjectFormProps = {
	initialData?: ProjectItem;
	mode: "create" | "edit";
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
};

export interface Endpoint {
	id: string;
	method: string;
	path: string;
}

export interface CollectionItem {
	id: string;
	title: string;
	endpoints: Endpoint[];
}
