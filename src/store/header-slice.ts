import { create } from "zustand";

interface HeaderState {
	headers: Record<string, string>;
	setHeaders: (headers: Record<string, string>) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
	headers: {},
	setHeaders: (headers) => set({ headers }),
}));
