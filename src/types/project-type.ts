export type ProjectResponseTypes = {
	payload: {
		projectId: string;
		projectName: string;
		projectDescription: string;
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

export type ProjectResponseType = {
		projectId: string;
		projectName: string;
		projectDescription: string;
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
	metadata: { nextCursor: string; hasNext: boolean; limit: number };
}
