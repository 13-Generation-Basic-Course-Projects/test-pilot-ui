export type CollectionResponseTypes = {

  // Quick fix
  map(arg0: (item: any) => { id: any; title: any; endpoints: never[]; }): import(".").CollectionItem[] | PromiseLike<import(".").CollectionItem[]>;
  payload: {
    id: string;
    name: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }[];
  metadata: {
    nextCursor: string;
    hasNext: boolean;
    limit: number;
  };
};

export type CollectionResponseType = {
  id: string;
  name: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  metadata: {
    nextCursor: string;
    hasNext: boolean;
    limit: number;
  };
};
