export {};

declare global {
	interface APIResponse<T> {
    name: string;
    requestName: string;
    requestId: string;
		payload: T;
		message: string;
		status: string;
		payload: T;
		success: boolean,
		timestamps : string
	}
}
