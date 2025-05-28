// store/useApiBodyStore.ts
import { create } from "zustand";

export interface ApiBodyState {
	rawBody: string | null;
	parsedBody: Record<string, any> | null;
	setRawBody: (value: string) => void;
	setParsedBody: (value: Record<string, any> | null) => void;
}

export const useApiBodyStore = create<ApiBodyState>((set) => ({
	rawBody: "",
	parsedBody: null,
	setRawBody: (value) => set({ rawBody: value }),
	setParsedBody: (value) => set({ parsedBody: value }),
}));
