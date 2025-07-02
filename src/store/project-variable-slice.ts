import { create } from "zustand";

interface VariableRow {
	variableId?: string;
	variable: string;
	value: string;
	enabled: boolean;
}

interface ProjectVariableState {
	variables: VariableRow[];
	setProjectVariables: (variables: VariableRow[]) => void;
	// This will be useful later for getting only enabled variables
	getEnabledVariables: () => { variable: string; value: string }[];
}

export const useProjectVariableStore = create<ProjectVariableState>(
	(set, get) => ({
		variables: [],
		setProjectVariables: (variables) => set({ variables }),
		getEnabledVariables: () => {
			const { variables } = get();
			return variables
				.filter((v) => v.enabled && v.variable && v.value)
				.map(({ variable, value }) => ({ variable, value }));
		},
	})
);
