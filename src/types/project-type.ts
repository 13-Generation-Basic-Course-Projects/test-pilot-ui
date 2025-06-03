export type ProjectResponseType = {
	payload: {
		projectId: "5e854eba-6577-468d-b19d-8436c9920392";
		projectName: "string";
		projectDescription: "string";
		projectOwner: {
			userId: string;
			name: string;
			email: string;
			password: string;
			isVerified: boolean;
			profileImage: string;
		};
		createdAt: string;
		updatedAt: string;
		deletedAt: string;
	}[];
	metadata: { nextCursor: string; hasNext: boolean; limit: number };
};
