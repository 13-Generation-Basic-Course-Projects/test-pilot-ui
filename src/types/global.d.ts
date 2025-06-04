export {};

declare global {
	interface APIResponse<T> {
		payload: T;
		message: string;
		status: string;
		data: T;
	}
}
