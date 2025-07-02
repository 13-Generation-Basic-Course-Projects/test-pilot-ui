export interface VariableResponseTypes {
	map: any;
	success: boolean;
	message: string;
	status: string;
	timestamps: string;
	payload: {
		variableId: string;
		keyName: string;
		keyValue: string;
		enabled: boolean;
		project: {
			projectId: string;
			projectName: string;
			projectDescription: string;
			projectOwner: {
				userId: string;
				name: string;
				email: string;
				password: string;
				isVerified: boolean;
				profileImage: string | null;
				username: string;
				authorities: string[] | null;
				enabled: boolean;
				accountNonExpired: boolean;
				accountNonLocked: boolean;
				credentialsNonExpired: boolean;
			};
			createdAt: string;
			updatedAt: string;
			deletedAt: string | null;
		};
	};
}
