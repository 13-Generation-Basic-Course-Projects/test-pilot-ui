// store/request-url-slice.ts (or wherever your store is defined)
import { create } from "zustand";

export interface RequestState {
	method: string;
	url: string;
	// Add this to track the last endpoint whose method was intentionally updated
	lastPersistedEndpointUpdate: {
		projectId: string;
		collectionId: string;
		endpointId: string;
		newMethod: string;
		timestamp: number; // To ensure it's a new event
	} | null;
	setMethod: (
		method: string,
		persistenceDetails?: {
			projectId: string;
			collectionId: string;
			endpointId: string;
		}
	) => void;
	setUrl: (url: string) => void;
	clearLastPersistedEndpointUpdate: () => void; // Helper to prevent reprocessing
}

export const useRequestStore = create<RequestState>((set) => ({
	method: "GET", // Default method
	url: "",
	lastPersistedEndpointUpdate: null,
	setMethod: (newMethod, persistenceDetails) =>
		set((state) => {
			const update: Partial<RequestState> = { method: newMethod };
			if (persistenceDetails) {
				update.lastPersistedEndpointUpdate = {
					...persistenceDetails,
					newMethod: newMethod,
					timestamp: Date.now(), // Add timestamp to make it a unique event
				};
			}
			return update;
		}),
	setUrl: (url) => set({ url }),
	clearLastPersistedEndpointUpdate: () =>
		set({ lastPersistedEndpointUpdate: null }),
}));
