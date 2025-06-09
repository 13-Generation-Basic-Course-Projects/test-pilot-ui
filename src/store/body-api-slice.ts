import { create } from "zustand";

export interface ApiBodyRow {
	id: string; // The field name, e.g., "username", "email"
	value: any;
	dataType: string;
	testCases: string[];
}

export interface ApiBodyState {
	rawBody: string | null;
	apiBodyRows: ApiBodyRow[];
	setRawBody: (value: string, parsedBody: Record<string, any> | null) => void;
	updateRow: (rowId: string, newValues: Partial<ApiBodyRow>) => void;
	setApiBodyRows: (rows: ApiBodyRow[]) => void;
}

// FIX: A more robust function to guess the data type
const guessDataType = (value: any): string => {
	// 1. Get the actual type from the parsed JSON. This is the most reliable check.
	const type = typeof value;
	if (type === "boolean") return "boolean";
	if (type === "number") return "number";

	// 2. If it's a string, then we can check for more specific string formats like dates.
	if (type === "string") {
		if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
			return "date";
		}
		// If it's a string but not a date, it remains a string.
		// This correctly handles "1123456" as a string.
		return "string";
	}

	// 3. For anything else (like null), default to "string".
	return "string";
};

export const useApiBodyStore = create<ApiBodyState>((set) => ({
	rawBody: "",
	apiBodyRows: [],

	setRawBody: (value, parsedBody) => {
		if (!parsedBody || typeof parsedBody !== "object") {
			set({ rawBody: value, apiBodyRows: [] });
			return;
		}

		const newApiBodyRows: ApiBodyRow[] = Object.entries(parsedBody).map(
			([key, val]) => ({
				id: key,
				value: val,
				// Use the new, more reliable function here
				dataType: guessDataType(val),
				testCases: [],
			})
		);

		set({ rawBody: value, apiBodyRows: newApiBodyRows });
	},

	updateRow: (rowId, newValues) => {
		set((state) => ({
			apiBodyRows: state.apiBodyRows.map((row) =>
				row.id === rowId ? { ...row, ...newValues } : row
			),
		}));
	},

	setApiBodyRows: (rows) => set({ apiBodyRows: rows }),
}));
