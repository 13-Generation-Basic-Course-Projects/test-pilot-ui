import { create } from "zustand";

interface RequestState {
	method: string;
	url: string;
	setMethod: (method: string) => void;
	setUrl: (url: string) => void;
}

export const useRequestStore = create<RequestState>()((set) => ({
	method: "GET",
	url: "",
	setMethod: (method: string) => set({ method }),
	setUrl: (url: string) => set({ url }),
}));
