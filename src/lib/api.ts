import headerToken from "./header";

export async function fetchAPI<T>(
	url: string,
	options: RequestInit & { next?: { tags?: string[]; revalidate?: number } } = {}
): Promise<APIResponse<T>> {
	const headers = await headerToken();
	try {
		const response = await fetch(url, {
			...options,
			headers,
			...(options.next && { next: options.next }),
		});

		const text = await response.text();
		if (!text.trim()) {
			return { message: "", status: "OK", payload: [], success : false, timestamps: "" } as APIResponse<T>;
		}
		const data: APIResponse<T> = JSON.parse(text);
		return data;
	} catch (error) {
		console.error("API Fetch Error:", error);
		throw error;
	}
}
