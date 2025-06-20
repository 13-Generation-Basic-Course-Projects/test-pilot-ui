import { EndpointItem } from "@/types";

export interface RequestResponseTypes {
	id: string;
	name: any;
	details: any;
	method: any;
	map(
		arg0: (request: any) => { id: any; name: any; method: any; path: any }
	): EndpointItem[] | PromiseLike<EndpointItem[]>;
	payload: {
		method: string;
		name: string;
		requestId: any;
		payload: EndpointItem[];
	};
}
export interface VariableTestCase {
	id: string; // The unique ID of THIS test instance
	predefinedTestCaseId: string; // The ID of the template case (e.g., "Invalid Email")
	predefinedTestCaseName: string; // The name to display (e.g., "Invalid Email")
}

// Update ParamRow to use the new interface
export interface ParamRow {
	key: string;
	value: string;
	cases: VariableTestCase[]; // Now an array of objects, not strings
}

export enum Application_Context {
	PATH_VARIABLE = "PATH_VARIABLE",
	BODY_FIELD = "BODY_FIELD",
	QUERY_PARAM = "QUERY_PARAM",
}

export type TestCaseRequestType = {
	requestId: string;
	testCaseId: string;
	applicationContext: Application_Context;
	targetFieldPath: string;
	isExpectedSuccess: boolean;
};

export type TestCaseRequestResponseType = {
	id: string;
	requestId: string;
	testCaseId: string;
	applicationContext: Application_Context;
	createdAt: string;
	updatedAt: string;
	request: {
		id: string;
		name: string;
		collectionId: string;
		method: string;
		details: {
			url: string;
			body: any;
			headers: any;
			description: any;
			queryParams: any;
			pathVariables: any;
		};
		createdAt: string;
		updatedAt: string;
	};
	testCase: {
		id: string;
		projectId: string;
		dataTypeId: string;
		name: string;
		value: any;
		createdAt: string;
		updatedAt: string;
		dataType: {
			id: string;
			name: string;
			createdAt: string;
			updatedAt: string;
		};
		predefined: boolean;
	};
	expectedSuccess: boolean;
};
