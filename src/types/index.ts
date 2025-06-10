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
	name?: string;
	description?: string; // optional field
	url?: string; // optional field
	status?: number; // optional field
	statusText?: string; // optional field
	requestId?: string; // optional field
}

export interface CollectionItem {
	id: string;
	title: string;
	description?: string;
	endpoints: Endpoint[];
}

export interface Project {
	id: string;
	iconType?: string;
	title?: string;
	description?: string;
	creationDate?: string;
	userAvatarUrl?: string;
	name?: string;
	collections: CollectionItem[];
}

export interface ProjectItem {
	id: string;
	title: string;
	description: string;
	creationDate: string;
	userAvatarUrl: string;
	defaultRequestUrl?: string; // <-- ADD THIS NEW OPTIONAL FIELD
}

export interface ProjectProps {
	projects: ProjectItem[];
}

export interface ProjectFormProps {
	mode: "create" | "edit";
	initialData?: ProjectItem;
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	onProjectCreated?: (newProject: ProjectItem) => void;
	onProjectUpdated?: (updatedProject: ProjectItem) => void;
}

export type NewProjectPayload = Omit<ProjectItem, "id" | "creationDate">;
