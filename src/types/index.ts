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

export type TestStatus = "pending" | "loading" | "passed" | "failed";

export type LogLevel = "INFO" | "WARNING" | "ERROR" | "DEBUG";

export interface LogEntry {
	level: LogLevel;
	message: string;
	source?: string;
}

export interface Endpoint {
	method: string;
	url: string;
	status: number;
	statusText: string;
	requestId: string;
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
