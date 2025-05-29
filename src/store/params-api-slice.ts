import { create } from "zustand";

export interface ParamRow {
	key: string;
	value: string;
	cases: string[];
}

interface ParamsApiState {
	pathVariables: ParamRow[];
	queryParams: ParamRow[];
	setPathVariables: (data: ParamRow[]) => void;
	setQueryParams: (data: ParamRow[]) => void;
}

export const useParamsApiStore = create<ParamsApiState>((set) => ({
	pathVariables: [{ key: "", value: "", cases: [] }],
	queryParams: [{ key: "", value: "", cases: [] }],
	setPathVariables: (data) => set({ pathVariables: data }),
	setQueryParams: (data) => set({ queryParams: data }),
}));
