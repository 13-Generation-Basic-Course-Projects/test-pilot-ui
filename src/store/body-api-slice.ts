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
	setRawBody: (
		value: string | null,
		parsedBody: Record<string, any> | null
	) => void;
	updateRow: (rowId: string, newValues: Partial<ApiBodyRow>) => void;
	setApiBodyRows: (rows: ApiBodyRow[]) => void;
}

const guessDataType = (value: any): string => {
	if (typeof value === "boolean") return "boolean";
	if (typeof value === "number") return "number";
	if (
		typeof value === "string" &&
		/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
	)
		return "date";
	return "string";
};

export const useApiBodyStore = create<ApiBodyState>((set, get) => ({
	// ✨ 1. Add 'get' to access current state
	rawBody: "",
	apiBodyRows: [],

	// ✨ 2. This is the new, "smarter" setRawBody function
	setRawBody: (value, parsedBody) => {
		// Get the current state before updating
		const { apiBodyRows: oldRows } = get();

		// Create a lookup map for the old rows for efficient access
		const oldRowsMap = new Map(oldRows.map((row) => [row.id, row]));

		if (!parsedBody || typeof parsedBody !== "object") {
			set({ rawBody: value, apiBodyRows: [] });
			return;
		}

		const newApiBodyRows: ApiBodyRow[] = Object.entries(parsedBody).map(
			([key, val]) => {
				// Check if this key existed in the old state
				const existingRow = oldRowsMap.get(key);

				return {
					id: key,
					value: val,
					dataType: guessDataType(val),
					// If the row existed before, keep its test cases.
					// Otherwise, start with an empty array.
					testCases: existingRow ? existingRow.testCases : [],
				};
			}
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
