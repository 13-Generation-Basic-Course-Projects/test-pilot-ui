export {};

declare global {
  interface APIResponse<T> {
    payload: T;
    message: string;
    status: string;
    success: boolean;
    timestamps: string;
  }
}
