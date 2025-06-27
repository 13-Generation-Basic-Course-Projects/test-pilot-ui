// store/test-run-slice.ts
import { create } from "zustand";
import { ExecutionBatch } from "@/types/monitoring-type"; // Make sure this path is correct

interface TestRunState {
	testRunResult: ExecutionBatch | null;
	setTestRunResult: (result: ExecutionBatch) => void;
	clearTestRunResult: () => void;
}

export const useTestRunStore = create<TestRunState>((set) => ({
	testRunResult: null,
	setTestRunResult: (result) => set({ testRunResult: result }),
	clearTestRunResult: () => set({ testRunResult: null }),
}));
