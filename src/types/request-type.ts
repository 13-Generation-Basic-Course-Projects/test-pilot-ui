import { EndpointItem } from "@/types";

export interface RequestResponseTypes {
	requestId: string;
	name: any;
	details: any;
	method: any;
	map(
		arg0: (request: any) => { id: any; name: any; method: any; path: any }
	): EndpointItem[] | PromiseLike<EndpointItem[]>;
	payload: {
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
