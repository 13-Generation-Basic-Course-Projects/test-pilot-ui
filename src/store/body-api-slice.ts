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

// Helper function to guess data type from a value
const guessDataType = (value: any): string => {
	if (typeof value === "boolean") return "boolean";
	if (typeof value === "number") return "number";
	// A simple check for ISO 8601 date format
	if (
		typeof value === "string" &&
		/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
	)
		return "date";
	return "string";
};

export const useApiBodyStore = create<ApiBodyState>((set) => ({
	rawBody: "",
	apiBodyRows: [],

	// This function now also handles parsing and setting up the structured rows
	setRawBody: (value, parsedBody) => {
		if (!parsedBody || typeof parsedBody !== "object") {
			set({ rawBody: value, apiBodyRows: [] });
			return;
		}

		const newApiBodyRows: ApiBodyRow[] = Object.entries(parsedBody).map(
			([key, val]) => ({
				id: key,
				value: val,
				dataType: guessDataType(val),
				testCases: [], // Start with empty test cases
			})
		);

		set({ rawBody: value, apiBodyRows: newApiBodyRows });
	},

	// A dedicated function to update a specific row by its ID (the field name)
	updateRow: (rowId, newValues) => {
		set((state) => ({
			apiBodyRows: state.apiBodyRows.map((row) =>
				row.id === rowId ? { ...row, ...newValues } : row
			),
		}));
	},

	// A function to replace all rows if needed
	setApiBodyRows: (rows) => set({ apiBodyRows: rows }),
}));
