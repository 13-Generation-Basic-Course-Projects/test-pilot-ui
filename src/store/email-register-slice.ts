import { create } from "zustand";

interface RegisterState {
	registeredEmail: string | null;
	setRegisteredEmail: (email: string | null) => void;
}

export const useRegister = create<RegisterState>((set) => ({
	registeredEmail: null,
	setRegisteredEmail: (email) => set({ registeredEmail: email }),
}));
