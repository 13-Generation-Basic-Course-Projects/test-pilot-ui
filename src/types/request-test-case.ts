import { Application_Context } from "./request-type";

export type DataTypeType = {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
};

export type TestCaseType = {
	createdAt: string | null;
	dataType: DataTypeType;
	dataTypeId: string;
	id: string;
	name: string;
	predefined: boolean;
	projectId: string | null;
	updatedAt: string | null;
	value: string;
};

export type RequestDetailType = {
	id: string;
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"; // Or a more general string if other methods are possible
	name: string;
	updatedAt: string;
	url: string;
	body: any;
	headers: any;
	description: any;
	queryParams: any;
	pathVariables: any;
};

export type RequestInfoType = {
	collectionId: string;
	createdAt: string;
	details: RequestDetailType;
	requestId: string;
	testCase: TestCaseType;
	testCaseId: string;
	updatedAt: string;
};

type PayloadItem = {
	applicationContext: Application_Context; // Or a more general string if other values are possible
	createdAt: string;
	expectedSuccess: boolean;
	id: string;
	request: RequestInfoType;
	requestId: string;
	testCase: TestCaseType;
	testCaseId: string;
	updateAt: string;
};

export type PayloadTestCaseType = Array<
	| PayloadItem
	| {
			id: string;
			requestId: string;
			testCaseId: string;
			applicationContext: string;
			request: RequestDetailType;
			testCase: TestCaseType;
			createdAt: string;
	  }
>;
