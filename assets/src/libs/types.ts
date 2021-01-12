export type User = {
  id: number;
  email: string;
  inserted_at: number;
};

export enum SyncStatus {
  Success = 1,
  Syncing,
  Error,
};
