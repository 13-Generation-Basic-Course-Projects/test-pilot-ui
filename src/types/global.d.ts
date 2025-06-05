export {};

declare global {
	interface APIResponse<T> {
		payload: T;
		message: string;
		status: string;
		payload: T;
		success: boolean,
		timestamps : string
	}
}
