export type TestStatus = "pending" | "loading" | "passed" | "failed";

export type LogLevel = "INFO" | "WARNING" | "ERROR" | "DEBUG";

export interface LogEntry {
	level: LogLevel;
	message: string;
	source?: string;
}

export interface TestMetadata {
	headers: Record<string, string>;
	body?: any;
	params?: Record<string, any>;
	timestamp: string;
}

export interface TestData {
	id: number;
	testName: string;
	expected: string;
	endpoint: Endpoint;
	metadata: TestMetadata;
	logs: LogEntry[];
}

export interface TestResult extends TestData {
	status: TestStatus;
	duration: string;
	actual: string;
	logsGenerated?: boolean;
}

export interface TestProgress {
	completed: number;
	total: number;
	currentTest: number;
}

export interface Endpoint {
	id: string;
	method: string;
	path: string;
	value?: string; // optional field
	description?: string; // optional field
	url?: string; // optional field
	status?: number; // optional field
	statusText?: string; // optional field
	requestId?: string; // optional field
}

export interface CollectionItem {
	id: string;
	title: string;
	description?: string; // optional field
	endpoints: Endpoint[];
}

export interface Project {
	id: string;
	iconType: string; // e.g., "folder"
	title: string;
	description: string; // required field
	creationDate: string; // e.g., "2023-01-15"
	userAvatarUrl: string; // e.g., "/profile-img.png"
	name: string; // seems redundant with title but included in data
	collections: CollectionItem[];
}

// types.ts
export interface ProjectItem {
	id: string;
	title: string;
	description: string;
	creationDate: string;
	userAvatarUrl: string;
}

export interface ProjectProps {
	projects: ProjectItem[];
}

export interface ProjectFormProps {
	mode: "create" | "edit";
	initialData?: ProjectItem;
	isOpen?: boolean; // Make isOpen optional for the create trigger
	onOpenChange?: (open: boolean) => void; // Make onOpenChange optional for the create trigger
	onProjectCreated?: (newProject: ProjectItem) => void; // New prop for create mode
	onProjectUpdated?: (updatedProject: ProjectItem) => void; // New prop for edit mode
}

export interface User {
  id: string;
  email: string;
  name?: string;
  token?: string;
  avatarUrl?: string;
  role?: string;
}


export type NewProjectPayload = Omit<ProjectItem, "id" | "creationDate">;

export type LoginResponseType = {
	message: string;
	status: string;
	success: boolean;
	timestamps: string;
	payload: {
		token: string;
	};
};

export type RegisterResponseType = {
	message: string;
	status: string;
	success: boolean;
	timestamps: string;
	data: string;
};

export type BackendErrorResponse = {
	type: string;
	title: string;
	status: number;
	detail?: string;
	instance: string;
	timestamp: string;
	errors?: { [key: string]: string };
};
